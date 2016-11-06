// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test without setCompletion

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');

ctx.chain(A);
ctx.chain(B);
ctx.chain(C);
ctx.then(onFulfilled);
ctx.catch(onRejected);
ctx.end();

expected_result = "valueC";
expected_order = "<AA><BB><CC>";
order_separator = '';
