/*
    Enum Creator
    Version: 2.0
    Author: Zytekaron#0572 (272659147974115328)
    Updated: 11/2/19
*/
module.exports = class Enum {
    constructor(iterable) {
        if (type(iterable) === 'object') iterable = Object.entries(iterable);
        for (const object of iterable) {
            let key, value;
            if (type(object) === 'string') [key, value] = [object, object];
            if (type(object) === 'array') [key, value] = [...object];
            if (type(this[key]) !== 'undefined') throw new Error("Duplicate enum value '" + key + "'");
            this[key] = value;
        }
        Object.freeze(this);
    }

    get(identifier) {
        return this[identifier];
    }

    has(identifier) {
        return type(this[identifier]) !== 'undefined';
    }

    list(delimiter) {
        const items = Object.keys(this);
        return delimiter ? items.join(delimiter) : items;
    }

    get size() {
        return this.list().length;
    }
}

function type(obj) {
    return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase();
}