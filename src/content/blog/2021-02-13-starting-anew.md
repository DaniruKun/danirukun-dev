---
title:  "A new chapter"
description: "A new chapter"
date:   2021-02-12 21:47:21 +0200
pubDate: "Feb 12 2021"
categories: update
heroImage: https://source.unsplash.com/K5sjajgbTFw/1280x720
---

During the weekend, I found some time to finally migrate the `www.danpetrov.xyz` website to something a bit more modern.

## The old stack

Previously the website was written in plain HTML5, CSS and JavaScript, and then uploaded to an AWS S3 bucket. My CloudFlare DNS would point to the bucket and provide static page caching, and that was that.

![Old](/assets/hld.svg)

For a while this simple setup was more than enough, however editing or modifying almost anything becomes a huge pain, as there is no templating, no minification or fancy modern static asset release optimization that you will see in almost any modern bundler.

## The shiny new stuff

I have heard of static site generators for a while like [Jekyll](https://jekyllrb.com) and [Hugo](https://gohugo.io). At their core, they take some markup in a variety of plaintext formats like MarkDown or AsciiDoc, and produce a ready to go static website. They also come with a variety of plugins and clever methods of DRY.

In the end I ended up choosing Jekyll as it is the simpler tool of the two, even if it sacrifices some performance and customizability. Of course, I also found a theme I liked which came with some ready to go layouts like a homepage, blog and socia links. Instead of having to write hand-crafted markup, you can now just write a YAML that looks something like this:

{% highlight yaml %}

# Your social accounts.
social:
  github: danirukun
  twitter: danirukun
  linkedin: daniilpetrov18

{% endhighlight %}

Aside from the static asset creation, I decided to switch to [Github Pages](https://pages.github.com) since it provides free hosting for small websites, and you can easily update your website using Github Actions like [this one for Jekyll](https://github.com/marketplace/actions/jekyll-actions).

Essentially your build website is also stored in Git, so if there is ever a need to quickly make a hotfix, you can just edit it directly in Github!

## Future

I will most likely stick with this setup for a long while, and in this blog I will write smaller posts or those I don't consider polished enough for my [Medium](https://medium.com/@thedanpetrov), which you can follow too.
