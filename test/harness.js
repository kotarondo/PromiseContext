// Copyright (c) 2016, Kotaro Endo.
// license: "BSD-3-Clause"

var debug = false;

process.on('beforeExit', function() {
    console.log("NG: unexpectedly exits");
    process.exit(1);
});

var order = [];

exports.checkpoint = function(n) {
    if (debug) console.log("checkpoint " + n);
    order.push(n);
};

exports.expected_order = function(exp) {
    var act = order.join();
    if (act != exp) {
        console.log("NG: unexpected order: " + act + " expected: " + exp);
        process.exit(1);
    }
};

exports.assertEquals = function(act, exp) {
    if (act != exp) {
        console.log("NG: assert failed: " + act + " expected: " + exp);
        process.exit(1);
    }
};
