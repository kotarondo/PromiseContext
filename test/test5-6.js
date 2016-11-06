// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test deep recursive ctx.loop()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var countA = 0;
var countB = 0;

function A(resolve, reject) {
    countA++;
    resolve();
}

function B(resolve, reject) {
    countB++;
    resolve();
}

var limit = 10000;
var d = limit;

ctx.loop(function sub() {
    if (!d--) ctx.break();
    ctx.chain(A);
    ctx.loop(sub);
    ctx.chain(B);
    ctx.break();
})
ctx.then(function() {
    assertEquals(countA, limit);
    assertEquals(countB, limit);
    countA = 0;
    countB = 0;
    d = limit;
});
ctx.loop("top", function sub() {
    if (!d--) ctx.break("top");
    ctx.chain(A);
    ctx.loop(sub);
    ctx.chain(B);
})
ctx.then(function() {
    assertEquals(countA, limit);
    assertEquals(countB, 0);
});
ctx.end();

expected_result = undefined;
expected_order = "";
order_separator = '';
