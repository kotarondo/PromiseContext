// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.continue()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');

var i = 0;
ctx.loop("L1", function() {
    ctx.chain(A);
    ctx.loop("L2", function() {
        i++;
        if (i == 3) ctx.break("L1");
        ctx.chain(B);
        if (i == 1) ctx.continue("L2");
        ctx.chain(C);
        if (i == 2) ctx.continue("L1");
    });
    ctx.chain(D);
});
ctx.end();

expected_result = "valueA";
expected_order = "<AA><BB><BB><CC><AA>";
order_separator = '';
