// Copyright (c) 2017, Kotaro Endo.
// license: "BSD-3-Clause"

// test getCurrentContext()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.call(function() {
    assertEquals(PromiseContext.getCurrentContext(), ctx)
    cp(1);
    var ctx1 = new PromiseContext();
    ctx1.call(function() {
        assertEquals(PromiseContext.getCurrentContext(), ctx1)
        cp(2);
        ctx.call(function() {
            assertEquals(PromiseContext.getCurrentContext(), ctx)
            cp(3);
        })
        ctx.end();
    })
    ctx.call(function() {
        assertEquals(PromiseContext.getCurrentContext(), ctx)
        cp(4);
        ctx1.call(function() {
            assertEquals(PromiseContext.getCurrentContext(), ctx1)
            cp(5);
        })
    })
    ctx1.call(function() {
        assertEquals(PromiseContext.getCurrentContext(), ctx1)
        cp(6);
    })
})

assertEquals(PromiseContext.getCurrentContext(), undefined)

cp('finished');

expected_result = undefined;
expected_order = "finished,1,2,4,6,3,5";
