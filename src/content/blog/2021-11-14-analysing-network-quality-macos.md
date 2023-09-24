---
title:  "The secret of the macOS Monterey network quality tool"
description: "The secret of the macOS Monterey network quality tool"
date:   2021-11-14 22:40:21 +0200
pubDate: "Nov 14 2021"
categories: macos
comments: true
---

## What is network quality?

Network quality can mean different things, depending on the context. When we talk about wireless link quality, often we focus on **Layer 1** properties like **RSSI**, **noise**, the **Tx/Rx rate** etc. However, today I want to focus on **Transport layer** metrics that can be collected with the new `networkQuality` tool.

### Usage

It seems that Apple has quietly added a new tool in [macOS Monterey](https://www.apple.com/macos/monterey/) for measuring your device's Internet connectivity quality. You can simply call the executable `networkQuality`, which executes the following tests:

- Upload/download **capacity** (your Tx/Rx bandwidth essentially)
- Upload/download **flows**, this seems to be the number of test packets used for the responsiveness tests
- Upload/download **responsiveness** measured in **Roundtrips Per Minute (RPM)**, which according to Apple, is the number of sequential round-trips, or transactions, a network can do in one minute under normal working conditions

The capacity is roughly the same metric you could expect from tools like [Fast.com](https://fast.com) from Netflix, or [OOkla's Speedtest](https://www.speedtest.net). 

For example:
```bash
λ networkQuality
==== SUMMARY ====
Upload capacity: 14.696 Mbps
Download capacity: 21.661 Mbps
Upload flows: 20
Download flows: 12
Responsiveness: Low (103 RPM)
```

### Why the macOS tool wins in some aspects

While these tools measure a few more metrics like **latency** to a target server, they both only measure capacity, and do this only in **serial** mode (the download and upload speed tests are done sequentially one after the other).

On the other hand, `networkQuality` measures the upload/download capacity and responsiveness **in parallel** by default (can be overridden to sequential mode with the `-s` argument). In my opinion, this test is closer to some real-world use-cases, which are also mentioned in the [official Apple support docs](https://support.apple.com/en-gb/HT212313): **video chat** and **voice calls**. In these scenarios, you not only receive a media stream, but also transmit one (for example, the feed from your webcam, screen sharing, or your microphone), so a proper network test needs to simulate both in parallel.

The tool will also provide you with a simple classification of your network quality from `Low`, `Medium` and `High`.

```bash
λ networkQuality -s
==== SUMMARY ====
Upload capacity: 14.035 Mbps
Download capacity: 57.650 Mbps
Upload flows: 20
Download flows: 20
Upload Responsiveness: Low (107 RPM)
Download Responsiveness: High (2253 RPM)
```

**UPDATE**: Hello HN! Thanks to everyone for the [great comments and suggestions](https://news.ycombinator.com/item?id=29225308). Just wanted to include something the folk have discovered that I didn't have time for: the tool uses Apple's CDN at `https://mensura.cdn-apple.com/api/v1/gm/config` as a target for the requests.

### Conclusion

Of course, Apple's tool is not a full replacement for `ping` or [speedtest-cli](https://github.com/sivel/speedtest-cli), but it provides pretty useful connectivity tests that I haven't seen in common CLI tools yet, and it's nice that it is included in the new release.

If you use Emacs, you can now also run this tool using the [osx-lib](https://melpa.org/#/osx-lib) package.
