// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

// test joinContext

require('./harness')
var PromiseContext = require('../PromiseContext');

var ctx = new PromiseContext("init");
ctx.setCompletion(onFulfilled, onRejected);
var ctx1 = new PromiseContext("init1");
ctx1.setCompletion(onFulfilledE, onRejected);

var A = reactor_template.bind(null, 'A');
var B = reactor_template.bind(null, 'B');

ctx1.call(A)
ctx.join(ctx1)
ctx.call(val => {
    cp(1)
    assertEquals(val, "init1:reactA");
    return "aaa";
})
ctx1.sleep(100)
ctx1.call(B)
ctx.sleep(200)
ctx.join(ctx1)
ctx.call(val => {
    cp(2)
    assertEquals(val, "init1:reactA:reactB");
    return "bbb";
})
ctx.end()

expected_result = "bbb";
expected_order = "<AA>1<BB>2";
order_separator = '';
