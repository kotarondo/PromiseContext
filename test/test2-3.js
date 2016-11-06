// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.then() reject can be catched

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = reactor_template.bind(null, 'A');
var B = reactor_templateE.bind(null, 'B');
var C = reactor_template.bind(null, 'C');
var D = reactor_template.bind(null, 'D');

ctx.then(A);
ctx.then(B);
ctx.then(C);
ctx.catch(function(err) {
    cp("inCatch");
    assertEquals(err, "undefined:reactA:rejectB");
    ctx.then(() => "woo");
});
ctx.then(D);
ctx.end();

expected_result = "woo:reactD";
expected_order = "<AA><BB>inCatch<DD>";
order_separator = '';
