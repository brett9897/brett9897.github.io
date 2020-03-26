---
layout: post
title: Domain Modeling Made Functional With Typescript
date: '2020-03-26T00:04:00.000-04:00'
author: Brett Koenig
tags: 
modified_time: '2020-03-26T00:23:50.979-04:00'
---

I have been reading <a href="https://pragprog.com/book/swdddf/domain-modeling-made-functional" target="_blank">Domain Modeling Made Functional</a> by <a href="https://fsharpforfunandprofit.com/" target="_blank">Scott Wlaschin</a> and I really like the ideas he presents. I have been primarily a JavaScript developer for the past 5 years and I initially shunned Typescript because I didn't like the fake classes that it provided. It was an abstraction that didn't really work for me because when I tried to code like I was still doing C# I would run into strange issues. However that all changed when I started getting into typed functional programming!

I am still a beginner at FP. After dabbling in Haskell, Scala, and Purescript I honestly still was struggling with it. I cast it off and went back to my normal JavaScript coding. Then I started working on a large enterprise application and JS just fell short. I could never remember the function signatures and development was moving along slowly. The inevitable happened and I added Typescript to the project. However, I wasn't going to use their class syntax because I still don't like it. I was just going to use it's ability for intellisense and build up types from only the primitive types. I refused to use interfaces and classes though.

That change improved my development speed dramatically. I was sold that types were a good thing. I decided to dabble in my FP learning again and a search on YouTube lead me to a video by Scott Wlaschin and he explained FP so simply that I started adding some of the techniques to my code base. Finally I got around to buying his book and that is when everything changed.

I'm not going to try to rewrite Scott's book here because he honestly already did a great job. If you build business applications or just want to broaden your programming horizons I highly recommend reading it. However, I am going to show you my approach of converting what he did using F# into Typescript.

### Why will strongly typed functional programming help me build better business software?

The thing that converted me was the ability to have your compiler (or transpiler in this case) help you make sure you are programming with the correct data. Since most of business applications is taking data from one source and transforming it for another use. What better way to model that than with types? When you do that, now your code documents your model and it will help other programmers (or yourself from 3 months ago) learn how it works in a shorter amount of time.

Scott uses the example of an ordering and billing system, but my background is mainly in digital marketing software so my example will draw from that.

In search engine marketing there are multiple search engines (i.e. Google, Bing, Yahoo, Yandex). The marketing campaign objects for each search engine was similar but not exactly the same, so they all had to be dealt with slightly differently. Someone early on when they were adding Bing as the second search engine, decided that they were basically the same so they would just reuse the same campaign object. But the objects weren't exactly the same so you ended up with code like the following
<script src="https://gist.github.com/brett9897/88c0656a5de6514cc166ca04b375b9e1.js"></script>
Now that isn't extremely easy to follow when you are new to the codebase and the kicker is that you can actually accidentally send a Bing campaign to `handleGoogleCampaignSpecifics()`. Since that is a possibility now we have to consider doing another check inside `handleGoogleCampaignSpecifics()` to throw an error if somehow it didn't get the proper campaign at runtime.

Consider the following.
<script src="https://gist.github.com/brett9897/aa70c952e5723c94fc0f64da51655f05.js"></script>
There are multiple benefits to this approach. First of all now we know that there is no place in our code that accidentally calls `handleGoogleCampaignSpecifics()` with a Bing campaign because the transpiler will complain about it long before you ever run your code. Secondly the two campaign types are free to evolve however they need to as requirements change. Maybe a `GoogleCampaign`'s name can only have a maximum length of 50 characters we can handle this with a constrained type (I will explain that further later). Thirdly if we start work on a third search engine we can easily just model their campaign and then just add it to the `Campaign` type like 
```typescript
type Campaign = GoogleCampaign | BingCampaign | NewSearchEngineCampaign
``` 
and add another case to the switch statement\*. The final benefit is that we can move all of the data validation to the boundaries of the application where the objects of each type are created. That way we can remove duplicate data validation checks and assume that the object being passed in is valid because it fits the type's shape and was validated before it was created.

\*NOTE: You can't actually use the typeof operator like that in Typescript so we will have to come up with another solution.

##### Parts:
[Part1: Building Simple Types]({% post_url 2020-03-25-converting-f-types-to-typescript %})

##### Further Reading
[https://fsharpforfunandprofit.com/ddd/](https://fsharpforfunandprofit.com/ddd/)