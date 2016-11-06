// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test main context remaining open: chain rejection

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilledE, onRejectedE);

ctx.chain(function(resolve, reject) {
    cp(1);
    resolve();
    cp(2);
});

ctx.chain(function(resolve, reject) {
    cp(3);
    setTimeout(function() {
        cp(4);
        reject("ignore warning");
        cp(5);
    }, 100);
    cp(6);
});

setTimeout(function() {

    ctx.chain(function(resolve, reject) {
        cp(7);
        resolve();
        cp(8);
    })

    ctx.catch(function(err) {
        cp(9);
        assertEquals(err, "ignore warning");
    })

    ctx.chain(function(resolve, reject) {
        cp(10);
        reject("err!!");
        cp(11);
    })

    cp('finished');
    ctx.end();

}, 10)

expected_error = "err!!";
expected_order = "1,2,3,6,finished,4,5,9,10,11";
