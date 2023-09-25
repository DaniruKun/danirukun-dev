---
title:  "Implementing a local ETag cache system in Go"
description: "Implementing a local ETag cache system in Go"
date:   2022-08-06 18:40:21 +0200
pubDate: "Aug 06 2022"
categories: go programming
comments: true
heroImage: https://source.unsplash.com/y4_xZ3cs96w/1280x720
---

While I was developing a small CLI in Go that made HTTP requests to an API, I encountered a small optimization: the API used [ETags](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/ETag) to cache resource request responses. Of course, it does not make sense to always requests the entire resource anew, so just like a browser client, we should:

1. Make a request
2. Save the ETag and the corresponding response payload
3. If we make a request again to the same resource, include the ETag
4. If the response is `not_modified`, then we can just return the cached response with confidence, otherwise we return the response and cache it

So let's see how this can be done in one small file and how it can be integrated with `net/http`.

## Creating the cache system

### Defining the object store

Since Go has really great facilities for serialization/deserialization of data structures, we will go ahead and define a struct for storing two things:

- The ETag
- The response payload

```go
type Cache struct {
	Etag string `json:"etag"`
	Data interface{} `json:"data"`
}
```

### Implementing the helpers

A typical cache system needs only a few basic functions:

- **Init** (create and setup the cache system on the host)
- **Get** (get a cache entry by `key`)
- **Save** (save a cache entry by `key`)
- **Purge** (manually purge the entire cache and reset it)

```go
// Initialize ETag based cache system
func Init() {
	os.Mkdir(CacheDir(), 0770)
}

// Purge all cache entries manually by deleting all ETag files
func Purge() {
	fmt.Println("Purging cache...")
	os.RemoveAll(CacheDir())
	Init()
}

// Try to get a cache entry. Returns empty cache and falsy if does not exist, otherwise truthy.
func Get(key string) (Cache, bool) {
	file, err := os.OpenFile(filepath.Join(CacheDir(), key), os.O_RDONLY, 0666)
	defer file.Close()
	if errors.Is(err, os.ErrNotExist) {
		return Cache{}, false
	}

	bytes, _ := ioutil.ReadAll(file)
	var cache Cache
	json.Unmarshal(bytes, &cache)
	return cache, true
}

// Save data under a SHA1 key hash, with an ETag and raw data
func Save(key, etag string, raw []byte) error {
	var data interface{}
	json.Unmarshal(raw, &data)
	cache := Cache{etag, data}

	cacheData, err := json.Marshal(cache)
	if err != nil {
		return err
	}

	err = ioutil.WriteFile(filepath.Join(CacheDir(), key), cacheData, 0666)
	if err != nil {
		return err
	}

	return nil
}
```

And that is it! The way we identify unique resources in the HTTP client is by passing the request path into a hashing function like SHA1, and then saving the cache files using it as the file name, then looking it up later.

You can see a full example in action [here](https://github.com/platogo/zube-cli/blob/master/cache/cache.go).
