---
layout: post
title: No Hidden Return Types
date: '2020-05-28T00:04:00.000-04:00'
author: Brett Koenig
tags: [Typescript]
category: FunctionalTypescript
---
One of the issues with your everyday imperative function is that the return type, especially when dealing with IO, often lies to you. Take the following as an example.
``` ts

const division = (numerator: number) => (divisor: number): number => {
  if(divisor === 0) throw Error('Can not divide by 0');
  else return numerator / divisor;
};
```

What type does the function division return? The type says a number but, that isn't always true. What happens if the divisor is 0? An `Error` is returned from the function. In that way, we are being lied to by the function return type. It isn't always a number. This is where using more descriptive types is helpful. A side benefit is that you will no longer need to use as many exceptions as well. 

### Option
The first type that you are likely to use is an Option type. I chose to use the [fp-ts](https://github.com/gcanti/fp-ts) library by [Giulio Canti](https://github.com/gcanti). The following example is how you create an Option type.

``` ts

import {Option, some, none} from 'fp-ts/lib/option';

const division = (numerator: number) => (divisor: number): Option<number> => {
  if(divisor === 0) return none;
  else return some(numerator / divisor);
};
```

Now the function never lies to you about what it will be returning. It is either something that is a number or nothing. You create an Option by using either the `some` or the `none` constructor. The `some` constructor takes 1 argument and that is the data that exists. There is already an optional notation built into Typescript. Another side benefit of using the Option type is that in code that uses the returned Option you don't have to check if it is null first. All you have to do is lift the function you want to call with the Option type as well. Here is an example.
``` ts

import {Option, some, none, map} from 'fp-ts/lib/option';

const division = (numerator: number) => (divisor: number): Option<number> => {
  if(divisor === 0) return none;
  else return some(numerator / divisor);
};

const addition = (augend: number) => (addend: number): number => {
  return augend + addend;
};

const addThree = addition(3);

const noneDivisionResult = division(4)(0); // none
const noneAdditionResult = map(addThree)(noneDivisionResult); // none

const someDivisionResult = division(5)(5); // some(1)
const someAdditionResult = map(addThree)(someDivisionResult); // some(4)
```

From the example, you can see that `map` lifts a function into the desired context. The context in this case is the Option context. If the value is something then the map function is called with that value. If the value is nothing then it doesn't even bother calling the map function and just returns the none value. Some people call this "short-circuiting". When you chain together a bunch of functions this way, you can skip calling the code that doesn't need to be called because there is no value.

Before moving on, it is important to note that lifting a function into a specific context will always return a type of that context. `map` for and Option works the same way as `map` does for an array. You may have an array of a new type but you will still have an array after mapping over it.
``` ts

import {Option, some, none, map} from 'fp-ts/lib/option';

const numArr: number[] = [1,2,3];
const strArr: string[] = numArr.map((val: number) => val + ''); // ['1','2','3']

const numOption: Option<number> = some(1);
const strOption: Option<string> = map((val: number) => val + '')(numOption); // some("1")
```

As you can see, even the built-in Javascript `map` behaves the same way as the Option `map`. This concept is very important for moving forward with functional programming because once you lift into a context you tend to need to stay in that context for the entirety of the workflow. There will be more posts about this topic later.

When you are done with your workflow you can bring it back to a normal basic type by using the `fold` function.
``` ts

import {Option, some, none, map, fold} from 'fp-ts/lib/option';

const numOption: Option<number> = some(1);
const strOption: Option<string> = map((val: number) => val + '')(numOption); // some("1")

const getStringValue = fold(() => null, (str: string) => str);

console.log("The value is: " + getStringValue(strOption)); // The value is: 1
```

The first function is what to do when the value is `none`. The second function is what to do if the value is `some`.

### Either
In the previous division example, we used the Option type. However, for that specific case, it isn't the type we want. An Option is either something or nothing but we get no information on why it is nothing. When we need feedback on what went wrong it is often best to use the Either type.
``` ts

import {Either, left, right} from 'fp-ts/lib/either';

const division = (numerator: number) => (divisor: number): Either<string, number> => {
  if(divisor === 0) return left('Can not divide by 0');
  else return right(numerator / divisor);
};
```

Either is completely generic, with the left side and right side being whatever you would like it to be. It is often convention to use the left side as the error and the right side as the success said. This is because the `map` for Either will only run the function if it is a right-side value. If you need to lift the left side to work with it you would use `mapLeft`. Also, I like to use strings as my error side because at a later point I can use `mapLeft` to turn into a specific type of error. Whether that be a Typescript `Error` or another custom error type.

I often use `bimap` when I need to introduce IO side effects with my Either type. You can still use `fold` with Either and it works the same way as it does with Option but, with `fold` you are trying to merge the left and right side to create one value and with `bimap` you are dealing with each side independently. 

The previous example with the Option type is below but with Either.
``` ts

import {Either, left, right, map, bimap} from 'fp-ts/lib/either';

const division = (numerator: number) => (divisor: number): Either<string, number> => {
  if(divisor === 0) return left('Can not divide by 0');
  else return right(numerator / divisor);
};

const addition = (augend: number) => (addend: number): number => {
  return augend + addend;
};

const handleError = (error: string): void => {
  console.log('Error: ' + error);
};

const handleSuccess = (value: number): void => {
  console.log('Success: ' + value);
}

const addThree = addition(3);

const leftDivisionResult = division(4)(0); // left('Can not divide by 0')
const leftAdditionResult = map(addThree)(leftDivisionResult); // left('Can not divide by 0')

const rightDivisionResult = division(5)(5); // right(1)
const rightAdditionResult = map(addThree)(rightDivisionResult); // right(4)

bimap(handleError, handleSuccess)(leftAdditionResult); // Error: Can not divide by 0
bimap(handleError, handleSuccess)(rightAdditionResult); // Success: 4
```

So that is it, no more misleading return types. I hope you enjoyed it!

##### Parts:
{% include functionalTsLinks.html %}