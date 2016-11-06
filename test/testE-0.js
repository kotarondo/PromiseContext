// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test error condition: end/setCompletion not in the main-context

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

ctx.call(function() {
    try {
        ctx.setCompletion();
    } catch (e) {
        cp("1");
        assertEquals(e, "Error: not in the main-context");
    }

    try {
        ctx.end();
    } catch (e) {
        cp("2");
        assertEquals(e, "Error: not in the main-context");
    }
});

ctx.catch(function(err) {
    cp("dont");
});

ctx.call(function() {
    ctx.setCompletion();
})

ctx.catch(function(e) {
    cp("3");
    assertEquals(e, "Error: not in the main-context");
});

ctx.call(function() {
    ctx.end();
})

ctx.catch(function(e) {
    cp("4");
    assertEquals(e, "Error: not in the main-context");
});

ctx.end();

expected_result = undefined;
expected_order = "1,2,3,4";
