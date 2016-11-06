// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test error condition: break/continue in main context

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.setCompletion(onFulfilled, onRejected);

try {
    ctx.break();
} catch (e) {
    cp("1");
    assertEquals(e, "Error: not in a sub-context");
}

try {
    ctx.break("123");
} catch (e) {
    cp("2");
    assertEquals(e, "Error: not in a sub-context");
}

try {
    ctx.continue();
} catch (e) {
    cp("3");
    assertEquals(e, "Error: not in a sub-context");
}

try {
    ctx.continue("123");
} catch (e) {
    cp("4");
    assertEquals(e, "Error: not in a sub-context");
}

ctx.catch(function(err) {
    cp("dont");
});
ctx.end();

expected_result = undefined;
expected_order = "1,2,3,4";
