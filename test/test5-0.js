// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.call() basically

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');
var E = executor_template.bind(null, 'E');

ctx.chain(A);
ctx.call(function() {
    ctx.chain(B);
    ctx.call(function() {
        ctx.chain(C);
    })
    ctx.chain(D);
})

ctx.call(function() {
    ctx.chain(E); // will be aborted
    ctx.chain(E); // will be aborted
    ctx.chain(E); // will be aborted
    throw "err";
})
ctx.catch(function(e) {
    assertEquals(e, "err");
    ctx.chain(B);
    ctx.call(function() { // we can ctx.call() in catch clause
        ctx.chain(C);
    })
    ctx.chain(D);
})
ctx.end();

expected_result = "valueD";
expected_order = "<AA><BB><CC><DD><BB><CC><DD>";
order_separator = '';
