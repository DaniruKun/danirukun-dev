---
title:  "Toggling macOS VPN from the Terminal"
description: "Toggling macOS VPN from the Terminal"
date:   2021-11-28 17:00:21 +0200
pubDate: "Nov 28 2021"
categories: macos
comments: true
---

## The native macOS VPN client

Every modern macOS version comes with a built-in VPN client, located in `System Preferences > Network`. It works by creating a new `service` of type `VPN` and giving it a name (e.g. `MyVPN`).

### How to connect / disconnect from a specific VPN

The simples way to do this is to use the built-in `networksetup` util. For example, to connect to the VPN service `MyVPN`, you would call:

```bash
networksetup -connectpppoeservice "MyVPN"
```

Similarly, to disconnect, you would call:

```bash
networksetup -disconnectpppoeservice "MyVPN"
```

Since these commands are quite long, it is advised to make short aliases for them and add them to your `.*rc` file:

```bash
alias vpnc='networksetup -connectpppoeservice "MyVPN"'
alias vpndc='networksetup -disconnectpppoeservice "MyVPN"'
```
