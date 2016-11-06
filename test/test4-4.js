// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test README.md

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');

ctx.chain(A);
var i = 0;
ctx.loop(function() {
    ctx.chain(B);
    ctx.chain(C);
    if (++i == 5) ctx.break();
});
ctx.chain(D);
ctx.end();

expected_result = "valueD";
expected_order = "<AA><BB><CC><BB><CC><BB><CC><BB><CC><BB><CC><DD>";
order_separator = '';
