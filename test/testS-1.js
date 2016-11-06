// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test joinContext on ended context

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("init");
ctx.setCompletion(onFulfilled, onRejected);
var ctx1 = new PromiseContext("init1");

ctx1.end();

ctx.join(ctx1);

ctx.end();

expected_result = "init1";
expected_order = "";
