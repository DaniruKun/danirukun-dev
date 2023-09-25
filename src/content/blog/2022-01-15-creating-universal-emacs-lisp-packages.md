---
title:  "Creating universal Emacs Lisp packages and scripts"
description: "Creating universal Emacs Lisp packages and scripts"
date:   2022-01-15 18:40:21 +0200
pubDate: "Jan 15 2022"
categories: emacs lisp programming
comments: true
heroImage: https://live.staticflickr.com/1710/23856168871_6df1faa565_b.jpg
---

A few weeks ago, I decided to create a dedicated Emacs package for work, which contains helpful commands specific to our team's workflow. Of course, not everyone in the company uses Emacs as their editor (and you cannot expect them to). This problem got me thinking - how can I create a fantastic DevX for the Emacs users, but at the same time without leaving out non-Emacs users?

## Emacs as a Lisp interpreter

Modern Emacs allows to not only byte compile (and even natively compile) packages, but also still interpret Emacs Lisp scripts in a completely headless way. This means that you can use the full power of a high level, homo-iconic language like Elisp to automate common chores, and also use all of the benefits of the highly productive Emacs development workflow. However, we also want to use this script as a normal Emacs package. This leads us into the next section.

## How to make a package behave like a script

Unfortunately there are barely any guides on how to implement this polymorphic behavior, which is why I am writing this guide.

First, let's create a minimal Emacs package and call it `foo.el`:

```lisp
;;; foo.el --- Foo development and productivity utils  -*- lexical-binding: t; -*-

;;;###autoload
(defun bar ()
  "Print foo bar."
  (interactive)
  (message "Foo Bar!"))

(provide 'foo)
```

Next, to allow us to simply call the script as if it was a regular shell script, we need to add this shebang to the first line of the file:

```bash
#!/usr/bin/env emacs --script
```

This should locate `emacs` on almost any system, as well as switch on [batch mode](https://www.emacswiki.org/emacs/BatchMode) to interpret the script.

Next, let's make a special "CLI" section at the end of the file, and also create a small predicate function to easily tell when the file is running as a script or not:

```lisp
;;;; CLI

(defun foo-running-as-script-p ()
  "Return truthy if running as Elisp script."
  (member "-scriptload" command-line-args))
```

Finally, we need to define an entrypoint (think of it like a `main` in mainstream languages). I found that the simplest way is to create a `main` function and run it when the script is being interpreted:

```lisp
(defun main ()
  "Entrypoint for foo"
  (pprint command-line-args-left)
  (message "Do stuff here"))
  
(when (foo-running-as-script-p)
  (main))
```

The best part is that you can use the same `message` and `yes-or-no-p` as you would with an Emacs package, and they will behave in an interactive way, even when executed from the command line.

One final thing to note: you might have to explicitly require some Elisp modules if you are using certain functions (e.g. `cl-defun` from `cl-lib`). The easiest way to tell which ones, is to try to execute your script interactively and add any missing modules like so:

```lisp
(require 'cl-lib)
```

The full example looks like this:

<script src="https://gist.github.com/DaniruKun/2af40cb1fe8ee5bac82b281f1102820d.js"></script>

Make the script executable with `chmod +x foo.el` and call it like so:

```bash
$ ./foo.el somearg
("somearg")
Do stuff here
```

Congratulations! You now have a universal Emacs package + script. Hopefully this guide has been helpful.


## Honorable mentions

<https://leancrew.com/all-this/2008/04/emacs-lisp-as-a-scripting-language/>

<https://kitchingroup.cheme.cmu.edu/blog/2014/08/06/Writing-scripts-in-Emacs-lisp/>
