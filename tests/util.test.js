import { any, arrRemove, deferrable, defineAliasProperty, defineObservableProperty, definePrototype, each, equal, exclude, fill, grep, inherit, isArrayLike, isPlainObject, isThenable, makeArray, map, mapGet, mapObject, pick, resolveAll, retryable, setPromiseTimeout, single, splice, watch, watchable, watchOnce, delay as util_delay } from "../src/util";
import { after, delay, mockFn, verifyCalls } from "./testUtil";

// avoid UnhandledPromiseRejectionWarning from node
function createRejectPromise() {
    var promise = Promise.reject(new Error('<Intended reject>'));
    promise.catch(function () { });
    return promise;
}

const { objectContaining } = expect;

const testObjs = [
    { a: 1 },
    [1, 2, 3],
    new Map([[1, 1]]),
    new Set([1]),
];

describe('isThenable', () => {
    it('should return same object for native Promise object', () => {
        const obj = Promise.resolve();
        expect(isThenable(obj)).toBe(obj);
    });

    it('should return same object for object with a callable `then` property', () => {
        const obj = { then: () => void 0 };
        expect(isThenable(obj)).toBe(obj);
    });

    it('should return false otherwise', () => {
        expect(isThenable({ then: 1 })).toBe(false);
        expect(isThenable({})).toBe(false);
    });
});

describe('isPlainObject', () => {
    it('should return same object if its prototype is ObjectPrototype or null', () => {
        const objLit = {};
        const objNull = Object.create(null);
        expect(isPlainObject(objLit)).toBe(objLit);
        expect(isPlainObject(objNull)).toBe(objNull);
    });

    it('should return false if its direct prototype is not ObjectPrototype', () => {
        function A() { }
        expect(isPlainObject(Object.create({}))).toBe(false);
        expect(isPlainObject(new A())).toBe(false);
        expect(isPlainObject(new Date())).toBe(false);
        expect(isPlainObject(function () { })).toBe(false);
    });

    it('should return false if it is not an object', () => {
        expect(isPlainObject(true)).toBe(false);
        expect(isPlainObject(false)).toBe(false);
        expect(isPlainObject(0)).toBe(false);
        expect(isPlainObject('')).toBe(false);
        expect(isPlainObject(Symbol())).toBe(false);
    });
});

describe('isArrayLike', () => {
    it('should return truthy value if length is 0', () => {
        expect(isArrayLike([])).toBeTruthy();
        expect(isArrayLike({ length: 0 })).toBeTruthy();
    });

    it('should return false for primitives other than string', () => {
        expect(isArrayLike(0)).toBe(false);
        expect(isArrayLike(1)).toBe(false);
        expect(isArrayLike(NaN)).toBe(false);
        expect(isArrayLike(true)).toBe(false);
    });

    it('should return false for function', () => {
        expect(isArrayLike(function () { })).toBe(false);
    });

    it('should return false for window object', () => {
        expect(isArrayLike(window)).toBe(false);
    });
});

describe('makeArray', () => {
    it('should return an empty array if it is undefined or null', () => {
        expect(makeArray(undefined)).toEqual([]);
        expect(makeArray(null)).toEqual([]);
    });

    it('should return a new copy if it is an array', () => {
        const arr = [0, 1, {}];
        expect(makeArray(arr)).toEqual(arr);
        expect(makeArray(arr)).not.toBe(arr);
    });

    it('should return an array with given string as the single item', () => {
        expect(makeArray('str')).toEqual(['str']);
    });

    it('should return an array with member iterated from forEach-able', () => {
        expect(makeArray(new Map([[1, 'foo'], [2, 'bar']]))).toEqual(['foo', 'bar']);
        expect(makeArray(new Set([1, 2]))).toEqual([1, 2]);

        const customObj = {
            forEach(callback) {
                callback('foo', 1);
                callback('bar', 1);
            }
        };
        expect(makeArray(customObj)).toEqual(['foo', 'bar']);
    });

    it('should return value as the single item otherwise', () => {
        const obj = {};
        const result = makeArray(obj);
        expect(result).toHaveLength(1);
        expect(result[0]).toBe(obj);

        expect(makeArray(1)).toEqual([1]);
    });
});

