// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test chain throwing error

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilledE, onRejectedE);

ctx.chain(function(resolve, reject) {
    cp(1);
    resolve();
    cp(2);
    throw new Error(); // no effect because already resolved
    cp(2.5);
});

ctx.chain(function(resolve, reject) {
    cp(3);
    setTimeout(function() {
        cp(4);
        resolve();
        cp(5);
    }, 10);
    cp(6);
    return Promise.reject("please ignore this"); // causes nothing
});

ctx.chain(function(resolve, reject) {
    cp(7);
    eval("var var=1"); // causes SyntaxError
    cp(8);
})

ctx.chain(function(resolve, reject) {
    cp(9);
    setTimeout(function() {
        cp(10);
        resolve();
        cp(11);
    }, 10);
    cp(12);
})

cp('finished');
ctx.end();

expected_error = "SyntaxError: Unexpected token var";
expected_order = "finished,1,2,3,6,4,5,7";
