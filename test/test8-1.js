// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test chaining resolved values in ctx.loop();

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("init");
ctx.setCompletion(onFulfilled, onRejected);

var A = reactor_template.bind(null, 'A');
var B = reactor_template.bind(null, 'B');
var C = reactor_template.bind(null, 'C');
var D = reactor_template.bind(null, 'D');

ctx.then(A);
var i = 0;
ctx.loop(function(val) {
    i++;
    if (i == 1) assertEquals(val, "init:reactA");
    if (i == 2) assertEquals(val, "init:reactA:reactB:reactC");
    if (i == 3) assertEquals(val, "init:reactA:reactB:reactC:reactB:reactC");
    ctx.then(B);
    if (i == 3) ctx.break();
    ctx.then(C);
});
ctx.then(D);
ctx.end();

expected_result = "init:reactA:reactB:reactC:reactB:reactC:reactB:reactD";
expected_order = "<AA><BB><CC><BB><CC><BB><DD>";
order_separator = '';