describe('each', () => {
    it('should stop invocating callback after false is returned - forEach', () => {
        const cb = mockFn();
        cb.mockReturnValueOnce(false);
        each({
            forEach(callback) {
                [2, 4, 6, 8].forEach(callback);
            }
        }, cb);
        verifyCalls(cb, [[0, 2]]);
    });

    it('should not invoke callback with element removed in set during invocation', () => {
        const set = new Set([1, 2, 3]);
        const cb = mockFn((i, v) => {
            if (v === 1) {
                set.delete(2);
            }
        });
        each(set, cb);
        verifyCalls(cb, [
            [0, 1],
            [1, 3],
        ]);
    });

    it('should not invoke callback with element removed in map during invocation', () => {
        const map = new Map([[1, 1], [2, 4], [3, 9]]);
        const cb = mockFn((i, v) => {
            if (v === 1) {
                map.delete(2);
            }
        });
        each(map, cb);
        verifyCalls(cb, [
            [1, 1],
            [3, 9],
        ]);
    });

    it('should invoke callback with input object as this', () => {
        const cb = mockFn();
        for (let obj of testObjs) {
            cb.mockClear();
            each(obj, cb);
            expect(cb.mock.instances[0]).toBe(obj);
        }
    });
});

describe('grep', () => {
    const obj = {
        a: 1,
        b: 0
    };
    obj.c = obj;
    const arr = [1, 0, 0, 2, obj];
    const map = new Map();
    map.set('a', 1);
    map.set(1, 0);
    map.set(obj, obj);
    const set = new Set();
    set.add(1);
    set.add(0);
    set.add(obj);

    it('should return matched items from array', () => {
        expect(grep(arr, v => v === 0 || v === obj)).toEqual([0, 0, obj]);
        expect(arr).toEqual([1, 0, 0, 2, obj]); // source array is untouched
    });

    it('should return matched items from object', () => {
        expect(grep(obj, v => v === 0 || v === obj)).toEqual([0, obj]);
    });

    it('should return matched items from map', () => {
        expect(grep(map, v => v === 0 || v === obj)).toEqual([0, obj]);
    });

    it('should return matched items from set', () => {
        expect(grep(set, v => v === 0 || v === obj)).toEqual([0, obj]);
    });

    it('should call callback with correct arguments', () => {
        const cb = mockFn().mockReturnValue(true);
        grep(arr, cb.mockReset());
        verifyCalls(cb, [
            [1, 0],
            [0, 1],
            [0, 2],
            [2, 3],
            [expect.sameObject(obj), 4]
        ]);
        grep(obj, cb.mockReset());
        verifyCalls(cb, [
            [1, 'a'],
            [0, 'b'],
            [expect.sameObject(obj), 'c']
        ]);
        grep(map, cb.mockReset());
        verifyCalls(cb, [
            [1, 'a'],
            [0, 1],
            [expect.sameObject(obj), expect.sameObject(obj)]
        ]);
        grep(set, cb.mockReset());
        verifyCalls(cb, [
            [1, 0],
            [0, 1],
            [expect.sameObject(obj), 2]
        ]);
    });

    it('should invoke callback with input object as this', () => {
        const cb = mockFn();
        for (let obj of testObjs) {
            cb.mockClear();
            grep(obj, cb);
            expect(cb.mock.instances[0]).toBe(obj);
        }
    });
});

describe('map', () => {
    it('should invoke callback with input object as this', () => {
        const cb = mockFn();
        for (let obj of testObjs) {
            cb.mockClear();
            each(obj, cb);
            expect(cb.mock.instances[0]).toBe(obj);
        }
    });
});

describe('splice', () => {
    it('should remove and return items in correct order from array', () => {
        const obj = {};
        const source = [1, 0, 0, 2, obj];
        const result = splice(source, v => v === 0 || v === obj);
        expect(source).toEqual([1, 2]);
        expect(result).toEqual([0, 0, obj]);
        expect(result[2]).toBe(obj); // shallow copy
    });

    xit('[need fix] should call callback with correct arguments', () => {
        const obj = {};
        const cb = mockFn().mockReturnValue(false);
        splice([1, 2, obj], cb);
        verifyCalls(cb, [
            [1, 0],
            [2, 1],
            [expect.sameObject(obj), 2]
        ]);
    });

    it('should invoke callback with input object as this', () => {
        const obj = [1, 2, 3];
        const cb = mockFn();
        splice(obj, cb);
        expect(cb.mock.instances[0]).toBe(obj);
    });
});

describe('any', () => {
    it('should be able to return 0 and null', () => {
        // fix @ edd5936
        expect(any([0, 1], v => v === 0)).toBe(0);
        expect(any([null, 1], v => v === null)).toBeNull();
    });

    it('should invoke callback with input object as this', () => {
        const cb = mockFn();
        for (let obj of testObjs) {
            cb.mockClear();
            any(obj, cb);
            expect(cb.mock.instances[0]).toBe(obj);
        }
    });
});

describe('single', () => {
    it('should invoke callback with input object as this', () => {
        const cb = mockFn();
        for (let obj of testObjs) {
            cb.mockClear();
            single(obj, cb);
            expect(cb.mock.instances[0]).toBe(obj);
        }
    });
});

