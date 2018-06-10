/*
 * pseudo.js v0.1
 * Copyright (c) 2018 Onur Kerimov
 * http://github.com/onurkerimov
 * Licensed under the MIT license
 */

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

                    if (txt.includes(":before") || txt.includes(":after")) {

                        if(cssRules[j].style.content) {
                            var innerText = cssRules[j].style.content.split('\'').join('').split('"').join('')
                        }

                        var array = []
                        txt.split(',').forEach((el) => {

                            if (el.includes(":before")) {
                                el = el.substring(0, el.indexOf("::before"))

                                if (el.match(/[^ ]/) !== null) {
                                    var condition = Array.from(document.querySelector(el).children)
                                        .some((el) => {
                                            return el.className === 'before'
                                        })
                                }

                                if (condition === false || innerText) {
                                    var div = document.createElement('div')
                                    div.classList.add('before')

                                    if(innerText) {
                                        div.innerHTML = innerText
                                    } else if (document.querySelector(el).querySelector('after')) {
                                        div.innerHTML = document.querySelector(el).querySelector('before').innerHTML || ''
                                    }

                                    document.querySelectorAll(el).forEach((elem) => {
                                        elem.insertBefore(div, document.querySelector(el).firstChild)
                                    })
                                }


                                var index = cssRules[j].cssText.indexOf('{')
                                var cssTxt = cssRules[j].cssText.substring(index)
                                injectCSS(el + ' > ' + '.before ' + cssTxt)

                                

                            } else if (el.includes(":after")) {

                                el = el.substring(0, el.indexOf("::after"))

                                if (el.match(/[^ ]/) !== null) {
                                    var condition = Array.from(document.querySelector(el).children)
                                    .some((el) => {
                                        return el.className === 'after'
                                    })
                                }

                                if (condition === false|| innerText) {
                                    var div = document.createElement('div')
                                    div.classList.add('after')

                                    if(innerText) {
                                        div.innerHTML = innerText
                                    } else if (document.querySelector(el).querySelector('after')) {
                                        div.innerHTML = document.querySelector(el).querySelector('after').innerHTML || ''
                                    }

                                    document.querySelectorAll(el).forEach((elem) => {
                                        elem.appendChild(div)
                                    })
                                }

                                var index = cssRules[j].cssText.indexOf('{')
                                var cssTxt = cssRules[j].cssText.substring(index)
                                injectCSS(el + ' > ' + '.after ' + cssTxt)
                            }

                        })

                        var newTxt = []
                        txt.split(',').forEach((el) => {
                            if (!(el.includes(":before") || el.includes(":after"))) {
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