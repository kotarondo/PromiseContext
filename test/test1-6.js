// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test duplicate resolve/reject

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.chain(function(resolve, reject) {
    cp(1);
    resolve();
    resolve(); // causes nothing
    cp(2);
});

ctx.chain(function(resolve, reject) {
    cp(3);
    setTimeout(function() {
        cp(4);
        resolve();
        reject(); // causes nothing
        resolve(); // causes nothing
        cp(5);
    }, 10);
    cp(6);
})

ctx.chain(function(resolve, reject) {
    cp(7);
    reject(7);
    reject(8); // causes nothing
    cp(8);
})

ctx.chain(function(resolve, reject) {
    cp("don't reach here");
    reject();
})

ctx.catch(function(val) {
    cp('t7');
    assertEquals(val, 7)
})

ctx.chain(function(resolve, reject) {
    cp(9);
    setTimeout(function() {
        cp(10);
        reject(10);
        resolve(); // causes nothing
        reject(11); // causes nothing
        cp(11);
    }, 10);
    cp(12);
})

ctx.chain(function(resolve, reject) {
    cp("don't reach here");
    reject();
})

ctx.catch(function(val) {
    cp('t10');
    assertEquals(val, 10)
})

cp('finished');
ctx.end();

expected_result = undefined;
expected_order = "finished,1,2,3,6,4,5,7,8,t7,9,12,10,11,t10";
