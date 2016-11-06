// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test joinContext

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("init");
ctx.setCompletion(onFulfilled, onRejected);

var A = reactor_template.bind(null, 'A');
var B = reactor_template.bind(null, 'B');
var C = reactor_templateE.bind(null, 'C');
var ctx1 = new PromiseContext("init1");

ctx.call(A)
ctx.call(function(val) {
    cp(1)
    assertEquals(val, "init:reactA")
    ctx1.call(B)
    ctx.join(ctx1)
})
ctx.call(function(val) {
    cp(2)
    assertEquals(val, "init1:reactB")
    ctx.join(ctx1)
})
ctx.call(function(val) {
    cp(3)
    assertEquals(val, "init1:reactB")
    ctx1.call(C)
    ctx.join(ctx1)
})
ctx.call(function(val) {
    cp("dont")
})
ctx.catch(function(val) {
    cp(4)
    assertEquals(val, "init1:reactB:rejectC")
    ctx.join(ctx1)
})
ctx.call(function(val) {
    cp("dont")
})
ctx.catch(function(val) {
    cp(5)
    assertEquals(val, "init1:reactB:rejectC")
})
ctx.end();

expected_result = undefined;
expected_order = "<AA>1<BB>23<CC>45";
order_separator = ''
