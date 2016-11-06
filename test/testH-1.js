// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test Holder 

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext.Holder();
ctx.setCompletion(onFulfilled, onRejected);
var ctx1 = new PromiseContext("init");

var A = reactor_template.bind(null, 'A');
var B = reactor_template.bind(null, 'B');
var C = reactor_template.bind(null, 'C');
var D = reactor_template.bind(null, 'D');

ctx.call(A);
var old = ctx.setContext(ctx1);
ctx.call(B);
var old = ctx.setContext(old);
ctx.call(C);
ctx.end();

expected_result = "undefined:reactA:reactB:reactC";
expected_order = "<AA><BB><CC>";
order_separator = '';
