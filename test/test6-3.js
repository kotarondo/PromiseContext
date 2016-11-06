// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test illegal break can be catched

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

var A = executor_template.bind(null, 'A');
var B = executor_template.bind(null, 'B');
var C = executor_template.bind(null, 'C');
var D = executor_template.bind(null, 'D');

var i = 0;
ctx.call(function() {
    ctx.chain(A);
    ctx.call(function() {
        ctx.chain(B);
        ctx.break(); // illegal
        ctx.catch(function(err) {
            cp("dont reach here");
        });
    });
    ctx.catch(function(err) {
        assertEquals(err.toString(), "Error: illegal break()");
        cp("err");
    });
    ctx.chain(D);
});
ctx.catch(function(err) {
    cp("dont reach here");
});
ctx.end();

expected_result = "valueD";
expected_order = "<AA>err<DD>";
order_separator = '';