describe('fill', () => {
    it('should set named properties with specified value', () => {
        const sym = Symbol();
        expect(fill({}, ['a', 0, sym], 1)).toEqual({ a: 1, 0: 1, [sym]: 1 });
        expect(fill([], [0, 1, 2], 1).length).toBe(3);
    });

    it('should overwrite existing properties', () => {
        expect(fill({ a: 1 }, 'a', 2)).toEqual({ a: 2 });
    });

    it('should return the same object', () => {
        const obj = {};
        expect(fill(obj, 'a', 1)).toBe(obj);
    });

    it('should return a new object', () => {
        const sym = Symbol();
        expect(fill(['a', 0, sym], 1)).toEqual({ a: 1, 0: 1, [sym]: 1 });
    });
});

describe('pick', () => {
    it('should return a new object with specified keys', () => {
        expect(pick({ a: 1, b: 2, c: 3 }, ['a', 'b'])).toEqual({ a: 1, b: 2 });
        // @ts-ignore: shorthand argument
        expect(pick({ a: 1, b: 2, c: 3 }, 'a b')).toEqual({ a: 1, b: 2 });
    });

    it('should shallow copy properties values', () => {
        const obj = {};
        expect(pick({ a: obj }, ['a']).a).toBe(obj);
        // @ts-ignore: shorthand argument
        expect(pick({ a: obj }, 'a').a).toBe(obj);
    });

    it('should copy properties declared on protoype', () => {
        function A() { };
        A.prototype.a = 1;
        expect(pick(new A(), ['a'])).toEqual({ a: 1 });
    });

    it('does not create property for non-exist one', () => {
        expect(pick({ a: 1 }, ['b'])).toEqual({});
    });

    it('should copy properties for which callback returns truthy values', () => {
        const cb = mockFn().mockReturnValueOnce(true).mockReturnValueOnce(false);
        expect(pick({ a: 0, b: 1 }, cb)).toEqual({ a: 0 });
    });

    it('should invoke callback with input object as this', () => {
        const obj = { a: 1 };
        const cb = mockFn();
        pick(obj, cb);
        expect(cb.mock.instances[0]).toBe(obj);
    });
});

describe('exclude', () => {
    it('should return a new object without specified keys', () => {
        expect(exclude({ a: 1, b: 2, c: 3 }, ['a', 'b'])).toEqual({ c: 3 });
        // @ts-ignore
        expect(exclude({ a: 1, b: 2, c: 3 }, 'a b')).toEqual({ c: 3 });
    });

    it('should shallow copy properties values', () => {
        const obj = {};
        expect(exclude({ a: 1, b: obj }, ['a']).b).toBe(obj);
        // @ts-ignore
        expect(exclude({ a: 1, b: obj }, 'a').b).toBe(obj);
    });

    it('should copy properties declared on protoype', () => {
        function A() { };
        A.prototype.a = 1;
        expect(exclude(new A(), [])).toEqual({ a: 1 });
    });

    it('should copy properties for which callback returns falsy values', () => {
        const cb = mockFn().mockReturnValueOnce(true).mockReturnValueOnce(false);
        expect(exclude({ a: 0, b: 1 }, cb)).toEqual({ b: 1 });
    });

    it('should invoke callback with input object as this', () => {
        const obj = { a: 1 };
        const cb = mockFn();
        exclude(obj, cb);
        expect(cb.mock.instances[0]).toBe(obj);
    });
});

describe('mapObject', () => {
    it('should return a new object which value of each property is transformed', () => {
        const obj = { a: 1, b: 2, c: 3 };
        expect(mapObject(obj, v => v + 1)).toEqual({ a: 2, b: 3, c: 4 });
        expect(obj).toEqual({ a: 1, b: 2, c: 3 });
    });

    it('should invoke callback with correct arguments', () => {
        const obj = { a: 1, b: 2, c: 3 };
        const cb = mockFn().mockImplementation(v => v);
        mapObject(obj, cb);
        verifyCalls(cb, [
            [1, 'a'],
            [2, 'b'],
            [3, 'c']
        ]);
        expect(cb.mock.instances[0]).toBe(obj);
    });

    it('should invoke callback with input object as this', () => {
        const obj = { a: 1 };
        const cb = mockFn();
        mapObject(obj, cb);
        expect(cb.mock.instances[0]).toBe(obj);
    });
});

describe('mapGet', () => {
    it('should not throw when callback is not constructible', () => {
        const map = new Map();
        var returnValue;
        expect(() => {
            returnValue = mapGet(map, 'foo', () => 'bar');
        }).not.toThrow();
        expect(returnValue).toBe('bar');
        expect(map.get('foo')).toBe('bar');
    });
});

