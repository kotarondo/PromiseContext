# PromiseContext

PromiseContext gives a useful asynchronous executing context.

* easy chaining of executors
* optional completion routine
* deferred subroutine call
* subroutine can be looped
* break/continue a loop
* labelled break/continue

practical usages can be found in FileOutputStream ...


## Basic

Let A be a example executor below.
 
```javascript
function A(resolve, reject){
	console.log("in A");
	setTimeout(function(){
		resolve();
		console.log("out A");
	}
	, 100); // 100ms
}
```

Let B,C are executors similar to A.
In order to execute these executors in a row, do the following:

```javascript
var ctx = new PromiseContext();
ctx.chain(A);
ctx.chain(B);
ctx.chain(C);
ctx.end();
```

A is called asynchronously after ctx.end().
B is called after A is resolved.
C is called after B is resolved.

As a result of this example, following sequence will be printed on console:
```
in A
out A
in B
out B
in C
out C
```

Following code is equivalent to the above code.

```javascript
new PromiseContext().chain(A).chain(B).chain(C).end();
```


## Catching an error or a rejection

This is a same manner as Promise.

```javascript
ctx.chain(A);
ctx.catch(function(err){
	// if A called 'reject(err)' instead of 'resolve()', 
	// 'err' would hold the value rejected in A.
});
```


## Completion

Completion routines can be set as follows:

```javascript
ctx.setCompletion(onFulfilled, onRejected);
```

One of completion routines will be called after all the executors resolved.


## Call subroutines

```javascript

var ctx = new PromiseContext();
ctx.chain(A);
ctx.call(function sub(){
	ctx.chain(B);
	ctx.chain(C);
});
ctx.chain(D);
ctx.end();
```

This example obtains a similar results to chaining A,B,C,D,
but the function 'sub' is called asynchronously after A is resolved.

## Loop subroutine

```javascript
var i=0;
ctx.loop(function (){
	ctx.chain(A);
	ctx.chain(B);
	if (++i == 5) ctx.break();
});
```

## Break a loop outside

```javascript
ctx.loop(function (){
	ctx.chain(A);
	ctx.catch(function (err){
		ctx.chain(B);
		ctx.break();
	});
});
```

```javascript
ctx.loop('L1', function (){
	ctx.chain(A);
	var i=0;
	ctx.loop(function (){
		ctx.chain(B);
		ctx.catch(function (err){
			ctx.break('L1');
		});
		if (++i == 5) ctx.break();
	});
});
```

## Continue a loop

```javascript
ctx.loop(function (){
	ctx.chain(A);
	ctx.catch(function (err){
		ctx.chain(B);
		ctx.continue();
	});
	ctx.chain(C);
});
```
