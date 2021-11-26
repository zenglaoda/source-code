
function isPromise(obj) {
    return (obj && typeof obj.then === 'function') ? true : false;
}

function toPromise(obj) {
    if (isPromise(obj)) return obj;
    return Promise.resolve(obj);
}

/**
 * @description 
 * @param {GeneratorFunction | Generator} fn 
 * @returns {Promise<any>}
 */
function co(fn) {
    return new Promise((resolve, reject) => {
        let gen = fn;
        if (typeof fn === 'function') {
            gen = fn();
        }
        if (!gen || typeof gen.next !== 'function') {
            resolve(gen);
            return;
        }

        function onFulfilled(value) {
            let state;
            try {
                state = gen.next(value);
            } catch(err) {
                reject(err);
                return;
            }
            next(state);
        }

        function onRejected(reason) {
            let state;
            try {
                state = gen.throw(reason);
            } catch(err) {
                reject(err);
                return;
            }
            next(state);
        }

        function next(state) {
            if (state.done) {
                resolve(state.value);
                return;
            }
            toPromise(state.value).then(onFulfilled, onRejected);
        }

        onFulfilled();
    });
}

co(function * () {
    console.log(1);
    const res = yield 2;
    console.log(res);
});
co();
console.log('a');