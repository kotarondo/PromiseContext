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

var i = 0;
ctx.loop(0, function() {
    ctx.chain(A);
    ctx.loop("L2", function() {
        ctx.chain(B);
        ctx.call(0, function() {
            if (++i == 1) ctx.continue(0);
        });
        ctx.chain(C);
        ctx.break();

    });
    ctx.chain(D);
    ctx.break();
});

var j = 0;
ctx.loop("", function() {
    ctx.chain(A);
    ctx.loop("L2", function() {
        if (++j == 1) ctx.continue("");
        ctx.chain(B);
        ctx.break();
    });
    ctx.chain(C);
    ctx.break();
});

ctx.end();

expected_result = "valueC";
expected_order = "<AA><BB><AA><BB><CC><DD><AA><AA><BB><CC>";
order_separator = '';
