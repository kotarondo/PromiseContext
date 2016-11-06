// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test chaining resolved values in ctx.call() with ctx.throw()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("init");
ctx.setCompletion(onFulfilled, onRejected);

var A = reactor_template.bind(null, 'A');
var B = reactor_template.bind(null, 'B');
var C = reactor_template.bind(null, 'C');
var D = reactor_template.bind(null, 'D');

ctx.then(A);
ctx.call("L1", function(val) {
    assertEquals(val, "init:reactA");
    ctx.then(B);
    ctx.throw("L1");
    ctx.then(C);
});
ctx.catch(function(err) {
    assertEquals(err, "L1");
    ctx.then(D);
});
ctx.end();

expected_result = "L1:reactD";
expected_order = "<AA><BB><DD>";
order_separator = '';
