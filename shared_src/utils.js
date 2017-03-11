
// from https://developer.mozilla.org/en-US/docs/Code_snippets/QuerySelector
// select a single element
function $ (selector, el) {
    if (!el) {el = document;}
    return el.querySelector(selector);
}
// select an array of elements
function $$ (selector, el) {
    if (!el) {el = document;}
    //return el.querySelectorAll(selector);
    // Note: the returned object is a NodeList.
    // If you'd like to convert it to a Array for convenience, use this instead:
    return Array.prototype.slice.call(el.querySelectorAll(selector));
}

// simple recursive search for a particular parent
function firstParentMatching(element, className) {
    if (element.parentElement === null) {
        return;
    }
    if (element.parentElement.classList.contains(className)) {
        return element.parentElement;
    }
    return firstParentMatching(element.parentElement, className);
}

// from http://userscripts.org/guides/46
function forEach(lst, cb) {
    var i, len;
    if(!lst)
        return;
    if (lst.snapshotItem) {
        for (i = 0, len = lst.snapshotLength, snp = lst.snapshotItem; i < len; ++i)
            cb(snp(i), i, lst);
    } else if (lst.iterateNext) {
        var item, next = lst.iterateNext;
        while (item = next())
            cb(item, lst);
    } else if (typeof lst.length != 'undefined') {
        for (i = 0, len = lst.length; i < len; ++i)
            cb(lst[i], i, lst);
    } else if (typeof lst == "object") {
        for (i in lst)
            cb(lst[i], i, lst);
    }
}

module.exports = { $, $$, firstParentMatching, forEach };