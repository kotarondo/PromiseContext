// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

var harness = require('./harness')
var cp = harness.checkpoint;

var PromiseContext = require('../PromiseContext');
var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.chain(function(resolve, reject) {
    cp(1);
    resolve();
    cp(2);
});

ctx.chain(function(resolve, reject) {
    cp(3);
    setTimeout(function() {
        cp(4);
        reject("err!!");
        cp(5);
    }, 10);
    cp(6);
});

ctx.chain(function(resolve, reject) {
    cp(7);
    resolve();
    cp(8);
})

.chain(function(resolve, reject) {
    cp(9);
    setTimeout(function() {
        cp(10);
        resolve();
        cp(11);
    }, 10);
    cp(12);
})

ctx.end();
cp('finished');

function onFulfilled() {
    console.log("NG: unexpected fulfillment");
    process.exit(1);
}

function onRejected(err) {
    harness.expected_order("finished,1,2,3,6,4,5");
    harness.assertEquals(err, "err!!");
    console.log("OK");
    process.exit(0);
}
