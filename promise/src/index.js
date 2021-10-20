'use strict';

var Promise = require('./core.js');
module.exports = Promise
require('./done.js');
require('./finally.js');
require('./es6-extensions.js');
require('./node-extensions.js');
require('./synchronous.js');
// PromiseKB test

Promise.defer = Promise.deferred = function(){
    const dfd = {};
    dfd.promise = new Promise((resolve, reject)=>{
        dfd.resolve = resolve;
        dfd.reject = reject;
    });
    return dfd;
}
module.exports = Promise;