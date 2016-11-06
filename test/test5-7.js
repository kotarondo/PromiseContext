// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test ctx.call() looks like ctx.then()

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("test0");
ctx.setCompletion(onFulfilled, onRejected);

ctx.call(result => {
    cp(1)
    assertEquals(result, "test0");
    return "test1";
})

ctx.then(result => {
    cp(2)
    assertEquals(result, "test1");
    return "test2";
})

ctx.call(result => {
    cp(3)
    assertEquals(result, "test2");
    return "test3";
})

ctx.call(result => {
    cp(4)
    assertEquals(result, "test3");
    ctx.call(result => {
        cp(5)
        assertEquals(result, "test3");
        return "test5";
    })
    return "test4"; // ignored
})

ctx.end();

expected_result = "test5";
expected_order = "1,2,3,4,5";