describe('arrRemove', () => {
    it('should return the removed value', () => {
        expect(arrRemove([1, 2, 3], 2)).toBe(2);
    });
});

describe('equal', () => {
    const obj = {};

    it('should return if two objects have the same keys and values', () => {
        expect(equal({ a: 1, b: obj }, { a: 1, b: obj })).toBe(true);
        expect(equal({ a: NaN }, { a: NaN })).toBe(true);
        expect(equal({}, {})).toBe(true);

        expect(equal({ a: 1, b: obj }, { a: 1, b: {} })).toBe(false);
        expect(equal({ a: 1, b: obj }, { a: 1 })).toBe(false);
        expect(equal({ a: 1 }, { a: 1, b: obj })).toBe(false);
        expect(equal({ a: 1 }, { b: obj })).toBe(false);
    });

    it('should return if two arrays are sequentially equal', () => {
        expect(equal([1, obj], [1, obj])).toBe(true);
        expect(equal([NaN], [NaN])).toBe(true);
        expect(equal([], [])).toBe(true);

        expect(equal([1, obj], [1, {}])).toBe(false);
        expect(equal([1, obj], [1])).toBe(false);
        expect(equal([1], [1, obj])).toBe(false);
        expect(equal([1], [obj])).toBe(false);
    });

    it('should return if two maps are have the same keys and values', () => {
        expect(equal(new Map([[1, 1], [obj, obj]]), new Map([[obj, obj], [1, 1]]))).toBe(true);
        expect(equal(new Map([[NaN, NaN]]), new Map([[NaN, NaN]]))).toBe(true);
        expect(equal(new Map(), new Map())).toBe(true);

        // @ts-ignore
        expect(equal(new Map([[1, 1], [obj, obj]]), new Map([[obj, {}], [1, 1]]))).toBe(false);
        expect(equal(new Map([[1, 1], [obj, obj]]), new Map([[1, 1]]))).toBe(false);
        expect(equal(new Map([[1, 1]]), new Map([[1, 1], [obj, obj]]))).toBe(false);
        expect(equal(new Map([[1, 1]]), new Map([[obj, obj]]))).toBe(false);
    });

    it('should return if two sets have the same items', () => {
        expect(equal(new Set([1, obj]), new Set([obj, 1]))).toBe(true);
        expect(equal(new Set(), new Set())).toBe(true);

        expect(equal(new Set([1, obj]), new Set([{}, 1]))).toBe(false);
        expect(equal(new Set([1, obj]), new Set([1]))).toBe(false);
        expect(equal(new Set([1]), new Set([1, obj]))).toBe(false);
        expect(equal(new Set([1]), new Set([obj]))).toBe(false);
    });

    it('should return false if two objects are not of the same type', () => {
        expect(equal({}, new Map())).toBe(false);
        expect(equal({}, new Set())).toBe(false);
        expect(equal({}, [])).toBe(false);
        expect(equal([], new Map())).toBe(false);
        expect(equal([], new Set())).toBe(false);
        expect(equal(new Map(), new Set())).toBe(false);

        expect(equal({}, new Date())).toBe(false);
        expect(equal({}, Promise.resolve())).toBe(false);
    });

    it('should perform same value zero comparison for primitive values', () => {
        expect(equal(null, null)).toBe(true);
        expect(equal(undefined, undefined)).toBe(true);
        expect(equal(undefined, null)).toBe(false);
        expect(equal(null, {})).toBe(false);
        expect(equal({}, null)).toBe(false);
        expect(equal(-0, 0)).toBe(true);
        expect(equal(1, 1)).toBe(true);
        expect(equal(1, 0)).toBe(false);
        expect(equal(NaN, NaN)).toBe(true);
        expect(equal(true, true)).toBe(true);
        expect(equal(false, false)).toBe(true);
        expect(equal(true, false)).toBe(false);
        expect(equal('true', true)).toBe(false);
        expect(equal('true', 'true')).toBe(true);
        expect(equal(Symbol('true'), Symbol('true'))).toBe(false);
    });
});

describe('resolveAll', () => {
    it('should resolve from the thenable object', async () => {
        const obj1 = Promise.resolve(1);
        const obj2 = { then: cb => cb(2) };
        await expect(resolveAll(obj1)).resolves.toBe(1);
        await expect(resolveAll(obj2)).resolves.toBe(2);
    });

    it('should aggregate result from object properties but not recursively', async () => {
        // fix @ b08ab1a
        var innerObj = {
            a: 1,
            b: createRejectPromise()
        };
        var promise = resolveAll({
            a: 1,
            b: Promise.resolve(2),
            c: innerObj
        });
        await expect(promise).resolves.toEqual({
            a: 1,
            b: 2,
            c: innerObj
        });
    });
});

