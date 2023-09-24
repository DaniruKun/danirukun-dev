---
title:  "My webcam is better than your webcam"
description: "Using a CCTV camera as a webcam"
date:   2021-04-24 21:47:21 +0200
pubDate: "Apr 24 2021"
categories: video
---

## Background

As soon as large-scale pandemic lockdowns started all the way back in Spring 2020, essential IT supplies like laptops, mice, keyboards and especially webcams simply disappeared from store shelves, especially the lower to mid-end of the market. Ever since then, only more premium or severely price-gouged options were left.

A couple months back, I was forced back into working mostly remotely from home, where my WFH setup includes a Macbook Pro neatly docked in closed lid mode into a Twelve South laptop stand

![Twelve South](https://cdn.shopify.com/s/files/1/0094/1621/2537/products/BookArc_MacBook2016_Product_e404a077-d5cf-458e-a710-4a5b98e3ff78_530x.jpg)

Obviously, using the iSight integrated webcam wasn't an option, so I started looking for a decent webcam up to 100$ MSRP. My key criteria were simple:

- Good image quality (decent noise control, color, sharpness)
- Decent framerate (24+ FPS and higher)
- USB plug-and-play
  
Of course, some bonus features that are desireable:

- Adjustable iris (aperture), focus and field of view (FOV)
- Integrated lighting
- Tripod / stand or an integrated tripod thread
- Interchangeable lenses

### Option 1: Using a mirrorless camera and a capture card

The first option that I thought of is using my Fuji X-T20, switching it to video mode, plugging in my HDMI output adapter and feeding it into a cheap USB capture card I got from Aliexpress. While I do get outstanding picture quality, this means I need to have it permanently mounted, and the widest lens I own is a 35mm prime, which is not wide enough for my taste.

![Fuji capture card](/assets/camera-capture.jpeg)

### Option 2: Industrial cameras

I also looked at the higher end of the webcam market and noticed that the options go for well above 100$. At this point I remembered that I have to look elsewhere - into the CCTV / industrial markets. Usually consumer-grade webcams use much smaller and worse sensors, and are very limited in terms of features.

On the other hand, in the CCTV camera world, things like interchangeable C/CS-mount lenses are commonplace, as well as decent sensors from Sony.

## Picking a camera

Eventually I settled on this camera:

![hd264 Aliexpress camera](/assets/aliexpress-cam.png)

The key features that set it apart for me was:

- Nice and minimal housing
- Dual tripod mounting threads
- Interchangeable varifocal lens with zoom, iris and manual focus adjustment
- Sony IMX322 sensor
- A USB interface with UVC (so no additional drivers required)
- Up to 1080p@30FPS
- Automatic exposure and gain

The only important thing missing was a mount, however I found a pretty simple solution - I would attach a clamp to my monitor arm, then attach an adjustable arm to the mount, and the other ballhead end to the camera housing. This way I get more adjustability than any webcam can ever provide, plus it doesn't awkwardly sit on top of my monitor.

![Camera closeup](/assets/cam0.jpg)

![Camera mounted behind the monitor](/assets/camera-mounted.png)

### Setup

Plugging the camera in, everything works out of the box as expected: most WebRTC-based teleconferencing software like MS Teams recognized it (to be sure I ran my [script to patch other video input devices](https://gist.github.com/DaniruKun/a1d57e64ae3f7c0a92bbbb2d0950f4c1)).

To get some playback through `ffplay`, on macOS it is necessary to use an `avfoundation` input device. A little convenience script does the trick:

### Capture video from a UVC compliant webcam in a specific format and playback using ffplay

```sh
#!/bin/sh

ffplay -f avfoundation \
 -video_size 1920x1080 \
 -framerate 30 \
 -probesize 21M \
 -pixel_format nv12 \
 -i "H264:none"

```

It is also possible to input the video into software like OBS and interactively apply some filters, then expose the output as a virtual camera and feed the result into other software. However, it is best to not apply demanding software post-processing, as it adds visible glass-to-glass latency.

![Sample capture](/assets/camera-capture-sample.png)

One thing to keep in mind about this kind of camera is that the lens is unmotorized - so there is no auto-focus, however it is often a benefit rather than a drawback, since poor contrast detection auto-focus can be too eager and start jumping around. During teleconferencing, usually the "talking head" subject is immobile and at a constant distance from the lens, so there is little chance you will move enough out of the focus plane to become blurry. In my setup, leaving the focus at near infinity seems to be enough.

You'll also want to put the camera as far away as you can, and adjust the focal distance accordingly - this reduces the "fisheye" effect and causes your face to look more natural, rather than fatter. This is a common trick in portrait photography and still applies here. Now you see why flexible mounts shine - you can put your camera as close or as far away as you want!
