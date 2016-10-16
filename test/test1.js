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
        resolve();
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
    harness.expected_order("finished,1,2,3,6,4,5,7,8,9,12,10,11");
    console.log("OK");
    process.exit(0);
}

function onRejected(err) {
    console.log("NG: unexpected reject: " + err);
    process.exit(1);
}
