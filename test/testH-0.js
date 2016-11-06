// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test Holder 

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext.Holder();
ctx.setCompletion(onFulfilled, onRejected);

var A = reactor_template.bind(null, 'A');
var B = reactor_template.bind(null, 'B');
var C = reactor_template.bind(null, 'C');

ctx.call(A);
ctx.call(B);
ctx.call(C);
ctx.end();

expected_result = "undefined:reactA:reactB:reactC";
expected_order = "<AA><BB><CC>";
order_separator = '';
