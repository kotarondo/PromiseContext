// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test optimized ctx.break()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.then(() => "test1")
ctx.loop(function() {
    cp(1)
    ctx.break()
})
ctx.then(function(val) {
    cp(2)
    assertEquals(val, "test1")
})

ctx.then(() => "test2")
ctx.loop(function() {
    cp(3)
    ctx.break()
        // followings do nothing
    ctx.chain()
    ctx.then()
    ctx.throw()
    ctx.call()
    ctx.loop()
    ctx.catch()
    ctx.break()
    ctx.continue()
    cp(4)
})
ctx.then(function(val) {
    cp(5)
    assertEquals(val, "test2")
})

cp('finished');
ctx.end();

expected_result = undefined;
expected_order = "finished,1,2,3,4,5";
