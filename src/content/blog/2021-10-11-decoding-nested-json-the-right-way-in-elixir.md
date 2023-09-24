---
title:  "Decoding nested JSON the right way in Elixir"
description: "Decoding nested JSON the right way in Elixir"
date:   2021-10-11 20:00:21 +0200
pubDate: "Oct 11 2021"
categories: elixir programming
---

## Introduction

While I was working on a new [HTTP client for the Holodex API](https://github.com/DaniruKun/ex-holodex), I chose the typical stack consisting of:

- [HTTPoison](https://github.com/edgurgel/httpoison), the popular Elixir HTTP client powered by [Hackney](https://github.com/benoitc/hackney)
- [Jason](https://github.com/michalmuskala/jason), the fast JSON coder / decoder library

While `Jason` still takes higher spots in [benchmarks](https://gist.github.com/michalmuskala/4d64a5a7696ca84ac7c169a0206640d5), it lacks certain features, that I will demonstrate below.

## The problem

When you consume an HTTP JSON API resource, you receive a JSON string, and then you decode it with your JSON decoder of choice:

```elixir
Jason.decode!(~s({"name":"Dan","age":42,"nationality":"Latvian"}))
%{"name" => "Dan", "age" => 42, "nationality" => "Latvian"}
```

However, you end up with a plain Elixir **map**, which has many disadvantages:

- Keys are **binaries** by default, instead of **atoms**
- You can't use the `map.key_name` syntax, which is not idiomatic and [assertive enough](https://dashbit.co/blog/writing-assertive-code-with-elixir)
- It is harder to reason about the shape of the data within your system's domain

## Solutions

### Solution A: Pre-process response bodies in the HTTP client

A frequent pattern that HTTP client libraries like `HTTPoison` show is to simply [define a set of fields that you expect to receive, then iterate over the map keys and convert them to atoms manually](https://github.com/edgurgel/httpoison#wrapping-httpoisonbase).

```elixir
defmodule Holobot.Holofans.Client do
  @moduledoc """
  Holofans API HTTP client implementation, based on HTTPoison.
  """
  use HTTPoison.Base

  @expected_fields ~w(count total channels videos query comments)
  @api_version "v1"

  @impl true
  def process_request_url(url) do
    Application.fetch_env!(:holobot, :holofans_api) <> "#{@api_version}" <> url
  end

  @impl true
  def process_response_body(body) do
    body
    |> Poison.decode!()
    |> Map.take(@expected_fields)
    |> Enum.map(fn {k, v} -> {String.to_atom(k), v} end)
  end
end
```

However, there are many issues with this approach:

- We now have an **overly specific assumption** about the **shape** of the data we will receive (what if we expect an array of objects as the root entity?)
- Only the top level **keys** are converted to **atoms**, but any kind of **nested objects** will stay as maps with binary keys (now you will have different accessor syntax based on the depth!)
- [String.to_atom/1](https://hexdocs.pm/elixir/1.12/String.html#to_atom/1) puts you in danger of overflowing your [global atom table](https://www.erlang.org/erlang-enhancement-proposals/eep-0020.html), in a system that has very high uptime and does many requests, this could become a big issue
- The client callbacks become **bloated**, which should be quite small and only apply minimal transformations to your requests and responses.
- Since it is not a struct, convenient libraries like [TypedStruct](https://github.com/ejpcmac/typed_struct) cannot be taken advantage of.

Also, if you do want to attempt to create structs from the deserialised data, you might end up implementing a `builder` like this:

```elixir
  @spec build_record(map) :: t()
  def build_record(video) do
    %__MODULE__{
      yt_video_key: video["yt_video_key"],
      title: video["title"],
      status: video["status"],
      live_schedule: video["live_schedule"],
      live_start: video["live_start"],
      live_end: video["live_end"],
      live_viewers: video["live_viewers"],
      channel: video["channel"]["yt_channel_id"],
      is_uploaded: video["is_uploaded"],
      duration_secs: video["duration_secs"],
      is_captioned: video["is_captioned"]
    }
  end
```
Of course, this is rarely the way to go, since it creates a lot of duplication. It is possible to work around this by using a library like [ExConstructor](https://github.com/appcues/exconstructor), but it still does not solve the issue of nested structures.

### Solution B: Use Poison's built-in object decoding functionality

A colleague shared a recent lightning talk from ElixirConf about a feature of `Poison` I didn't know about: decoding of a JSON string **as a struct** of your choice:

```elixir
Poison.decode!(~s({"name": "Dan", "age": 42}), as: %Person{})
#=> %Person{name: "Dan", age: 42}
```

Great! The HTTP client is clean, we can dynamically specify the shape of the data, and the structure definition modules are also free of helper functions.

It seems that `Poison` also solves the problem of **dynamically generated atoms** under the hood by using the [String.to_existing_atom/1 function](https://github.com/devinus/poison/blob/e5c0867aaf3c9e9cb6da424580dcd8e1a25081d0/lib/poison/parser.ex#L174).

**UPDATE**: It seems that the most reliable way to ensure this happens is by also passing the option `keys: :atoms!` to `Poison.decode/2`, for example:

```elixir
Poison.decode!(~s({"name": "Dan", "age": 42}), %{as: %Person{}, keys: atoms!})
```

The only problem left is **nested data**. This is where the feature has practically no documentation to speak of, but it works the following way:

```elixir
defmodule Holodex.Api.Videos do
  alias Holodex.Api.Client
  alias Holodex.Model.{Channel, Comment, Video}

  @list_of_videos_p [
	%Video{
	  channel: %Channel{},
	  clips: [%Video{}],
	  sources: [%Video{}],
	  refers: [%Video{}],
	  simulcasts: [%Video{}],
	  mentions: [%Channel{}]
	}
  ]

  with url <- build_videos_url(opts),
		   body <- Client.get!(url).body do
		Poison.decode!(body, %{as: @list_of_videos_p})
	  end
end

# Returns:
  [
	%Holodex.Model.Video{
	  available_at: "2024-08-11T11:05:00.000Z",
	  channel: %Holodex.Model.Channel{
		banner: nil,
		clip_count: nil,
		description: nil,
		english_name: "Planya",
		id: "UCQaGj_l3dqmGWJLEbEmwgFQ",
		...
	  },
	  id: "Sc5MRAvMm18",
	  live_viewers: nil,
	  mentions: nil,
	  ...
	},
  ...
  ]
```
We expect an array of `Video` objects, which might also contain a nested `Channel`, as well as arrays of `Video`s and `Channel`s nested under different fields. Then we define a **pattern** for the decoder to capture (in this case `@list_of_videos_p` as a module attribute for reuse and to keep functions clean). The **pattern** simply defines how the data maps to **structs** of your choice. Then all that is left for you is to define **type specs** for your structs, and now you can also take full advantage of type specs:

```elixir
  @spec list_videos(opts()) ::
          {:ok, [Video.t()]} | {:error, HTTPoison.Error.t()} | {:error, Exception.t()}
  def list_videos(opts \\ %{}) do
    with url <- build_videos_url(opts),
         {:ok, response} <- Client.get(url),
         {:ok, decoded} <- Poison.decode(response.body, %{as: @list_of_videos_p}) do
      {:ok, decoded}
    end
  end
```


## Conclusion

Of course, this solution does not come with free lunch: `Poison` is still a bit slower than its main competitor, `Jason`. However, in most cases of decoding external data, this major feature of `Poison` is more valuable than CPU time or memory usage.

There is also an issue with using keyword list args with `Poison.decode/2` (Dialyzer will complain), which I [have raised here](https://github.com/devinus/poison/issues/199).
I have also raised the issue of poor documentation on the `as` option usage [HERE](https://github.com/devinus/poison/issues/200), which I hope to also address.

If you have more suggestions on how this can be done better, feel free to reach out on

- Twitter [@danirukun](https://twitter.com/DaniruKun)
- Elixir Slack `@danpetrov`
- Matrix `@dpetrovs:matrix.org`
