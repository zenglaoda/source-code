const Promise = require("../src/core");

const PENDING = 0;
const FULFILLED = 1;
const REJECTED = 2;
const DEFERRED = 3;

function asap(fn) {
    asap.fn = fn;

}
asap.init = function () {
    const node = document.createTextNode('1');
    const observer = new MutationObserver(asap.callback);  
    observer.observe(node, { characterData: true });
    asap.flush();
}
asap.callback = function() {
    asap.fn();
}

function isSimple(value) {
    return (typeof value !== 'object' && typeof value !== 'function') || value === null;
}

function noop() {}

function handleDeferred(promise) {
    promise._deferred.forEach(function(deferred) {
        handleSettled(promise, deferred);
    });
    promise._deferred = [];
}

function handleResolve(promise, value) {
    if (value === promise) {
        handleReject(promise, new TypeError('A promise cannot be resolved with itself.'));
        return;
    }
    if (isSimple(value)) {
        promise._state = FULFILLED;
        promise._value = value;
        handleDeferred();
        return
    }

    let then;
    try {
        then = value.then;
    } catch (err) {
        handleReject(promise, err);
        return;
    }

    if (then === promise.then && value instanceof Promise) {
        promise._state = DEFERRED;
        promise._value = value;
        handleDeferred();
        return;
    }
    if (typeof then === 'function') {
        execFn(then.bind(value), promise);
        return;
    }
    promise._state = FULFILLED;
    promise._value = value;
    handleDeferred();
}

function handleReject(promise, reason) {
    promise._value = reason;
    promise._state = REJECTED;
    handleDeferred(promise);
}

function handleSettled(promise, deferred) {
    asap(function() {
        const cb = promise._state === FULFILLED ? deferred.onFulfilled : deferred.onRejected;
        if (cb === null) {
            if (promise._state === FULFILLED) {
                handleResolve(deferred.promise, promise._value);
            } else {
                handleReject(deferred.promise, promise._value);
            }
            return;
        }
        try {
            const value = cb(promise._value);
            handleResolve(deferred.promise, value);
        } catch (err) {
            handleReject(deferred.promise, err);
        }
    });
}

function execFn(fn, promise) {
    let done = false;
    try {
        fn(
            function resolve(value) {
                if (done === true) return;
                done = true;
                handleResolve(promise, value);
            },
            function reject(reason) {
                if (done === true) return;
                done = true;
                handleReject(promise, reason);
            }
        );
    } catch (err) {
        if (done === true) return;
        done = true;
        handleReject(promise, reason);
    }
}

function generatePromise(value, status) {
    var p = new Promise(noop);
    p._state = status;
    p._value = value;
    return p;
}

class Handler {
    constructor(promise, onFulfilled, onRejected) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    }
}

class Promise {
    constructor(fn) {
        if (typeof fn !== 'function') {
            throw new TypeError('fn must be a function')
        }
        this._state = PENDING;
        this._value = undefined;
        this._deferred = [];
        if (fn === noop) return;
        execFn(fn, this);
    }

    then(onFulfilled, onRejected) {
        const nextPromise = new Promise(noop);
        const deferred = new Handler(nextPromise, onFulfilled, onRejected);
        let promise = this;
        while(promise._state === DEFERRED) {
            promise = promise._value;
        }
        if (promise._state === PENDING) {
            promise._deferred.push(deferred);
        } else {
            handleSettled(promise, deferred);
        }
        return nextPromise;
    }

    resolve(value) {
        if (value instanceof Promise) return value;
        if (isSimple(value)) return generatePromise(value, FULFILLED);
        
        let then;
        try {
            then = value.then;
            if (typeof then === 'function') {
                return new Promise(then.bind(value));
            }
        } catch (err) {
            return generatePromise(err, REJECTED)
        }
        return generatePromise(value, FULFILLED)
    }

    reject(reason) {
        return generatePromise(reason, REJECTED)
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
}