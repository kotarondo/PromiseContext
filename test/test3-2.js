// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test main context remaining open: chain throwing error

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilledE, onRejectedE);

ctx.chain(function(resolve, reject) {
    cp(1);
    throw "ignore this warning";
    cp(2);
})

setTimeout(function() {

    ctx.catch(function(err) {
        cp(3);
        assertEquals(err, "ignore this warning");
    })

    ctx.chain(function(resolve, reject) {
        cp(4);
        resolve();
        cp(5);
        throw new Error(); // no effect because already resolved
        cp(6);
    })

    ctx.chain(function(resolve, reject) {
        cp(10);
        eval("var var=1"); // causes SyntaxError
        cp(11);
    })

    cp('finished');
    ctx.end();
}, 10)

expected_error = "SyntaxError: Unexpected token var";
expected_order = "1,finished,3,4,5,10";
