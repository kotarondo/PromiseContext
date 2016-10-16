// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

var harness = require('./harness')
var cp = harness.checkpoint;
var assertEquals = harness.assertEquals;

var PromiseContext = require('../PromiseContext');
var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.chain(function(resolve, reject) {
    cp(1);
    resolve(Promise.resolve(1));
    cp(2);
})

.chain(function(resolve, reject) {
    cp(101);
    resolve(Promise.reject(101));
    cp(102);
})

.chain(function(resolve, reject) {
    cp("don't reach here");
    reject();
})

.catch(function(val) {
    cp('t101');
    assertEquals(val, 101)
})

.chain(function(resolve, reject) {
    cp(3);
    setTimeout(function() {
        cp(4);
        resolve(new Promise(function(resolve, reject) {
            cp(5);
            setTimeout(function() {
                cp(6);
                resolve();
                cp(7);
            }, 10);
        }));
        cp(8);
    }, 10);
})

.catch(function(val) {
    cp("don't reach here");
})

.end();
cp('finished');

function onFulfilled() {
    harness.expected_order("finished,1,2,101,102,t101,3,4,5,8,6,7");
    console.log("OK");
    process.exit(0);
}

function onRejected(err) {
    console.log("NG: unexpected reject: " + err);
    process.exit(1);
}