describe('retryable', () => {
    it('should invoke callback once at a time', async () => {
        const cb = mockFn();
        const r = retryable(cb);
        await Promise.all([r(), r()]);
        expect(cb).toBeCalledTimes(1);
    });

    it('should cache result on success', async () => {
        const cb = mockFn().mockResolvedValue(1);
        const r = retryable(cb);
        await expect(r()).resolves.toBe(1);
        await expect(r()).resolves.toBe(1);
        expect(cb).toBeCalledTimes(1);
    });

    it('should invoke callback again if previous run has failed', async () => {
        const error = new Error();
        const cb = mockFn().mockRejectedValueOnce(error);
        const r = retryable(cb);
        await expect(r()).rejects.toBe(error);
        await expect(r()).resolves.toBeUndefined();
        expect(cb).toBeCalledTimes(2);
    });
});

describe('deferrable', () => {
    it('should resolve for no promises', async () => {
        await expect(deferrable()).resolves.toBeUndefined();
    });

    it('should resolve after all promises has either resolved or rejected', async () => {
        const cb = mockFn();
        const p1 = delay(50).then(() => cb(1));
        const p2 = new Promise((_, reject) => reject(new Error));
        const p3 = new Promise((_, reject) => reject(new Error));
        await expect(deferrable([p1, p2, p3])).resolves.toBeUndefined();
        expect(cb).toBeCalledTimes(1);
    });

    it('should postpone fufillment by waiting promises supplied to waitFor', async () => {
        const cb = mockFn();
        const d = deferrable();
        expect(d.waitFor(delay(50).then(() => cb(1)))).toBe(true);
        await d;
        expect(cb).toBeCalledTimes(1);
    });

    it('should return false from waitFor if it has already been resolved', async () => {
        var d = deferrable();
        await d;
        expect(d.waitFor(new Promise(() => { }))).toBe(false);
    });
});

describe('setPromiseTimeout', () => {
    it('should reject promise if promise is not settled within a period', async () => {
        await expect(setPromiseTimeout(delay(2000), 500)).rejects.toBe('timeout');
    });

    it('should resolve promise if promise is not settled within a period if third argument is true', async () => {
        await expect(setPromiseTimeout(delay(2000), 500, true)).resolves.toBe('timeout');
    });
});

describe('delay', () => {
    it('should resolve after specific milliseconds', async () => {
        const promise = util_delay(50);
        await new Promise((resolve) => setTimeout(resolve, 50));

        const now = performance.now();
        await promise;
        expect(performance.now() - now).toBeLessThan(1);
    });

    it('should resolve with value returned from callback', async () => {
        const obj = {};
        await expect(util_delay(10, () => obj)).resolves.toBe(obj);
    });

    it('should reject with error thrown from callback', async () => {
        const error = new Error();
        await expect(util_delay(10, () => { throw error })).rejects.toBe(error);
    });
});

describe('definePrototype', () => {
    it('should copy property by property descriptors', () => {
        const prop = {
            dataProp: 1,
            get getterProp() {
                return 2;
            }
        };
        Object.defineProperty(prop, 'constProp', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: 42
        });
        function A() { }
        definePrototype(A, prop);

        expect(Object.getOwnPropertyDescriptors(A.prototype)).toEqual(objectContaining({
            dataProp: {
                configurable: true,
                enumerable: true,
                writable: true,
                value: 1
            },
            constProp: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: 42
            },
            getterProp: {
                configurable: true,
                enumerable: true,
                get: expect.any(Function),
                set: undefined
            }
        }));
    });

    it('should set enumerable to false for method-valued property', () => {
        function A() { }
        definePrototype(A, {
            method: () => true
        });

        expect(Object.getOwnPropertyDescriptor(A.prototype, 'method')).toEqual(objectContaining({
            configurable: true,
            enumerable: false,
            writable: true
        }));
    });

    it('should make instance of given function inherits prototype of another function', () => {
        const prop = {
            dataProp: 1,
            get getterProp() {
                return 2;
            }
        };
        Object.defineProperty(prop, 'constProp', {
            configurable: false,
            enumerable: false,
            writable: false,
            value: 42
        });
        function A() { }
        function B() { }
        definePrototype(A, B, prop);

        const obj = new A();
        expect(obj).toBeInstanceOf(B);
        expect(obj).toHaveProperty('dataProp', 1);
        expect(obj).toHaveProperty('getterProp', 2);
        expect(obj).toHaveProperty('constProp', 42);
        expect(obj.constructor).toBe(A);

        expect(Object.getOwnPropertyDescriptors(A.prototype)).toEqual(objectContaining({
            dataProp: {
                configurable: true,
                enumerable: true,
                writable: true,
                value: 1
            },
            constProp: {
                configurable: false,
                enumerable: false,
                writable: false,
                value: 42
            },
            getterProp: {
                configurable: true,
                enumerable: true,
                get: expect.any(Function),
                set: undefined
            }
        }));
    });

    it('should expose static property of inherited function', () => {
        function A() { }
        function B() { }
        B.prop = 1;
        definePrototype(A, B);

        expect(A).toHaveProperty('prop', 1);
        expect(Object.getPrototypeOf(A)).toBe(B);
    });
});

