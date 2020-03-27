---
layout: post
title: Simple Types Using Typescript
date: '2020-03-26T20:20:00.001-04:00'
author: Brett Koenig
tags: [Typescript]
category: FunctionalTypescript
modified_time: '2020-03-26T00:18:56.690-04:00'
permalink: ':year/:month/:slug'
---

Here we are going to look into how we can build simple types that the Typescript transpiler will recognize as a unique type.

### Type Alias

The first issue is that the basic type command in Typescript is just an alias and not a distinguishable type.
<script src="https://gist.github.com/brett9897/cd4729948a762f0846e6162e49cbca09.js"></script>
When you create a type like this it looks correct when defining functions but you realize that a string can be passed in place of an OrderId. The point here is to restrict the function call so that we can't do the following.
<script src="https://gist.github.com/brett9897/9d6282811860d1a7a5dcaf3ac1b70bff.js"></script>
The two biggest issues here are that we aren't confirming that an `OrderId` is actually passed in and we can treat an `OrderId` exactly as if it was the same as a string. Does concatenating a "1" onto the end of an OrderId make any sense? Probably not.

### Tagged Type

The first solution I adopted was to use a tagging solution that is pretty common.
<script src="https://gist.github.com/brett9897/714f76c45e7cbeebc2c59843e2e46c9c.js"></script>
There are a few issues with this approach. The first is that you have to remember how to construct an OrderId type every time you need one. The second is that when you are in a situation where you need to switch case on the type you have to remember the exact string you tagged it with. The third is that the object is too open and a new developer to the project could start messing with the type and change the _tag or value field directly.

### Improved Tagged Type

From there a came up with an improved solution for simple types. 
<script src="https://gist.github.com/brett9897/299122e35c949472bf535e9065a8bf43.js"></script>
Now there is an easy way to build a new type and it is named exactly the same as the type. This looks a little more like F# now. Also, the ability for anyone to update the type directly is removed. I thought about overloading the OrderId function so it could behave like F#'s destructuring but since it is so easy to just use orderId.value I decided that was probably a better approach. Another improvement is that we moved the type's tag into an enum. We could then have each modules type tags as a single enum and thus making figuring out which type we are dealing with easier.

### Determining Which Type We Have

Sometimes it will become important to figure out which type we have. The most common case is dealing with errors. Here is an example.
<script src="https://gist.github.com/brett9897/e716da7c34cb1e85080d8c784e81fef9.js"></script>

This is the end for dealing with simple types. In my next post I will discuss constrained types. Also, yes I hear you, this is a lot of boilerplate to get started but in the end the function calls knowing they are getting the correct type is completely worth it.

##### Parts
{% include functionalTsLinks.html %}