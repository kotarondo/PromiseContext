// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.throw() in ctx.call()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');

ctx.call(function() {
    ctx.chain(A);
    ctx.throw("err");
    ctx.chain(D);
    ctx.catch(function(e) {
        assertEquals(e, "err");
        ctx.throw("err2");
        ctx.chain(D);
    })
})
ctx.chain(D);
ctx.catch(function(e) {
    assertEquals(e, "err2");
    ctx.chain(C);
})
ctx.chain(B);
ctx.end();

expected_result = "valueB";
expected_order = "<AA><CC><BB>";
order_separator = '';
