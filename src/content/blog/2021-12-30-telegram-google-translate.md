---
title:  "How Telegram Messenger circumvents Google Translate's API"
description: "How Telegram Messenger circumvents Google Translate's API"
date:   2021-12-30 18:40:21 +0100
pubDate: "Dec 30 2021"
categories: programming
comments: true
---

## Telegram Messenger's newest update

You might have heard that Telegram has released arguably [their biggest update of the year](https://telegram.org/blog/reactions-spoilers-translations) this week. While the backend of the messaging platform remains proprietary, the source code of the mobile and desktop clients is[ open source](https://github.com/DrKLO/Telegram).

The big new feature is [Message Translations](https://telegram.org/blog/reactions-spoilers-translations#message-translation), which allows to translate the text of messages within the app. What is interesting is how this is implemented in the official Android app.

## How the Telegram Android app circumvents the official Google Cloud Translate API

### Undocumented Google Translate API endpoint

If you check the official [Cloud Translate REST API documentation](https://cloud.google.com/translate/docs/reference/rest/v2/translate), you will see that the official API uses a versioned API path (e.g. `/language/translate/v2`), and human readable query parameters, which importantly include the API key `key`. However, if we check[ Telegram's implementation](https://github.com/DrKLO/Telegram/commit/9e740dfd4d2b1ab6b8ed2b972e0f72fc9b8bd09d#diff-bc405602f072ccdb4e595ac9f577f6bfae72778c6a989bf81021b79cfef28568R1081), we will notice a few things in the `fetchTranslation` method:

They use another path, and also seem to intentionally split up the request path with multiple string joins (perhaps for obscurity / avoid detection in the Play Store review process?):

```java
uri = "https://translate.goo";
uri += "gleapis.com/transl";
uri += "ate_a";
uri += "/singl";
uri += "e?client=gtx&sl=" + Uri.encode(fromLanguage) + "&tl=" + Uri.encode(toLanguage) + "&dt=t" + "&ie=UTF-8&oe=UTF-8&otf=1&ssel=0&tsel=0&kc=7&dt=at&dt=bd&dt=ex&dt=ld&dt=md&dt=qca&dt=rw&dt=rm&dt=ss&q=";
uri += Uri.encode(text.toString());
```

We can deduce from the query string that:

- `client` is some kind of client caller specifier (e.g. webapp / native app?)
- `sl` and `tl` are source and target languages
- `ie` and `oe` are input and output encoding of the text data
- `ssel` and `tsel` have something to do with text selection?
- `q` is the query text (the URI encoded text to actually translate)

**UPDATE**: This workaround is explained very well in [this blog post](https://vielhuber.de/en/blog/google-translation-api-hacking/), so definitely check it out.

### User agent rotation

Another thing I noticed is that Telegram keeps an array of strings containing various User Agents, with comments indicating percentages (what they represent is not clear to me at the moment):

```java
private String[] userAgents = new String[] {
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.45 Safari/537.36", // 13.5%
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.110 Safari/537.36", // 6.6%
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:94.0) Gecko/20100101 Firefox/94.0", // 6.4%
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:95.0) Gecko/20100101 Firefox/95.0", // 6.2%
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36", // 5.2%
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.55 Safari/537.36" // 4.8%
};
```

In the same method, it seems that they randomly pull a user agent from this array and pass it to the request to Google:

```java
connection.setRequestProperty("User-Agent", userAgents[(int) Math.round(Math.random() * (userAgents.length - 1))]);
```

It seems like a classic example of user agent rotation, a technique often used by web scrapers to avoid being rate limited / blacklisted by web services.

## Conclusion

It seems that to get around the problem of translating text on Android in Telegram and not pay huge Google Cloud fees and risk leaking their API key, Telegram found some obscure way of querying the Cloud Translate API directly at no cost to them. 

My advice would be to simply use their pre-built official Java SDK, and utilize [RPC over HTTP](https://cloud.google.com/translate/docs/reference/rpc) to save on bandwidth (which will be very substantial given Telegram's [over 500 million active users](https://t.me/durov/142). To me it seems the feature was heavily rushed in time for the end of the year, given the state of the new code linked above.
