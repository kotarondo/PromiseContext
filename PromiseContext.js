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

class PromiseContext {

    constructor(value) {
        this._promise = Promise.resolve(value);
    }

    getPromise() {
        return this._promise;
    }

    then(reaction, catchReaction) {
        enter_context(this);
        this._used = true;
        this._promise = this._promise.then(reaction, catchReaction);
        return this;
    }

    chain(executor) {
        return this.then(() => new Promise(executor));
    }

    throw (error) {
        return this.then(() => Promise.reject(error));
    }

    join(promise) {
        if (promise instanceof PromiseContext || promise instanceof PromiseContextHolder) {
            promise = promise.getPromise();
        }
        return this.then(() => promise);
    }

    sleep(msec) {
        return this.then(value => new Promise(function(resolve) {
            setTimeout(resolve, msec, value);
        }));
    }

    call(label, subroutine) {
        if (label instanceof Function) {
            subroutine = label;
            label = void 0;
        }
        const ctx = this;
        return this.then(value => new Promise(function(resolve, reject) {
            if (label !== void 0) {
                const entry = {};
                resolve = bind_pop_stack(ctx, resolve);
                reject = bind_pop_stack(ctx, reject);
                entry.label = label;
                entry.resolve = resolve;
                push_stack(ctx, entry);
            }
            call_context(ctx, resolve, reject, subroutine, value);
        }));
    }

    loop(label, subroutine) {
        if (label instanceof Function) {
            subroutine = label;
            label = void 0;
        }
        const ctx = this;
        return this.then(value => new Promise(function(resolve, reject) {
            const entry = {};
            resolve = bind_pop_stack(ctx, resolve);
            reject = bind_pop_stack(ctx, reject);
            entry.label = label;
            entry.resolve = resolve;
            entry.iterator = iterator;
            push_stack(ctx, entry);
            iterator(value);

            function iterator(value) {
                call_context(ctx, iterator, reject, subroutine, value)
            }
        }));
    }

    catch (subroutine) {
        const ctx = this;
        return this.then(null, reason => new Promise(function(resolve, reject) {
            call_context(ctx, resolve, reject, subroutine, reason);
        }));
    }

    break (label) {
        enter_sub_context(this);
        var entry = find_stack(this, label);
        if (!entry) {
            throw new Error("illegal break()");
        }
        const ctx = this;
        return this.then(value => new Promise(function(resolve, reject) {
            ctx._stack_top = entry;
            entry.resolve(value);
        }));
    }

    continue (label) {
        enter_sub_context(this);
        var entry = find_stack(this, label, true);
        if (!entry) {
            throw new Error("illegal continue()");
        }
        const ctx = this;
        return this.then(value => new Promise(function(resolve, reject) {
            ctx._stack_top = entry;
            entry.iterator(value);
        }));
    }

    setCompletion(onFulfilled, onRejected) {
        enter_main_context(this);
        this._onFulfilled = onFulfilled;
        this._onRejected = onRejected;
        return this;
    }

    end() {
        enter_main_context(this);
        this._ended = true;
        this._promise.then(this._onFulfilled, this._onRejected);
    }

}

function enter_context(ctx) {
    if (ctx._in_sub_context) return;
    if (ctx._ended) throw new Error("context is ended");
}

function enter_sub_context(ctx) {
    if (!ctx._in_sub_context) throw new Error("not in a sub-context");
}

function enter_main_context(ctx) {
    if (ctx._in_sub_context) throw new Error("not in the main-context");
    if (ctx._ended) throw new Error("context is ended");
}

function call_context(ctx, resolve, reject, subroutine, arg) {
    const saved_promise = ctx._promise;
    ctx._in_sub_context = true;
    ctx._promise = new Promise(function(resolve, relect) {
        ctx._start_sub_context = resolve;
    });
    try {
        ctx._used = false;
        var value = subroutine(arg);
        if (!ctx._used) {
            // if there is no chaining to this sub-context,
            // resolve the returned value instead of passed arg
            arg = value;
        }
        ctx._promise.then(resolve, reject);
        ctx._start_sub_context(arg);
    } catch (e) {
        reject(e);
    }
    ctx._in_sub_context = false;
    ctx._promise = saved_promise;
    ctx._start_sub_context = null;
}

function push_stack(ctx, entry) {
    entry.next = ctx._stack_top;
    ctx._stack_top = entry;
}

function bind_pop_stack(ctx, func) {
    return function(arg) {
        ctx._stack_top = ctx._stack_top.next;
        func(arg);
    };
}

function find_stack(ctx, label, iterableOnly) {
    var entry = ctx._stack_top;
    while (entry) {
        if (label === void 0 && entry.iterator) {
            break;
        }
        if (label === entry.label && (!iterableOnly || entry.iterator)) {
            break;
        }
        entry = entry.next;
    }
    return entry;
}

class PromiseContextHolder {
    constructor() {
        this._context = new PromiseContext();
    }

    getContext() {
        return this._context;
    }

    setContext(ctx) {
        if (!(ctx instanceof PromiseContext)) {
            if (!(ctx instanceof PromiseContextHolder)) throw new Error("not a context");
            ctx = ctx.getContext();
        }
        var old = this._context;
        this._context = ctx;
        ctx.join(old);
        return old;
    }

    getPromise() {
        this._context.getPromise();
        return this;
    }

    then(reaction, catchReaction) {
        this._context.then(reaction, catchReaction);
        return this;
    }

    chain(executor) {
        this._context.chain(executor);
        return this;
    }

    throw (error) {
        this._context.throw(error);
        return this;
    }

    join(promise) {
        this._context.join(promise);
        return this;
    }

    sleep(msec) {
        this._context.sleep(msec);
        return this;
    }

    call(label, subroutine) {
        this._context.call(label, subroutine);
        return this;
    }

    loop(label, subroutine) {
        this._context.loop(label, subroutine);
        return this;
    }

    catch (subroutine) {
        this._context.catch(subroutine);
        return this;
    }

    break (label) {
        this._context.break(label);
        return this;
    }

    continue (label) {
        this._context.continue(label);
        return this;
    }

    setCompletion(onFulfilled, onRejected) {
        this._context.setCompletion(onFulfilled, onRejected);
        return this;
    }

    end() {
        this._context.end();
    }

}

PromiseContext.Holder = PromiseContextHolder;

module.exports = PromiseContext;
