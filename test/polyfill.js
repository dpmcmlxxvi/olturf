// Functions missing from PhantomJS

/*
 * @see {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/bind}
 */
(function() {
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs   = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP    = function() {},
                fBound  = function() {
                  return fToBind.apply(this instanceof fNOP
                         ? this
                         : oThis,
                         aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            if (this.prototype) {
                // Function.prototype doesn't have a prototype property
                fNOP.prototype = this.prototype; 
            }
            fBound.prototype = new fNOP();
            return fBound;
        };
    }
}());

/*
 * requestAnimationFrame polyfill
 * @author Erik Möller fixes from Paul Irish and Tino Zijdel
 * @license MIT
 * @see {@link http://paulirish.com/2011/requestanimationframe-for-smart-animating/}
 * @see {@link http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating}
 */
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame'] 
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
    if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() {
                callback(currTime + timeToCall);
                }, timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
    }
    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
    }
}());
