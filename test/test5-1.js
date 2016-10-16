// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

var harness = require('./harness')
var cp = harness.checkpoint;
var assertEquals = harness.assertEquals;

var PromiseContext = require('../PromiseContext');
var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

function executor_template(name, resolve, reject) {
    cp("in" + name);
    setTimeout(function() {
        resolve("value" + name);
        cp("out" + name);
    }, 10);
}

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');

var err = "err!!";

ctx.call(function() {
    ctx.chain(A);
    ctx.throw(err);
    ctx.chain(D);
})
ctx.catch(function(e) {
    assertEquals(e, err);
    ctx.chain(B);
})
ctx.chain(C);
ctx.end();

function onFulfilled() {
    harness.expected_order("inA,outA,inB,outB,inC,outC");
    console.log("OK");
    process.exit(0);
}

function onRejected(err) {
    console.log("NG: unexpected reject: " + err);
    process.exit(1);
}
