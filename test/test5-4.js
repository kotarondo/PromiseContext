// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test recursive ctx.call()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');

ctx.depth = 0;
ctx.call("top", function sub() {
    var d = ctx.depth;
    if (d > 3) return;
    ctx.call(() => ctx.depth = d + 1);
    ctx.chain(A);
    ctx.call(sub);
    ctx.chain(B);
    ctx.call(sub);
    ctx.chain(C);
    ctx.call(() => ctx.depth = d);
})
ctx.end();

expected_result = 0;
var d1 = "<AA><BB><CC>";
var d2 = "<AA>" + d1 + "<BB>" + d1 + "<CC>";
var d3 = "<AA>" + d2 + "<BB>" + d2 + "<CC>";
var d4 = "<AA>" + d3 + "<BB>" + d3 + "<CC>";
expected_order = d4;
order_separator = '';
