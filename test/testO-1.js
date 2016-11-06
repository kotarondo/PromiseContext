// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test optimized ctx.continue()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.then(() => "test1")
var i = 0;
ctx.loop(function() {
    cp(1)
    if (++i == 3) ctx.break();
    ctx.continue()
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
    assertEquals(val, "test1")
})

cp('finished');
ctx.end();

expected_result = undefined;
expected_order = "finished,1,4,1,4,1,4,5";
