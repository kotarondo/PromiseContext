// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.throw() in ctx.loop()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');

ctx.loop(function() {
    ctx.chain(A);
    ctx.call(function() {
        ctx.throw("err");
        ctx.chain(D);
    });
    ctx.chain(D);
})
ctx.catch(function(e) {
    assertEquals(e, "err");
    ctx.chain(B);
})
ctx.chain(C);
ctx.end();

expected_result = "valueC";
expected_order = "<AA><BB><CC>";
order_separator = '';
