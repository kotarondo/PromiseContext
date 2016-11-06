// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.then() reject

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilledE, onRejectedE);

var A = reactor_template.bind(null, 'A');
var B = reactor_templateE.bind(null, 'B');
var C = reactor_template.bind(null, 'C');

ctx.then(A);
ctx.then(B);
ctx.then(C);
ctx.end();

expected_error = "undefined:reactA:rejectB";
expected_order = "<AA><BB>";
order_separator = '';