describe('inherit', () => {
    it('should create an object that inherit the function prototype and copy property descriptors', () => {
        function A() { }
        A.prototype.prop1 = 0;

        const obj = inherit(A, {
            prop1: 1,
            get prop2() { return 2; }
        });
        expect(obj).toBeInstanceOf(A);
        expect(obj).toHaveProperty('prop1', 1);
        expect(obj).toHaveProperty('prop2', 2);
        expect(Object.getOwnPropertyDescriptor(obj, 'prop2')).toEqual({
            configurable: true,
            enumerable: true,
            get: expect.any(Function),
            set: undefined
        });
    });

    it('should create an object that inherit the prototype and copy property descriptors', () => {
        const proto = {
            prop1: 0
        };
        const obj = inherit(proto, {
            prop1: 1,
            get prop2() { return 2; }
        });
        expect(Object.getPrototypeOf(obj)).toBe(proto);
        expect(obj).toHaveProperty('prop1', 1);
        expect(obj).toHaveProperty('prop2', 2);
        expect(Object.getOwnPropertyDescriptor(obj, 'prop2')).toEqual({
            configurable: true,
            enumerable: true,
            get: expect.any(Function),
            set: undefined
        });
    });

    it('should use definePrototype to define property', () => {
        const obj = inherit({}, {
            method: () => true
        });
        expect(Object.getOwnPropertyDescriptor(obj, 'method')).toHaveProperty('enumerable', false);
    });
});

describe('defineAliasProperty', () => {
    it('should define a property that get and set another property', () => {
        const source = {};
        const alias = {};
        defineAliasProperty(alias, 'prop', source);
        defineAliasProperty(alias, 'customProp', source, 'anotherProp');

        alias.prop = 42;
        expect(source.prop).toBe(42);
        expect(alias.prop).toBe(42);

        alias.customProp = 42;
        expect(source.anotherProp).toBe(42);
        expect(alias.customProp).toBe(42);
    });

    it('should throw if the property is not a data property', () => {
        const source = {};
        const alias = {
            get prop() {
                return 1;
            }
        };
        expect(() => defineAliasProperty(alias, 'prop', source)).toThrow();

        const objWithProto = Object.create(alias);
        expect(() => defineAliasProperty(objWithProto, 'prop', source)).toThrow();
    });
});

describe('defineObservableProperty', () => {
    it('should define observable property', async () => {
        const obj = {};
        const cb = mockFn();
        defineObservableProperty(obj, 'prop', 1);

        // @ts-ignore
        watch(obj, 'prop', cb);
        await after(() => {
            obj.prop = 2;
        });
        verifyCalls(cb, [
            [2, 1, 'prop', expect.sameObject(obj)]
        ]);
    });

    it('should define observable property with private setter', async () => {
        const obj = {};
        const cb = mockFn();
        const setProp = defineObservableProperty(obj, 'prop', 1, true);

        expect(setProp).toBeInstanceOf(Function);
        expect(obj).toHaveProperty('prop', 1);
        expect(() => obj.prop = 2).toThrow();

        // @ts-ignore
        watch(obj, 'prop', cb);
        await after(() => {
            setProp(2);
        });
        verifyCalls(cb, [
            [2, 1, 'prop', expect.sameObject(obj)]
        ]);
    });

    it('should fire callback when property is being set', () => {
        const obj = {};
        const cb = mockFn().mockReturnValue(42);
        defineObservableProperty(obj, 'prop', 1, cb);
        expect(obj).toHaveProperty('prop', 1);

        obj.prop = 2;
        verifyCalls(cb, [
            [2, 1]
        ]);
        expect(obj.prop).toBe(42);
    });

    it('should define observable property on target object of an alias property', async () => {
        const source = {};
        const alias = {};
        const cb = mockFn();
        defineAliasProperty(alias, 'prop', source);
        defineObservableProperty(alias, 'prop');

        // @ts-ignore
        watch(alias, 'prop', cb);
        await after(() => {
            source.prop = 42;
        });
        expect(cb).toBeCalledTimes(1);
    });

    it('should throw if the property is not a data property', () => {
        const obj = {
            get prop() {
                return 1;
            }
        };
        expect(() => defineObservableProperty(obj, 'prop')).toThrow();

        const objWithProto = Object.create(obj);
        expect(() => defineObservableProperty(objWithProto, 'prop')).toThrow();
    });

    it('should throw if alias property does not pointer to data property', () => {
        const source = {
            get prop() {
                return 42;
            }
        };
        const alias = {};
        defineAliasProperty(alias, 'prop', source);
        expect(() => defineObservableProperty(alias, 'prop')).toThrow();
    });

    it('should not trigger callback when setting same value', async () => {
        const cb = mockFn();
        const obj = {
            propNaN: NaN,
            propZero: 0
        };
        for (var i in obj) {
            defineObservableProperty(obj, i, obj[i]);
            watch(obj, i, cb);
        }
        await after(() => {
            obj.propNaN = NaN;
            obj.propZero = -0;
        });
        expect(cb).not.toBeCalled();
    });
});

