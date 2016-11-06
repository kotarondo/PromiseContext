// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

var debug = false;

process.on('beforeExit', function() {
    console.log("NG: unexpectedly exits");
    process.exit(1);
})

global.assertEquals = function(act, exp) {
    if (act != exp) {
        console.log("NG: assert failed: " + act + " expected: " + exp);
        process.exit(1);
    }
}

global.executor_template = function(name, resolve, reject) {
    cp("<" + name);
    setTimeout(function() {
        resolve("value" + name);
        cp(name + ">");
    }, 10);
}

global.executor_templateE = function(name, resolve, reject) {
    cp("<" + name);
    setTimeout(function() {
        reject("reject" + name);
        cp(name + ">");
    }, 10);
}

global.reactor_template = function(name, val) {
    cp("<" + name);
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            resolve(val + ":react" + name);
            cp(name + ">");
        }, 10);
    });
}

global.reactor_templateE = function(name, val) {
    cp("<" + name);
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(val + ":reject" + name);
            cp(name + ">");
        }, 10);
    });
}

var order = [];

global.cp = function(n) {
    if (debug) console.log("checkpoint " + n);
    order.push(n);
}

global.order_separator = ',';

global.checkOrder = function(exp) {
    var act = order.join(order_separator);
    if (act != exp) {
        console.log("NG: unexpected order: " + act + " expected: " + exp);
        process.exit(1);
    }
}

global.onFulfilled = function(val) {
    assertEquals(val, expected_result);
    checkOrder(expected_order);
    console.log("OK");
    process.exit(0);
}

global.onRejected = function(err) {
    console.log("NG: unexpected rejection: " + err);
    console.log(err.stack);
    process.exit(1);
}

global.onFulfilledE = function(val) {
    console.log("NG: unexpected fulfillment: " + val);
    process.exit(1);
}

global.onRejectedE = function(err) {
    assertEquals(err, expected_error);
    checkOrder(expected_order);
    console.log("OK");
    process.exit(0);
}

global.perf_name = "";
global.perf_loops = 1;
var startTime = Date.now();

global.startPerf = function() {
    startTime = Date.now();
}

global.onFulfilledP = function(val) {
    var endTime = Date.now();
    var elapsed = endTime - startTime;
    var pval = elapsed / (perf_loops * 1000);
    var unit = " sec";
    if (pval < 1) {
        pval *= 1000;
        unit = " msec";
        if (pval < 1) {
            pval *= 1000;
            unit = " usec";
            if (pval < 1) {
                pval *= 1000;
                unit = " nsec";
            }
        }
    }
    pval = pval.toPrecision(3);
    console.log("perf result: " + perf_name + "=" + pval + unit);
    console.log("OK");
    process.exit(0);
}
