# Class: PromiseContext

`PromiseContext` gives a dynamically programmable context which is executed asynchronously.

The context is built as a thread of chained native `Promise`s.

A new `Promise` can be chained to the context by a programming method then().

Other useful programming methods chain(), throw(), join() and sleep() also program the context.

Structural method call() chains a sub context which can be programmed afterwards.

The argument of call() is a context subroutine which programs the sub context.

Context subroutine is executed when corresponding `Promise` is about to resolve.

In execution of context subroutine, sub context can be programmed by the same programming methods as the main context.


## Main or sub context

Programming methods are used on both main and sub context.

* If it is called in context subroutine, it acts on sub context.
* Otherwise it acts on the main context.


## Loop

Structural method loop() chains sub contexts repeatedly.

The argument of loop() is a context subroutine.

The context subroutine is executed every time the loop repeats.

The method break() exits the loop without executing following `Promise`s in the sub context.

The method continue() continues the loop without executing following `Promise`s in the sub context.


## Labelled or unlabelled break()/continue()

The rule is similar to JavaScript.

* Labelled break() matches same-labelled loop() or call().
* Labelled continue() matches same-labelled loop().
* Unlabelled break() matches any-labelled or unlabelled loop().
* Unlabelled continue() matches any-labelled or unlabelled loop().
* Most inner match is valid.


## Context subroutine

If the context subroutine throws an error, the sub context is not executed at all.

If the context subroutine build no program, it is treated as a reaction function.

Otherwise, returned value of context subroutine is ignored.


## Catching an error


## Context value


### new PromiseContext([value])

* value <Value> initial context value of this context


### ctx.getPromise() 

returns a currently chained `Promise` to this context


### ctx.then(reaction [, catchReaction])

* reaction <Function>
* catchReaction <Function>

The reaction will be called with one argument: `value`

The catchReaction will be called with one argument: `error`


### ctx.chain(executor)

* executor <Function>

The executor will be called with two arguments: `resolve` and `reject`


### ctx.throw (error)

* error <String>|<Object>



### ctx.join(promise)

* promise <Object>



### ctx.sleep(msec)

* msec <Integer>


### ctx.call([label,] subroutine)

* label <String>
* subroutine <Function>


### ctx.loop([label,] subroutine)

* label <String>
* subroutine <Function>


### ctx.catch (subroutine)

* subroutine <Function>

### ctx.break ([label])

* label <String>


### ctx.continue ([label])

* label <String>


### ctx.setCompletion(onFulfilled[, onRejected])

* onFulfilled  <Function>
* onRejected <Function>

calling setCompletion() on sub context throws an error.


### ctx.end() 

calling end() on sub context throws an error.

After end(), calling program methods on main context throws an error.
