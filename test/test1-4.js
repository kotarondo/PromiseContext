// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test chain rejection can be catched

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.chain(function(resolve, reject) {
    cp(1);
    reject("err1");
    cp(2);
});

ctx.catch(function(err) {
    cp(3);
    assertEquals(err, "err1");
});

ctx.chain(function(resolve, reject) {
    cp(4);
    reject("err2");
    cp(5);
})

ctx.chain(function(resolve, reject) {
    cp(6);
})

ctx.catch(function(err) {
    cp(7);
    assertEquals(err, "err2");
});

cp('finished');
ctx.end();

expected_result = undefined;
expected_order = "finished,1,2,3,4,5,7";
