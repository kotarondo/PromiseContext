// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.then()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = reactor_template.bind(null, 'A');
var B = reactor_template.bind(null, 'B');
var C = reactor_template.bind(null, 'C');

ctx.then(A);
ctx.then(B);
ctx.then(C);
ctx.end();

expected_result = "undefined:reactA:reactB:reactC";
expected_order = "<AA><BB><CC>";
order_separator = '';
