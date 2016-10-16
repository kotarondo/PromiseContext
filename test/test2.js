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
    resolve();
    cp(2);
    resolve(); // causes nothing
});

ctx.chain(function(resolve, reject) {
    cp(3);
    setTimeout(function() {
        cp(4);
        resolve();
        cp(5);
        resolve(); // causes nothing
    }, 10);
    cp(6);
})

ctx.chain(function(resolve, reject) {
    cp(7);
    reject(7);
    cp(8);
    reject(8); // causes nothing
})

.chain(function(resolve, reject) {
    cp("don't reach here");
    reject();
})

.catch(function(val) {
    cp('t7');
    assertEquals(val, 7)
})

.chain(function(resolve, reject) {
    cp(9);
    setTimeout(function() {
        cp(10);
        reject(10);
        cp(11);
        resolve(); // causes nothing
        reject(11); // causes nothing
    }, 10);
    cp(12);
})

.chain(function(resolve, reject) {
    cp("don't reach here");
    reject();
})

.catch(function(val) {
    cp('t10');
    assertEquals(val, 10)
})

ctx.end();
cp('finished');

function onFulfilled() {
    harness.expected_order("finished,1,2,3,6,4,5,7,8,t7,9,12,10,11,t10");
    console.log("OK");
    process.exit(0);
}

function onRejected(err) {
    console.log("NG: unexpected reject: " + err);
    process.exit(1);
}
