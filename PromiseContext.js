/*
 Copyright (c) 2016, Kotaro Endo.
 All rights reserved.
 
 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 
 2. Redistributions in binary form must reproduce the above
    copyright notice, this list of conditions and the following
    disclaimer in the documentation and/or other materials provided
    with the distribution.
 
 3. Neither the name of the copyright holder nor the names of its
    contributors may be used to endorse or promote products derived
    from this software without specific prior written permission.
 
 THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

'use strict'

module.exports = class PromiseContext {

    constructor() {
        const ctx = this;
        openContext(ctx);
    }

    chain(executor) {
        const ctx = this;
        chainContext(ctx, executor);
        return this;
    }

    loop(label, subroutine) {
        if (label instanceof Function) {
            subroutine = label;
            label = null;
        }
        const ctx = this;
        chainContext(ctx, function(resolve, reject) {
            const entry = {
                label: label,
                iterable: true,
                subroutine: subroutine,
            };
            resolve = entry.resolve = bindPopStack(ctx, resolve, entry);
            reject = entry.reject = bindPopStack(ctx, reject, entry);
            pushStack(ctx, entry);
            loopContext(ctx, resolve, reject, subroutine);
        });
        return this;
    }

    call(label, subroutine) {
        if (label instanceof Function) {
            subroutine = label;
            label = null;
        }
        const ctx = this;
        chainContext(ctx, function(resolve, reject) {
            const entry = {
                label: label,
                iterable: false,
            };
            resolve = entry.resolve = bindPopStack(ctx, resolve, entry);
            reject = entry.reject = bindPopStack(ctx, reject, entry);
            pushStack(ctx, entry);
            callContext(ctx, resolve, reject, subroutine);
        });
        return this;
    }

    catch (onRejected) {
        const ctx = this;
        catchContext(ctx, reason => new Promise(function(resolve, reject) {
            callContext(ctx, resolve, reject, onRejected, reason);
        }));
        return this;
    }

    throw (err) {
        const ctx = this;
        thenContext(ctx, () => Promise.reject(err));
        return this;
    }

    break (label) {
        const ctx = this;
        if (!findStack(ctx, label, false)) {
            throw new Error("unresolvable break statement");
        }
        chainContext(ctx, function(resolve, reject) {
            var entry = findStack(ctx, label, false);
            ctx._stackTop = entry;
            entry.resolve();
        });
        return this;
    }

    continue (label) {
        const ctx = this;
        if (!findStack(ctx, label, true)) {
            throw new Error("unresolvable continue statement");
        }
        chainContext(ctx, function(resolve, reject) {
            var entry = findStack(ctx, label, true);
            ctx._stackTop = entry;
            loopContext(ctx, entry.resolve, entry.reject, entry.subroutine);
        });
        return this;
    }

    setCompletion(onFulfilled, onRejected) {
        const ctx = this;
        if (ctx._isEnded) throw new Error("context is already ended");
        ctx._onFulfilled = onFulfilled;
        ctx._onRejected = onRejected;
        return this;
    }

    end() {
        const ctx = this;
        if (ctx._isEnded) throw new Error("context is already ended");
        ctx._isEnded = true;
        thenContext(ctx, ctx._onFulfilled, ctx._onRejected);
        commitContext(ctx);
    }

}

function checkOpen(ctx) {
    if (!ctx._promise) throw new Error("context is closed");
}

function checkClosed(ctx) {
    if (ctx._promise) throw new Error("context is open");
}

function openContext(ctx) {
    checkClosed(ctx);
    ctx._promise = new Promise(function(resolve) {
        ctx._commit = resolve;
    });
}

function abortContext(ctx) {
    checkOpen(ctx);
    ctx._promise = null;
    ctx._commit = null;
}

function commitContext(ctx) {
    checkOpen(ctx);
    ctx._promise = null;
    ctx._commit();
}

function chainContext(ctx, executor) {
    checkOpen(ctx);
    ctx._promise = ctx._promise.then(() => new Promise(executor));
}

function thenContext(ctx, onFulfilled, onRejected) {
    checkOpen(ctx);
    ctx._promise = ctx._promise.then(onFulfilled, onRejected);
}

function catchContext(ctx, onRejected) {
    checkOpen(ctx);
    ctx._promise = ctx._promise.catch(onRejected);
}

function callContext(ctx, resolve, reject, subroutine, arg) {
    openContext(ctx);
    try {
        subroutine(arg);
    } catch (e) {
        abortContext(ctx);
        reject(e);
        return;
    }
    thenContext(ctx, resolve, reject);
    commitContext(ctx);
}

function loopContext(ctx, resolve, reject, subroutine) {
    resolve = function() {
        callContext(ctx, resolve, reject, subroutine)
    };
    resolve();
}

function pushStack(ctx, entry) {
    entry.next = ctx._stackTop;
    ctx._stackTop = entry;
}

function bindPopStack(ctx, reactor, entry) {
    return function(arg) {
        if (ctx._stackTop != entry) {
            throw new Error("assert: invalid stack state");
        }
        ctx._stackTop = entry.next;
        reactor(arg);
    };
}

function findStack(ctx, label, iterableOnly) {
    var entry = ctx._stackTop;
    while (entry) {
        if (iterableOnly && !entry.iterable) {
            continue;
        }
        if (!label && entry.iterable) {
            break;
        }
        if (label && label == entry.label) {
            break;
        }
        entry = entry.next;
    }
    return entry;
}
