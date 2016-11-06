// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test error condition: access in ended context

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext();
ctx.end();

try {
    ctx.chain();
} catch (e) {
    cp("1");
    assertEquals(e, "Error: context is ended");
}

try {
    ctx.then();
} catch (e) {
    cp("2");
    assertEquals(e, "Error: context is ended");
}

try {
    ctx.throw();
} catch (e) {
    cp("3");
    assertEquals(e, "Error: context is ended");
}

try {
    ctx.call();
} catch (e) {
    cp("4");
    assertEquals(e, "Error: context is ended");
}

try {
    ctx.loop();
} catch (e) {
    cp("5");
    assertEquals(e, "Error: context is ended");
}

try {
    ctx.catch();
} catch (e) {
    cp("6");
    assertEquals(e, "Error: context is ended");
}

try {
    ctx.break();
} catch (e) {
    cp("7");
    assertEquals(e, "Error: not in a sub-context");
}

try {
    ctx.continue();
} catch (e) {
    cp("8");
    assertEquals(e, "Error: not in a sub-context");
}

try {
    ctx.setCompletion();
} catch (e) {
    cp("9");
    assertEquals(e, "Error: context is ended");
}

try {
    ctx.end();
} catch (e) {
    cp("10");
    assertEquals(e, "Error: context is ended");
}

expected_result = undefined;
expected_order = "1,2,3,4,5,6,7,8,9,10";

onFulfilled();
