// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// we cannot deffer sub-contexts

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.call(function() {

    ctx.chain(function(resolve, reject) {
        cp(1);
        resolve();
        cp(2);
    })

    setTimeout(function() {

        try {
            ctx.chain(function(resolve, reject) {
                cp(3);
                resolve();
                cp(4);
            })
        } catch (e) {
            cp(5);
            assertEquals(e, "Error: context is ended");
        }

        final_resolve("final");

    }, 10)

})

var final_resolve;
ctx.chain(function(resolve, reject) {
    final_resolve = resolve;
})

cp('finished');
ctx.end();

expected_result = "final";
expected_order = "finished,1,2,5";
