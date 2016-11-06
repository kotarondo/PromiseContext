// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test chaining resolved values in ctx.catch() with ctx.break()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("init");
ctx.setCompletion(onFulfilled, onRejected);

var A = reactor_templateE.bind(null, 'A');
var B = reactor_template.bind(null, 'B');
var C = reactor_template.bind(null, 'C');
var D = reactor_template.bind(null, 'D');

ctx.call("L1", function() {
    ctx.then(A);
    ctx.catch(function(val) {
        assertEquals(val, "init:rejectA");
        ctx.then(B);
        ctx.break("L1");
        ctx.then(C);
    });
    ctx.then(C);
    ctx.then(A);
});
ctx.then(D);
ctx.end();

expected_result = "init:rejectA:reactB:reactD";
expected_order = "<AA><BB><DD>";
order_separator = '';
