// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test resolving a Promise

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.chain(function(resolve, reject) {
    cp(1);
    resolve(Promise.resolve());
    cp(2);
})

ctx.chain(function(resolve, reject) {
    cp(101);
    resolve(Promise.reject(101));
    cp(102);
})

ctx.chain(function(resolve, reject) {
    cp("don't reach here");
    reject();
})

ctx.catch(function(val) {
    cp('103');
    assertEquals(val, 101)
})

ctx.chain(function(resolve, reject) {
    cp(3);
    setTimeout(function() {
        cp(4);
        resolve(new Promise(function(resolve, reject) {
            cp(5);
            setTimeout(function() {
                cp(6);
                resolve("test-value");
                cp(7);
            }, 10);
        }));
        cp(8);
    }, 10);
})

ctx.catch(function(val) {
    cp("don't reach here");
})

ctx.end();
cp('finished');

expected_result = "test-value";
expected_order = "finished,1,2,101,102,103,3,4,5,8,6,7";
