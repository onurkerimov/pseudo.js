/*
 * pseudo-ie11.js v0.1
 * Internet Explorer 11 compatible version, also supports modern browsers
 * Copyright (c) 2018 Onur Kerimov
 * http://github.com/onurkerimov
 * Licensed under the MIT license
 */

// Production steps of ECMA-262, Edition 6, 22.1.2.1
if (!Array.from) {
  Array.from = (function () {
    var toStr = Object.prototype.toString;
    var isCallable = function (fn) {
      return typeof fn === 'function' || toStr.call(fn) === '[object Function]';
    };
    var toInteger = function (value) {
      var number = Number(value);
      if (isNaN(number)) { return 0; }
      if (number === 0 || !isFinite(number)) { return number; }
      return (number > 0 ? 1 : -1) * Math.floor(Math.abs(number));
    };
    var maxSafeInteger = Math.pow(2, 53) - 1;
    var toLength = function (value) {
      var len = toInteger(value);
      return Math.min(Math.max(len, 0), maxSafeInteger);
    };

    // The length property of the from method is 1.
    return function from(arrayLike/*, mapFn, thisArg */) {
      // 1. Let C be the this value.
      var C = this;

      // 2. Let items be ToObject(arrayLike).
      var items = Object(arrayLike);

      // 3. ReturnIfAbrupt(items).
      if (arrayLike == null) {
        throw new TypeError('Array.from requires an array-like object - not null or undefined');
      }

      // 4. If mapfn is undefined, then let mapping be false.
      var mapFn = arguments.length > 1 ? arguments[1] : void undefined;
      var T;
      if (typeof mapFn !== 'undefined') {
        // 5. else
        // 5. a If IsCallable(mapfn) is false, throw a TypeError exception.
        if (!isCallable(mapFn)) {
          throw new TypeError('Array.from: when provided, the second argument must be a function');
        }

        // 5. b. If thisArg was supplied, let T be thisArg; else let T be undefined.
        if (arguments.length > 2) {
          T = arguments[2];
        }
      }

      // 10. Let lenValue be Get(items, "length").
      // 11. Let len be ToLength(lenValue).
      var len = toLength(items.length);

      // 13. If IsConstructor(C) is true, then
      // 13. a. Let A be the result of calling the [[Construct]] internal method 
      // of C with an argument list containing the single item len.
      // 14. a. Else, Let A be ArrayCreate(len).
      var A = isCallable(C) ? Object(new C(len)) : new Array(len);

      // 16. Let k be 0.
      var k = 0;
      // 17. Repeat, while k < len… (also steps a - h)
      var kValue;
      while (k < len) {
        kValue = items[k];
        if (mapFn) {
          A[k] = typeof T === 'undefined' ? mapFn(kValue, k) : mapFn.call(T, kValue, k);
        } else {
          A[k] = kValue;
        }
        k += 1;
      }
      // 18. Let putStatus be Put(A, "length", len, true).
      A.length = len;
      // 20. Return A.
      return A;
    };
  }());
}

window.pseudo = (function() {

    var sheet = document.createElement('style');
    sheet.type = 'text/css';
    document.head.appendChild(sheet);

    function fn() {
        for (var i = document.styleSheets.length - 1; i >= 0; i--) {
            var cssRules = document.styleSheets[i].cssRules;
            for (var j = cssRules.length - 1; j >= 0; j--) {
                if (cssRules[j].type == 1) {

                    var txt = cssRules[j].selectorText

                    if (txt.indexOf(":before") > -1 || txt.indexOf(":after") > -1) {

                        var array = []

                        txt.split(',').forEach(function(el) {

                            if (el.indexOf(":before") > -1 ) {
                                el = el.substring(0, el.indexOf("::before"))

                                var condition = Array.from(document.querySelector(el).children)
                                    .some(function(el) {
                                        return el.className === 'before'
                                    })

                                if (condition === false) {
                                    var div = document.createElement('div')
                                    div.classList.add('before')
                                    document.querySelector(el).insertBefore(div, document.querySelector(el).firstChild)
                                }


                                var index = cssRules[j].cssText.indexOf('{')
                                var cssTxt = cssRules[j].cssText.substring(index)
                                injectCSS(el + ' > ' + '.before ' + cssTxt)

                            } else if (el.indexOf(":after") > -1 ) {

                                el = el.substring(0, el.indexOf("::after"))

                                var condition = Array.from(document.querySelector(el).children)
                                    .some(function(el) {
                                        return el.className === 'after'
                                    })

                                if (condition === false) {
                                    var div = document.createElement('div')
                                    div.classList.add('after')
                                    document.querySelector(el).appendChild(div)
                                }

                                var index = cssRules[j].cssText.indexOf('{')
                                var cssTxt = cssRules[j].cssText.substring(index)
                                injectCSS(el + ' > ' + '.after ' + cssTxt)
                            }


                        })

                        var newTxt = []

                        txt.split(',').forEach(function (el) {
                            if (!(txt.indexOf(":before") > -1 || txt.indexOf(":after") > -1)) {
                                newTxt.push(el)
                            }
                        })

                        if (newTxt.length) {
                            document.styleSheets[i].cssRules[j].selectorText = newTxt.join(',')
                        } else {
                            document.styleSheets[i].deleteRule(j)
                        }
                    }
                }
            }
        }
    }

    function injectCSS(rule) {
        if (sheet.styleSheet) shet.styleSheet.cssText = rule; // Support for IE
        else sheet.appendChild(document.createTextNode(rule)); // Support for the rest
    }

    return fn()
})();