describe('watch', () => {
    it('should fire callback once after specified property is updated', async () => {
        const obj = {
            prop: 1
        };
        const cb = mockFn();
        watch(obj, 'prop', cb);
        await after(() => {
            obj.prop = 2;
        });
        verifyCalls(cb, [
            [2, 1, 'prop', expect.sameObject(obj)]
        ]);

        cb.mockReset();
        await after(() => {
            obj.prop = 3;
            obj.prop = 4;
        });
        verifyCalls(cb, [
            [4, 2, 'prop', expect.sameObject(obj)]
        ]);
    });

    it('should not fire callback if property is set to original value before callback is fired', async () => {
        const obj = {
            prop1: 1,
            prop2: 0,
            prop3: NaN
        };
        const cb = mockFn();
        watch(obj, 'prop1', cb);
        watch(obj, 'prop2', cb);
        watch(obj, 'prop3', cb);
        await after(() => {
            obj.prop1 = 2;
            obj.prop1 = 1;
            obj.prop2 = 1;
            obj.prop2 = -0;
            obj.prop3 = 1;
            obj.prop3 = NaN;
        });
        expect(cb).not.toBeCalled();
    });

    it('should fire callback once immediately if fireInit is true', () => {
        const obj = {
            prop: 1
        };
        const cb = mockFn();
        watch(obj, 'prop', cb, true);
        verifyCalls(cb, [
            [1, null, 'prop', expect.sameObject(obj)]
        ]);
    });

    it('should fire callback once after any observable property is updated if property is not specified', async () => {
        const obj = {
            prop1: 1,
            prop2: 2,
            prop3: 3
        };
        const cb = mockFn();
        defineObservableProperty(obj, 'prop1');
        defineObservableProperty(obj, 'prop2');
        defineObservableProperty(obj, 'prop3');
        watch(obj, cb);

        await after(() => {
            obj.prop1 = 41;
            obj.prop2 = 42;
        });
        expect(cb).toBeCalledTimes(1);
        expect(cb).toBeCalledWith({
            oldValues: { prop1: 1, prop2: 2 },
            newValues: { prop1: 41, prop2: 42 }
        });

        cb.mockReset();
        await after(() => {
            obj.newProp = 'bar';
        });
        expect(cb).not.toBeCalled();
    });

    it('should not fire callback if all properties are set to original value', async () => {
        const obj = {
            prop1: 1,
            prop2: 2,
            prop3: 3
        };
        const cb = mockFn();
        defineObservableProperty(obj, 'prop1');
        defineObservableProperty(obj, 'prop2');
        defineObservableProperty(obj, 'prop3');
        watch(obj, cb);

        await after(() => {
            obj.prop1 = 41;
            obj.prop2 = 42;
            obj.prop1 = 1;
            obj.prop2 = 2;
        });
        expect(cb).not.toBeCalled();
    });

    it('should watch an object synchronously if second argument is true', () => {
        const obj = {
            prop1: 1,
            prop2: 2
        };
        const handleChanges = watch(obj, true);
        const cb = mockFn();
        defineObservableProperty(obj, 'prop1');
        defineObservableProperty(obj, 'prop2');
        watch(obj, 'prop1', cb);
        watch(obj, 'prop2', cb);
        expect(handleChanges).toBeInstanceOf(Function);

        obj.prop1 = 41;
        obj.prop2 = 42;
        verifyCalls(cb, [
            [41, 1, 'prop1', expect.sameObject(obj)],
            [42, 2, 'prop2', expect.sameObject(obj)]
        ]);

        cb.mockReset();
        handleChanges(function () {
            obj.prop1 = 61;
            obj.prop2 = 62;
            obj.prop1 = 81;
            obj.prop2 = 82;
        });
        verifyCalls(cb, [
            [81, 41, 'prop1', expect.sameObject(obj)],
            [82, 42, 'prop2', expect.sameObject(obj)]
        ]);
    });

    it('should invoke action callback exactly once despite further updates are made', () => {
        const obj = {
            prop1: 1,
            prop2: 2,
        };
        const handleChanges = watch(obj, true);
        const cb = mockFn();
        defineObservableProperty(obj, 'prop1');
        defineObservableProperty(obj, 'prop2');
        watch(obj, 'prop1', () => {
            obj.prop2 = 42;
        });
        cb.mockImplementationOnce(() => {
            obj.prop1 = 41;
        });
        handleChanges(cb);
        expect(cb).toBeCalledTimes(1);
    });

    it('should return an unregistering callback that remove the handler', async () => {
        const obj = {
            prop: 1
        };
        const cb = mockFn();
        const unwatch = watch(obj, 'prop', cb);
        await after(() => {
            obj.prop = 2;
        });
        verifyCalls(cb, [
            [2, 1, 'prop', expect.sameObject(obj)]
        ]);

        cb.mockReset();
        unwatch();
        await after(() => {
            obj.prop = 3;
            obj.prop = 4;
        });
        expect(cb).not.toBeCalled();
    });

    it('should return an unregistering callback that only remove the first occurence of an handler', async () => {
        const obj = {
            prop: 1
        };
        defineObservableProperty(obj, 'prop');

        const cb = mockFn();
        const unwatch = watch(obj, cb);
        watch(obj, cb);
        await after(() => {
            obj.prop = 2;
        });
        expect(cb).toBeCalledTimes(2);

        cb.mockReset();
        unwatch();
        await after(() => {
            obj.prop = 3;
        });
        expect(cb).toBeCalledTimes(1);
    });

    it('should return an unregistering callback that only remove an handler once', async () => {
        const obj = {
            prop: 1
        };
        defineObservableProperty(obj, 'prop');

        const cb = mockFn();
        const unwatch = watch(obj, cb);
        await after(() => {
            obj.prop = 2;
        });
        expect(cb).toBeCalledTimes(1);

        cb.mockReset();
        unwatch();
        watch(obj, cb);
        unwatch();
        await after(() => {
            obj.prop = 3;
        });
        expect(cb).toBeCalledTimes(1);
    });

    it('should not throw error when watching observed property defined in prototype', async () => {
        function A() { }
        defineObservableProperty(A.prototype, 'test');
        const cb = mockFn();
        const a = new A();

        expect(() => watch(a, 'test', cb)).not.toThrow();
        await after(() => {
            a.test = 1;
        });
        expect(cb).toBeCalledTimes(1);
    });
});

