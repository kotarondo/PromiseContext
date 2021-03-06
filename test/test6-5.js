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
ctx.loop("L3", function() {
    if (++i == 2) ctx.break();
    ctx.chain(A);
    ctx.loop("L2", function() {
        ctx.chain(B);
        ctx.call("L3", function() {
            ctx.continue("L3");
        });
        ctx.chain(C);
    });
    ctx.chain(D);
});
ctx.end();

expected_result = "valueB";
expected_order = "<AA><BB>";
order_separator = '';
