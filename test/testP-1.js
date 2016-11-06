// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// performance test: first continue()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilledP, onRejected);

perf_name = "first ctx.continue()";
perf_loops = 100000;

var i = 0;
ctx.loop(function() {
    if (++i > perf_loops) ctx.break();
    ctx.continue();
});
ctx.end();
