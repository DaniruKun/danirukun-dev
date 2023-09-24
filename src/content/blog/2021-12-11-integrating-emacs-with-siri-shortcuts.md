---
title:  "Integrating Emacs with Siri Shortcuts"
description: "Integrating Emacs with Siri Shortcuts"
date:   2021-12-11 17:00:21 +0200
pubDate: "Dec 11 2021"
categories: macos emacs lisp
comments: true
---

![Emacs, Shortcuts, HomeKit](/assets/emacs-shortcuts-homekit.png)

## The big new feature in macOS Monterey

One of the most exciting features in the latest annual release of macOS was the introduction of [Siri Shortcuts](https://support.apple.com/en-us/HT209055) to the desktop for the first time. This isn't the first automation solution to be introduced to OS X / macOS: before, it was common to craft custom workflows and automations in [Automator.app](https://support.apple.com/en-gb/guide/automator/welcome/mac), or write custom [AppleScript](https://developer.apple.com/library/archive/documentation/AppleScript/Conceptual/AppleScriptLangGuide/introduction/ASLR_intro.html) / OSAscript scripts.

Now, it is possible to automate practically anything not only in the macOS, but the Apple ecosystem in general:

<video controls width="720">
    <source src="https://devstreaming-cdn.apple.com/videos/wwdc/2021/10232/4/F45F16B7-D0DD-4D4D-954B-1704C1063E3C/cmaf.m3u8"
            type="video/mp4">

    Sorry, your browser doesn't support embedded videos.
</video>

In this post I'll also demo how you can automate anything in the Apple ecosystem from the comfort of [GNU Emacs](https://www.gnu.org/software/emacs/), the world's most extensible editor.

## Integrating with Shortcuts

### The Shortcuts CLI

While the new Shortcuts app is the main place for creating and sharing Shortcuts, Monterey also shipped with a new CLI tool conveniently called `shortcuts`. For example, you can run any Shortcut directly from your shell:

```bash
shortcuts run SampleShortcut
```

### Shortcuts URL scheme

macOS also exposes a new URL scheme appropriately named `shortcuts://` as described in [the official documentation](https://support.apple.com/en-gb/guide/shortcuts-mac/apd621a1ad7a/mac).

For example, to open the editor for a Shortcut called `SayDogg`, it would look like `shortcuts://open-shortcut?name=SayDogg`.

### Emacs

I have recently created a new Emacs package called [siri-shortcuts.el](https://github.com/DaniruKun/siri-shortcuts.el), which allows you to:

- Interactively run Siri Shortcuts with auto completion
- Launch and search the Shortcuts gallery (there is an [open issue related to search](https://feedbackassistant.apple.com/feedback/9803481))
- Launch an editor for a Shortcut
- Use simple helper functions to make your own automations and much more

![Demo](https://github.com/DaniruKun/siri-shortcuts.el/blob/master/shortcuts-demo.gif?raw=true)

For example, let's create a simple automation where when opening an Elixir file / project, the color of a smart light strip in HomeKit will switch to purple and show a notification.

![Shortcut example](/assets/shortcut-demo.png)

Next, we add the following line to our init file (e.g. `init.el`):

```emacs-lisp
(add-hook 'elixir-mode-hook (lambda () (siri-shortcuts-run "SetLightStripToPurple")))
```

Now, when Elixir mode is activated, it will trigger the Shortcut!

![Demo](https://i.imgur.com/AXTamcp.mp4)

## Conclusions

Of course, this is just the tip of the iceberg of what is possible with Shortcuts. I am excited to see what clever automations you will come up with, and feel free to share them with me in the comments or on [Twitter](https://twitter.com/DaniruKun)!

## Links

<https://github.com/DaniruKun/siri-shortcuts.el>

[Siri Shortcuts User Guide](https://support.apple.com/en-gb/guide/shortcuts-mac/welcome/mac)

## Attributions

Emacs Logo - By Amin Bandali - https://emacsconf.org/2020/, CC BY-SA 4.0, https://commons.wikimedia.org/w/index.php?curid=97319543

