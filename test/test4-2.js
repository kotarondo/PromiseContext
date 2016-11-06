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

ctx.chain(A).chain(B).chain(C).end();

expected_result = "valueC";
expected_order = "<AA><BB><CC>";
order_separator = '';
