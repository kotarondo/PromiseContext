// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// performance test:  ctx.call() with subcontext

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilledP, onRejected);

perf_name = "ctx.call() with subcontext";
perf_loops = 100000;
var exec = 0;

function testF() {
    exec++;
    ctx.then();
}

var i = 0;
ctx.loop(function() {
    for (var j = 0; j < 100; j++) {
        ctx.call(testF);
        if (++i == perf_loops) ctx.break();
    }
});
ctx.call(function() {
    assertEquals(exec, perf_loops);
});
ctx.end();
