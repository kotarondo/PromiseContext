// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test chaining resolved values in ctx.catch() with ctx.throw()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("init");
ctx.setCompletion(onFulfilledE, onRejectedE);

var A = reactor_templateE.bind(null, 'A');
var B = reactor_templateE.bind(null, 'B');
var C = reactor_template.bind(null, 'C');
var D = reactor_template.bind(null, 'D');

ctx.then(A);
ctx.catch(function(val) {
    assertEquals(val, "init:rejectA");
    ctx.then(B);
    ctx.throw(val);
    ctx.catch(function(val) {
        ctx.then(D);
        ctx.throw(val);
    });
    ctx.then(C);
});
ctx.end();

expected_error = "init:rejectA:rejectB";
expected_order = "<AA><BB><DD>";
order_separator = '';
