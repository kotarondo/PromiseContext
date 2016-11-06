// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test special labels ("" , 0)

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');

ctx.loop(0, function() {
    ctx.chain(A);
    ctx.loop("L2", function() {
        ctx.call(0, function() {
            ctx.break(0);
        });
        ctx.chain(C);
        ctx.break();
    });
    ctx.chain(B);
    ctx.break();
});

ctx.loop("", function() {
    ctx.chain(C);
    ctx.loop("L2", function() {
        ctx.break("");
    });
    ctx.chain(D);
    ctx.break();
});

ctx.end();

expected_result = "valueC";
expected_order = "<AA><CC><BB><CC>";
order_separator = '';
