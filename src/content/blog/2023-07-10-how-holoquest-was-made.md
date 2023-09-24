---
title:  "How HoloQuest was made for DoKomi 2023"
description: "How HoloQuest was made for DoKomi 2023"
pubDate: "Jul 30 2023"
categories: programming hololive svelte elixir
---

It was just over a month before the [DoKomi 2023](https://www.dokomi.de/en) convention in Dusseldorf. The [hololive fan booth](https://www.hololivefanbooth.com) (or Fanstand) was slowly taking shape. This year, it was going to be even better than last year. However, one aspect was not organized yet - the stamp rally.

## What is a stamp rally?

A [stamp rally](https://en.japantravel.com/guide/introduction-to-stamp-rallies/46627) is a fun activity that is popular in Japan. It is a game where you collect stamps from different booths and get a prize at the end. It is a great way to get people to visit all the booths and interact with the exhibitors or artists. The stamps are usually collected on some kind of printed sheet of paper, which is then handed in at the end of the rally. At the end, participants get a prize for completing the rally.

## The inspiration for HoloQuest

When I visited [AnimeNYC](https://animenyc.com) in 2022, the official convention app had a digital "stamp rally" built in. It was very basic - find 5 QR codes in specific locations, scan them, and get your prize! I thought that this was a great idea, but it could be improved. I wanted to make a digital stamp rally that was more fun and engaging - after all I have the experience and know how in backend development of social, real-time systems with millions of users.
Other digital stamp rally implementations I researched were very basic in design, and had several security issues - it was extremely trivial to cheat.

<div align="center">
  <img src="/assets/how-holoquest-was-made/animenyc-stamp-rally.jpeg" alt="AnimeNYC Stamp Rally">
</div>

## Laying down the requirements

To be the same or even better than the rally last year, there were some fundamental requirements:

- It must work on _any_ smartphone, without the need to install an app
- It must work **offline** if need be
- It shouldn't require any registration or login from the user
- It must be hard to cheat
- It must be **fun and engaging**!

## The technology stack

It became clear that the stamp rally would be a web app, optimized for phones. Modern web apps are incredibly capable, and can even work offline and access device hardware. I decided to use [Svelte](https://svelte.dev/) as the frontend framework, as it is very lightweight and easy to use. I also decided to use [Elixir](https://elixir-lang.org/) and [Phoenix](https://www.phoenixframework.org/) as the backend, as I have a lot of experience with it, and it is very well suited for real-time applications.

The [homepage of the booth](https://www.hololivefanbooth.com) already used Svelte by then, so the choice of framework for the client was pretty clear. I also decided to use [TailwindCSS](https://tailwindcss.com/) as the CSS framework, as it is very easy to use and has a lot of flexibility.

![Fan booth landing page](/assets/how-holoquest-was-made/hololivefanbooth.com.png)

## The design

The app would start off with a "virtual" stamp sheet, with greyed out stamps the user would have to collect. The stamp sheet intentionally mimics a real-life paper sheet to make it a bit more "familiar", and also allow for the final completion mechanic in the end. As stamps are collected, the images and colors spring to life, indicating progress.

<div align="center">
  <img src="/assets/how-holoquest-was-made/holoquest-app-stamp-sheet.png" alt="HoloQuest App Stamp Sheet">
</div>

## The server side

The [web server](https://github.com/watsonindustries/tako) (code named "tako"), would host the online features, such as:

- Device registration
- Online leaderboard
- Event broadcasts

The platform/language of choice was Elixir, as it is very well suited for real-time applications. It is the same technology used for apps such as [Discord](https://elixir-lang.org/blog/2020/10/08/real-time-communication-at-scale-with-elixir-at-discord/).

It was a bit of a gamble, but this time I decided to try out the [Ash framework](https://ash-hq.org). It is still quite new, but it makes modeling domains and writing DSLs a breeze, saving a ton of time on manually implementing things like JSON-API compliant APIs.

Each HoloQuest client would connect to the server using [Phoenix Sockets](https://hexdocs.pm/phoenix/Phoenix.Socket.html) and [Phoenix Channels](https://hexdocs.pm/phoenix/channels.html), which is an abstraction over transports like WebSocket. Whenever a user would scan a QR code, the client would push the message to the server, which would then broadcast it to others. 

Here's an early prototype of the app, showing off the scanner and the realtime event system:

<div align="center">
	<video controls muted style="width: 100%;">
		<source src="/assets/how-holoquest-was-made/holoquest-scan-broadcast-demo.mp4" type="video/mp4">
		Your browser does not support the video tag.
	</video>
</div>

This scales incredibly well, and is very easy to implement. The JavaScript Phoenix client implementation also solves a lot of common problems for you: it does buffering, reconnects, heartbeats and even exponential retries. Even if the network conditions are not great, the client will still try to reconnect and send messages.

![Basic architecture](/assets/how-holoquest-was-made/tako.png)

For hosting, I tried my luck once again with [Fly.io](https://fly.io) . It is a fantastic successor to Heroku. Unlike Heroku, fly still has a free tier, and frankly their tooling is really amazing. I also met employees of Fly in person, and they are some really brilliant folk who know what they are doing. I only had a small issue initially with making the WireGuard tunnel work, but afterwards deploying stuff was a breeze.

Small thing to keep in mind: make sure you are aware of different Postgres roles and permissions. For the Tako database, I needed to install a couple of extensions to Postgres first, and that could only be done from a specific role. So this required manually connecting to the hosted DB and adding them for the `tako` database. Afterwards, migrations happen just fine automatically.

## The client

[The client](https://github.com/watsonindustries/holoquest) was the most complicated part of the whole setup. The emphasis was on "offline-first", so most things in the web app have to work even when offline.

For the stamp validation, you cannot simply include the "expected" stamp tokens in the client. It would be very easy to datamine and then cheat by generating your own QR codes from them.

Instead, the client only stores the expected `SHA1` hashes of the tokens, or checksums. `SHA1` is a cryptographic hash function, meaning its output is deterministic and cannot be reversed. This means that the client can only tell if the scanned token is correct or not and which artist it belongs to.

![QRCode scan workflow](/assets/how-holoquest-was-made/qrcode-scan-workflow.png)

In the current implementation, the client also doesn't require any proactive signup or registration - it happens automatically and is bound to the device's browser. This is done by generating a unique ID for the device, and storing it in the browser's local storage. This way, the user can simply open the app and start scanning QR codes. This of course creates a small usability risk - clearing the local storage during the event will reset your progress. Also, some privacy browsers will always clear all local storage when the browser is closed, however these cases are in a very small minority.

## The landing page

An often overlooked part of the whole experience is the [landing page](https://www.hololivefanbooth.com/holoquest). It is the first thing the user sees, and it should have an incredibly clear user flow, no matter how it is accessed.

Since the web app is smartphone-only, we need to anticipate that it might be opened on a desktop, and should direct the user to open it on their smartphone. A very trivial way to check the device is to simply use media queries - if the screen is wider than 600px, it is probably a desktop. This is not a perfect solution, but it works well enough in most cases.

When the page is opened on a desktop, the usual button to open the app instead opens a modal with a QR code. This QR code directs to the app itself, and is easy to scan with a smartphone. This approach was actually inspired by Reddit, which uses a similar approach on their website.

<div style="display: flex; flex-wrap: wrap; justify-content: center;">
  <div style="flex: 1; min-width: 200px; max-width: 50%; padding: 5px;">
    <img src="/assets/how-holoquest-was-made/holoquest-landing-page-mobile.png" alt="HoloQuest Landing Page Mobile" style="width: 80%;">
  </div>
  <div style="flex: 1; min-width: 500px; max-width: 80%; padding: 5px;">
    <img src="/assets/how-holoquest-was-made/holoquest-landing-page-desktop.png" alt="HoloQuest Landing Page Desktop" style="width: 100%;">
  </div>
</div>

## The big day

During the first day, I was pleasantly surprised that there were almost no issues with the core features of the app. Even the riskiest part of the app - the real time events and leaderboard - functioned without major issues. The only rare issues we discovered were:

- A rare bug with specific browser + device combinations where the camera feed is just static green (fixed easily by switching browsers)
- Sometimes setting the usernames failed (could have been caused by poor connectivity in the convention hall, never managed to reproduce)

The only issue that is still on my mind is the scanner often not working on iOS when the app was "added to homescreen". It is quite hard to reproduce and debug, and for the time being we simply decided to advise people not to do that, and just use the app normally in Safari.

### The leaderboard

The leaderboard was a feature that was added quite last minute. The purpose was to give the users a sense of competition, as well as foster a sense of community.

A colleague also suggested a very good idea - dynamic usernames. The goal was to reduce friction for the users, while also having unique identifiers that fit in with the hololive theme. The solution was to generate a random adjective and hololive fan name for each user, and then use that as their default username. This way, the users don't have to think of a username, and they are also unique.

<div align="center">
	<img src="/assets/how-holoquest-was-made/holoquest-leaderboard.jpeg" alt="HoloQuest Leaderboard" style="width: 50%;">
</div>

One thing that was confusing for users was how exactly the ranking worked. In the current implementation it gets quite random when people have the same score, so the XP system will need to be reworked in the future.

### Bonus - Gacha

The gacha was also a last minute feature to give users something extra to look forward to when completing the quest - and of course, it had to be hololive themed!
There are a lot of directions to go from here, so the first version was simply there to test the waters.

The main idea was to also introduce new hololive members to people who might not be familiar with them, and have a direct link to Holodex curated clips.

<div align="center">
	<img src="/assets/how-holoquest-was-made/holoquest-gacha.png" alt="HoloQuest Gacha" style="width: 50%;">
</div>

## Where do we go next?

The goal is to re-use HoloQuest for future conventions as well. It is already quite generic and customizable, and needs just a few improvements:

- Utilize Phoenix Channels more
- Move most communication to Channels, maybe drop the JSON API all together?
- Improve more things with the PWA Workbox
- Rethink the leaderboard and XP system, make the leaderboard update in real time

For those who attended DoKomi - thank you for participating, and I hope you enjoyed the stamp rally!

## Links

All of the current implementations of the server and client (even the landing pages) are open source, and can be found on GitHub:

- [Tako Server](https://github.com/watsonindustries/tako)
- [HoloQuest App](https://github.com/watsonindustries/holoquest)

This was quite a big project with a lot of people involved, so make sure to check out the full credits too!

- [Credits](https://www.hololivefanbooth.com/credits)

Other useful resources:

- [QR Code generator](https://qrbtf.com)
- [Elixir Lang](https://elixir-lang.org)

We are always looking for talented people that like to make cool things at Watson Industries, so feel free to [join our Discord](https://discord.gg/aw6US84T) and say hi!
