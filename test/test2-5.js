// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.then() throwing error can be catched

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.then(function() {
    cp(1);
    throw "err1";
    cp(2);
});

ctx.catch(function(err) {
    cp(3);
    assertEquals(err, "err1");
});

ctx.then(function() {
    cp(4);
    eval("var var=1"); // causes SyntaxError
    cp(5);
})

ctx.chain(function(resolve, reject) {
    cp(6);
})

ctx.catch(function(err) {
    cp(7);
    assertEquals(err, "SyntaxError: Unexpected token var");
});

cp('finished');
ctx.end();

expected_result = undefined;
expected_order = "finished,1,3,4,7";
