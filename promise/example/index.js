const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';
const DEFERRED = 'deferred';

function asap(fn) {
    setTimeout(() => {
        fn()
    }, 0);
}

function noop() {}

function isSimple(value) {
    return (typeof value !== 'object' && typeof value !== 'function') || value === null;
}

function generatePromise(value, state) {
    var promise = new PromiseKB(noop);
    promise._state = state;
    promise._value = value;
    return p;
}

// 处理 Promise 被继承并且重写了 then 方法时的情况
function safeThen(promise, onFulfilled, onRejected) {
    return new promise.constructor(function (resolve, reject) {
        var res = new Promise(noop);
        res.then(resolve, reject);
        handleThen(promise, new Deferred(res, onFulfilled, onRejected));
    });
}

function execResolver(promise, fn) {
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
        handleReject(promise, err);
    }
}

function handleDeferred(promise) {
    promise._deferreds.forEach(function(deferred) {
        handleThen(promise, deferred);
    });
    promise._deferreds = [];
}

function handleResolve(promise, value) {
    if (value === promise) {
        handleReject(promise, new TypeError('A promise cannot be resolved with itself.'));
        return;
    }

    if (isSimple(value)) {
        promise._state = FULFILLED;
        promise._value = value;
        handleDeferred(promise);
        return
    }

    let then;
    try {
        then = value.then;
    } catch (err) {
        handleReject(promise, err);
        return;
    }

    if (then === promise.then && value instanceof PromiseKB) {
        promise._state = DEFERRED;
        promise._value = value;
        handleDeferred(promise);
        return;
    }
    if (typeof then === 'function') {
        execResolver(promise, then.bind(value));
        return;
    }
    promise._state = FULFILLED;
    promise._value = value;
    handleDeferred(promise);
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
        let value;
        try {
            value = cb(promise._value);
        } catch (err) {
            handleReject(deferred.promise, err);
            return;
        }
        handleResolve(deferred.promise, value);
    });
}

function handleThen(promise, deferred) {
    while(promise._state === DEFERRED) {
        promise = promise._value;
    }
    if (promise._state === PENDING) {
        promise._deferreds.push(deferred);
    } else {
        handleSettled(promise, deferred);
    }
}

class Deferred {
    constructor(promise, onFulfilled, onRejected) {
        this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
        this.onRejected = typeof onRejected === 'function' ? onRejected : null;
        this.promise = promise;
    }
}

class PromiseKB {
    constructor(fn) {
        if (typeof fn !== 'function') {
            throw new TypeError('fn must be a function')
        }
        this._state = PENDING;
        this._value = undefined;
        this._deferreds = [];
        if (fn === noop) return;
        execResolver(this, fn);
    }

    then(onFulfilled, onRejected) {
        if (this.constructor !== PromiseKB) {
            return safeThen(this, onFulfilled, onRejected);
        }
        const nextPromise = new PromiseKB(noop);
        handleThen(this, new Deferred(nextPromise, onFulfilled, onRejected));
        return nextPromise;
    }

    resolve(value) {
        if (value instanceof PromiseKB) return value;
        if (isSimple(value)) return generatePromise(value, FULFILLED);

        let then;
        try {
            then = value.then;
        } catch (err) {
            return generatePromise(err, REJECTED)
        }

        if (typeof then === 'function') {
            return new PromiseKB(then.bind(value));
        }
        return generatePromise(value, FULFILLED)
    }

    reject(reason) {
        return generatePromise(reason, REJECTED)
    }

    catch(onRejected) {
        return this.then(null, onRejected);
    }
    
    /*
        实现点：
        1. callback 不接受任何参数, 无论 promise 是成功还是失败都会执行 callback
        2. finally 执行返回一个新的 promise, 新 promise 的状态和值由以下条件决定
            callback 执行出错，新 promise 状态变为 rejected, 值为错误信息
            callback 执行返回 promise, 新 promise 的状态由该 promise 决定
            callback 执行正常，新 promise 的状态和值同上一个 promise
    */
    finally(callback) {
        return this.then(
            function resolve(value) {
                return PromiseKB.resolve(callback()).then(function() {
                    return value;
                });
            },
            function reject(reason) {
                return PromiseKB.resolve(callback()).then(function() {
                    throw reason;
                });
            }
        )
    }
}


// PromiseKB test
PromiseKB.defer = PromiseKB.deferred = function(){
    const dfd = {};
    dfd.promise = new PromiseKB((resolve, reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
module.exports = PromiseKB;