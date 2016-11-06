// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test joinContext itself

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("init");
ctx.setCompletion(onFulfilled, onRejected);

ctx.sleep(100);
ctx.join(ctx);
ctx.end();

expected_result = "init";
expected_order = "";
