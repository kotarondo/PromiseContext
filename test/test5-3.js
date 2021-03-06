// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.break() in ctx.loop()

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
        ctx.chain(B);
        ctx.break();
        ctx.chain(D);
    });
    ctx.chain(D);
})
ctx.catch(function(e) {
    cp("dont reach here");
})
ctx.end();

expected_result = "valueB";
expected_order = "<AA><BB>";
order_separator = '';
