// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test chaining reactions without ctx.then()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = reactor_template.bind(null, 'A');
var B = reactor_templateE.bind(null, 'B');
var C = reactor_template.bind(null, 'C');
var D = reactor_template.bind(null, 'D');

ctx.chain((resolve, reject) => A().then(resolve, reject));
ctx.chain((resolve, reject) => B().then(resolve, reject));
ctx.chain((resolve, reject) => C().then(resolve, reject));
ctx.catch(function(err) {
    cp("inCatch");
    assertEquals(err, "undefined:rejectB");
});
ctx.chain((resolve, reject) => D().then(resolve, reject));
ctx.end();

expected_result = "undefined:reactD";
expected_order = "<AA><BB>inCatch<DD>";
order_separator = '';
