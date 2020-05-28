---
layout: post
title: Using Lambdas To Achieve Currying
date: '2020-05-26T00:04:00.000-04:00'
author: Brett Koenig
tags: [Typescript]
category: FunctionalTypescript
---
One of the most fundamental principles of functional programming is the ability to use partial application to inject dependencies. To achieve partial application you need curried functions. Most functional languages like F# and Haskell have currying built-in but Typescript does not. The popular [Ramda library](https://ramdajs.com) has a fantastic [curry method](https://ramdajs.com/docs/#curry). However, when using Typescript it makes typing out your functions before you implement them difficult because you have to plan for the `Curry` type in all of your function signatures.  Also, the return type for a curried function using the library is `any` which doesn't help with type safety. It honestly just makes things look messy and not clear. The following is an example of creating a function type definition with Rambda.
``` typescript

type ValidateManualPayment = Curry<(a: AmountOwed, u: UnvalidatedManualPayment) => ValidatedManualPayment>;
```

With that type definition, you could implement the type with the following code.
``` typescript

const validateManualPayment: ValidateManualPayment = curry(function (amountOwed: AmountOwed, unvalidatedManualPayment: UnvalidatedManualPayment) {
  // Do validations
  // ...
  return ValidatedManualPayment(invoiceId, paymentAmount, note);
});
```

Now the great thing about a curried function is that you can call it with just the parameters you have available to create a new function.  For instance, if I had the `AmountOwed` value and at a later point in the code I would have the `UnvalidatedManualPayment`, I could do the following.
``` typescript

const amountOwed = ...;
const validate = validateManualPayment(amountOwed);
```

Then later I could call `validate()` with the `UnvalidatedManualPayment` object. Also, I can still use `validateManualPayment()` like a normal function.
``` typescript

const amountOwed = ...;
const unvalidatedManualPayment = ...;

const validatedManualPayment = validateManualPayment(amountOwed, unvalidatedManualPayment);
```

A second issue arises when you want to use a partially applied function as an argument to another function.  When you do this you will lose your type protections because the partially applied function's type is `any`. The compiler can't tell that it doesn't fit the parameter definition so it won't complain.
``` typescript

function workflow(func: (u: object) => string, obj: object) {
  return func(obj);
}

function workflow2(func: (u: string) => object, str: string) {
  return func(str);
}

function exampleUsingWorkflow() {
  const amountOwed = 12.50;
  const validate = validateManualPayment(amountOwed);
  const obj = {};

  workflow(validate, obj);
  workflow2(validate, 'hey');
}
```

Sadly the transpiler doesn't complain about `workflow()` or `workflow2()` even though both of them are not valid calls.

### My Approach

To get type safety in the form of the transpiler complaining, I use single parameter lambdas to define my functions. Here are the function definition and implementation.

``` typescript

type ValidateManualPayment = 
  (_: AmountOwed) 
    => (_: UnvalidatedManualPayment) 
    => ValidatedManualPayment;

const validateManualPayment: ValidateManualPayment = 
  (amountOwed: AmountOwed) 
  => unvalidatedManualPayment: UnvalidatedManualPayment) 
  => {
    // Do validations
    // ...
    return ValidatedManualPayment(invoiceId, paymentAmount, note);
  };
```

I use `_` for the parameter definitions in the type because it doesn't matter what it is called at that point.  I'm just defining the structure of the functions.

With this approach, the previous example complains as shown below.
![compiler complaining about types](/assets/images/2020-05-26-type-error.png)

I now have the type safety that I want and the ability to do a partial application as I want. The only drawback is that to call the function all at once it looks a little ugly.
``` typescript

const amountOwed = ...;
const unvalidatedManualPayment = ...;

const validatedManualPayment = validateManualPayment(amountOwed)(unvalidatedManualPayment);
```

This function call isn't the worst thing ever but it sure isn't as pretty as it is in F# and Haskell.

##### Parts:
{% include functionalTsLinks.html %}