describe('watchOnce', () => {
    it('should return promise that is resolved when specified property is updated', async () => {
        const obj = {
            prop: 1
        };
        const promise = watchOnce(obj, 'prop');
        obj.prop = 42;
        await expect(promise).resolves.toBe(42);
    });

    it('should return promise that is resolved with returned value from callback', async () => {
        const obj = {
            prop: 1
        };
        const cb = mockFn().mockReturnValue(86);
        const promise = watchOnce(obj, 'prop', cb);
        obj.prop = 42;
        await expect(promise).resolves.toBe(86);
        expect(cb).toBeCalledTimes(1);
        expect(cb).toBeCalledWith(42);
    });
});

describe('watchable', () => {
    it('should create an object with watch and watchOnce defined', async () => {
        const obj = watchable();
        const cb = mockFn();
        obj.watch('prop', cb);

        await after(() => {
            // @ts-ignore
            obj.prop = 1;
        });
        verifyCalls(cb, [
            [1, undefined, 'prop', expect.sameObject(obj)]
        ]);
    });

    it('should define watch and watchOnce on existing object', async () => {
        const obj = watchable({ prop: 1 });
        const cb = mockFn();
        obj.watch('prop', cb);

        await after(() => {
            obj.prop = 2;
        });
        verifyCalls(cb, [
            [2, 1, 'prop', expect.sameObject(obj)]
        ]);
    });

    it('should work on prototyped object', async () => {
        function A() {
            this.prop = 1;
        }
        watchable(A.prototype);

        const obj = new A();
        const cb = mockFn();
        // @ts-ignore
        obj.watch('prop', cb);

        await after(() => {
            obj.prop = 2;
        });
        verifyCalls(cb, [
            [2, 1, 'prop', expect.sameObject(obj)]
        ]);
    });
});
