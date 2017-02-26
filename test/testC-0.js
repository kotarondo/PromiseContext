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
    ctx.call(function() {
        assertEquals(PromiseContext.getCurrentContext(), ctx)
        cp(2);
        throw 123;
    })
    ctx.catch(function(e) {
        assertEquals(PromiseContext.getCurrentContext(), ctx)
        assertEquals(e, 123)
        cp(3);
    })
    var i = 0;
    ctx.loop(function() {
        assertEquals(PromiseContext.getCurrentContext(), ctx)
        cp(4);
        if (++i == 2) ctx.break()
    })
})

assertEquals(PromiseContext.getCurrentContext(), undefined)

cp('finished');
ctx.end();

expected_result = undefined;
expected_order = "finished,1,2,3,4,4";
