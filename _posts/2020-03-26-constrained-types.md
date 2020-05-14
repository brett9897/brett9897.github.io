---
title: Constrained Types Using Typescript
author: Brett Koenig
date: '2020-03-26T20:36:00.000-04:00'
tags: [Typescript]
category: FunctionalTypescript
---
Now that we know how to create a simple type. Let's look at a constrained type.

A constrained type is a type that is checked upon creation to make sure that the value is actually of that type.  A google example would be an email type.  We know that an email has a specific shape based on the specification.  When we create a field that is supposed to be an email we make sure that it is a valid email before returning the object.

I'll show you an example with the `OrderId` that we used in the previous example.  We are going to assume that an `OrderId` must exist and must be at most 50 characters.

### First Attempt

```typescript

enum OrderTypes {
    OrderId = '_OrderId'
}

type OrderId = {
    readonly _tag: OrderTypes.OrderId,
    readonly value: string
};

namespace OrderId {
    function create(str: string): OrderId {
        if(str === undefined || str === null ||  str === '') {
            throw 'OrderId must not be null or empty';
        }
        else if(str.length > 50) {
            throw 'OrderId must not be more than 50 characters';
        }
        else {
            return {
                _tag: OrderTypes.OrderId,
                value: str
            };
        }
    }
}
```
Then you can use it like in the following snippet.
```typescript

const orderId: OrderId = OrderId.create('1234');
const value: string = orderId.value;
```
As you can see if you create it using the `OrderId.create()` method then you can be guaranteed that you only get an `OrderId` if it is valid. There are however a couple of drawbacks doing it this way. The first being that you can still create an object that is an OrderId type by going around the create method.
```typescript

const orderId: OrderId = {
    _tag: OrderTypes.OrderId,
    value: ''
};
```
Now we have an illegal `OrderId`. Not only that but if you have intellisense, hovering over the type will tell you how to create it.

![intellisense of the OrderId type](/assets/images/intellisense_of_type.png)

### Second Attempt

```typescript

interface OrderId {
    readonly _tag: OrderTypes.OrderId,
    readonly value: string
};

namespace OrderId {
    function create(str: string): OrderId {
        if(str === undefined || str === null || str === '') {
            throw 'OrderId must not be null or empty';
        }
        else if(str.length > 50) {
            throw 'OrderId must not be more than 50 characters';
        }
        else {
            return {
                _tag: OrderTypes.OrderId,
                value: str
            };
        }
    }
};
```
That is basically the same as the first attempt except that it uses an interface instead of a type. Because it is an interface the intellisense no longer tells you exactly how to create an object of that type.

![intellisense of the OrderId interface](/assets/images/intellisense_of_interface.png)

That is a little bit better because at least a consumer of our module wouldn't know how to create the object unless they looked in the source code. Sadly though they still can if they want to be malicious.

### Final Attempt
```typescript

interface OrderId {
    readonly _tag: OrderTypes.OrderId;
    create(str: string): OrderId;
    value(orderId: OrderId): string;
}

class OrderId implements OrderId {
    public readonly _tag = OrderTypes.OrderId;
    private internalValue: string;

    private constructor(str: string) {
        this.internalValue = str;
    }
    
    static create(str: string): OrderId {
        if(str === undefined || str === null || str === '') {
            throw 'OrderId must not be null or empty';
        }
        else if(str.length > 50) {
            throw 'OrderId must not be more than 50 characters';
        }
        else {
            return new OrderId(str);
        }
    }

    static value(orderId: OrderId): string {
        return orderId.internalValue;
    }
}
```
This final attempt requires us to use the `interface` and `class` keywords but, it is the only way I have found to keep the object secure.  You can do some Javascript tricks to still mess with it, but if you are using just Typescript it will keep you safe.  I'm honestly still torn between attempt 2 and the final attempt.  Attempt 2 is more functional, but I like that this final attempt forces the user to use `OrderId`'s `create()` method.

However, using the type is a little bit different now. Now you have to use `OrderId.value()` to get at the object's value.
```typescript

const orderId: OrderId = OrderId.create('1234');
const value = OrderId.value(orderId);
```
&nbsp;
##### Parts
{% include functionalTsLinks.html %}