// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// main context looking like defferd sub context

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

        ctx.chain(function(resolve, reject) {
            cp(3);
            resolve("defferd");
            cp(4);
        })

        final_resolve("final");

    }, 10)

})

var final_resolve;
ctx.chain(function(resolve, reject) {
    cp(5);
    final_resolve = resolve;
})

setTimeout(function() {
    cp('finished');
    ctx.end();
}, 100)

expected_result = "defferd";
expected_order = "1,2,5,3,4,finished";
