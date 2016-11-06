// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test chaining resolved values

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("init");
ctx.setCompletion(onFulfilled, onRejected);

var A = reactor_template.bind(null, 'A');
var B = reactor_template.bind(null, 'B');
var C = reactor_template.bind(null, 'C');
var D = reactor_template.bind(null, 'D');

ctx.then(A);
ctx.then(B);
ctx.then(C);
ctx.then(D);
ctx.end();

expected_result = "init:reactA:reactB:reactC:reactD";
expected_order = "<AA><BB><CC><DD>";
order_separator = '';
