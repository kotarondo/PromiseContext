// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test non-first ctx.break/continue() are not optimized

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var i = 0;
ctx.loop(function() {
    cp(1)
        ++i;
    ctx.then(() => {
        if (i & 1) return Promise.reject("err" + i)
        else return Promise.resolve("res" + i)
    })
    if (i >= 3) ctx.break();
    else ctx.continue()
    ctx.catch(function(err) {
        cp(2)
        assertEquals(err, "err" + i)
    })
    cp(4)
})
ctx.then(function(val) {
    cp(5)
    assertEquals(val, "res4")
})

cp('finished');
ctx.end();

expected_result = undefined;
expected_order = "finished,1,4,2,1,4,1,4,2,1,4,5";
