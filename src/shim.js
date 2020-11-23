// @ts-nocheck
import { window } from "./env.js";

const Map = window.Map || (function () {
    function indexOf(map, key) {
        return map.items.indexOf(key);
    }
    function Map() {
        var self = this;
        self.items = [];
        self._values = [];
        self._keys = Set.prototype._keys;
    }
    Map.prototype = {
        get size() {
            return this.items.length;
        },
        has: function (v) {
            return indexOf(this, v) >= 0;
        },
        get: function (v) {
            var index = indexOf(this, v);
            return index >= 0 ? this._values[index] : undefined;
        },
        set: function (i, v) {
            var self = this;
            var index = indexOf(self, i);
            self._values[index >= 0 ? index : self.items.push(i) - 1] = v;
            return self;
        },
        delete: function (v) {
            var self = this;
            var index = indexOf(self, v);
            if (index >= 0) {
                self.items.splice(index, 1);
                self._values.splice(index, 1);
            }
            return index >= 0;
        },
        keys: function () {
            return this._keys();
        },
        values: function () {
            var self = this;
            return self._keys(function (v) {
                return self.get(v);
            });
        },
        entries: function () {
            var self = this;
            return self._keys(function (v) {
                return [v, self.get(v)];
            });
        },
        forEach: function (callback, thisArg) {
            var self = this;
            self.items.forEach(function (v, i) {
                callback.call(thisArg, self._values[i], v, self);
            });
        },
        clear: function () {
            this.items.splice(0);
            this._values.splice(0);
        }
    };
    return Map;
}());

const Set = window.Set || (function () {
    function Iterator(arr, callback) {
        var self = this;
        self.items = arr;
        self.index = -1;
        self.callback = callback || function (v) {
            return v;
        };
    }
    Iterator.prototype = {
        next: function () {
            var self = this;
            if (++self.index < self.items.length) {
                return {
                    value: self.callback(self.items[self.index], self.index),
                    done: false
                };
            }
            return {
                value: undefined,
                done: true
            };
        }
    };

    function Set() {
        this.items = [];
    }
    Set.prototype = {
        get size() {
            return this.items.length;
        },
        has: function (v) {
            return this.items.indexOf(v) >= 0;
        },
        add: function (v) {
            var items = this.items;
            if (items.indexOf(v) < 0) {
                items.push(v);
            }
            return this;
        },
        delete: function (v) {
            var index = this.items.indexOf(v);
            if (index >= 0) {
                this.items.splice(index, 1);
            }
            return index >= 0;
        },
        keys: function () {
            return this._keys();
        },
        values: function () {
            return this._keys();
        },
        entries: function () {
            return this._keys(function (v) {
                return [v, v];
            });
        },
        forEach: function (callback, thisArg) {
            var self = this;
            self.items.forEach(function (v) {
                callback.call(thisArg, v, v, self);
            });
        },
        clear: function () {
            this.items.splice(0);
        },
        _keys: function (callback) {
            return new Iterator(this.items, callback);
        }
    };
    return Set;
}());

const WeakMap = window.WeakMap || (function () {
    var num = 0;
    var state = 0;
    var returnValue;

    function WeakMap() {
        this.key = '__WeakMap' + (++num);
    }
    WeakMap.prototype = {
        get: function (key) {
            if (this.has(key)) {
                try {
                    state = 1;
                    key[this.key]();
                    if (state !== 2) {
                        throw new Error('Invalid operation');
                    }
                    var value = returnValue;
                    returnValue = null;
                    return value;
                } finally {
                    state = 0;
                }
            }
        },
        set: function (key, value) {
            Object.defineProperty(key, this.key, {
                configurable: true,
                value: function () {
                    if (state === 1) {
                        returnValue = value;
                        state = 2;
                    }
                }
            });
            return this;
        },
        has: function (key) {
            return key && Object.hasOwnProperty.call(key, this.key);
        },
        delete: function (key) {
            var has = this.has(key);
            if (has) {
                delete key[this.key];
            }
            return has;
        }
    };
    return WeakMap;
}());

const useRequire = typeof require === 'function';
const jQuery = window.jQuery || (useRequire && require('jquery'));
const Promise = window.Promise || (useRequire && require('promise-polyfill').default);

export {
    jQuery as $,
    Promise,
    Map,
    Set,
    WeakMap
};
