/// <reference path="types.d.ts" />

/* --------------------------------------
 * Miscellaneous
 * -------------------------------------- */

export function noop(...args): void;

export function either(x: any, b: any): boolean;

/**
 * Tests whether a given object is an instance of the specified function.
 * @param a An input object to test against.
 * @param b A function.
 * @returns Returns the same object if it is an instance of the function; otherwise false.
 */
export function is<T extends Function>(a: any, b: T): InstanceType<T> | false;

/**
 * Tests whether a given value is undefined or null.
 * @param value An input value to be tested.
 */
export function isUndefinedOrNull(value: any): boolean;

/**
 * Tests whether the value is an array.
 * @param obj An input value to be tested.
 * @returns The same instance of array if it is a simple object; otherwise false.
 */
export function isArray<T>(obj: T): T extends any[] ? T : false;

/**
 * Tests whether the value is a function.
 * @param obj An input value to be tested.
 * @returns The same instance of function if it is a function; otherwise false.
 */
export function isFunction<T>(obj: T): T extends Function ? T : false;

/**
 * Tests whether the value is thenable, i.e. can be chained as a Promise.
 * @param obj An input value to be tested.
 * @returns The same instance of function if it is thenable; otherwise false.
 */
export function isThenable<T>(obj: T): T extends PromiseLike<any> ? T : false;

/**
 * Tests whether the value is a simple object, i.e. created with object literal {}, or with no prototype chain.
 * @param obj An input value to be tested.
 * @returns The same instance of object if it is a simple object; otherwise false.
 */
export function isPlainObject<T>(obj: T): T extends Record<any, any> ? T : false;

export function isArrayLike<T>(obj: T): T extends Array<any> | ArrayLike<any> ? T : false;

/**
 * Creates an array from input if it is not an array.
 * @param obj An input object.
 * @returns A copy of array if the object is an array; or an array containing items in an array-like object or iterable collection like Map or Set;
 * or an array with exactly one item (the input object) if it does not equals to null or undefined; otherwise an empty array.
 */
export function makeArray<T>(obj: T): T extends (infer U)[] | ArrayLike<infer U> | Map<any, infer U> | Set<infer U> ? U[] : Exclude<T, null | undefined>[];

export function extend<T extends object, U>(obj: T, arg1: U): T & U;

export function extend<T extends object, U, V>(obj: T, arg1: U, arg2: V): T & U & V;

/**
 * Copys all properties that is not with undefined value to the object supplied as the first argument.
 * Object values are copied by reference.
 * @param obj An object where properties to be copied to.
 * @param args One or more objects which their properties are copied.
 * @returns The same instance of object supplied as the first argument.
 */
export function extend<T extends object>(obj: T, ...args): T & Zeta.Dictionary;

export function extend<T extends object, U>(deep: true, obj: T, arg1: U): T & U;

export function extend<T extends object, U, V>(deep: true, obj: T, arg1: U, arg2: V): T & U & V;

/**
 * Copys all properties that is not with undefined value to the object supplied as the second argument.
 * @param deep If set to true, object values are copied by value.
 * @param obj An object where properties to be copied to.
 * @param args One or more objects which their properties are copied.
 * @returns The same instance of object supplied as the second argument.
 */
export function extend<T extends object>(deep: true, obj: T, ...args): T & Zeta.Dictionary;

/**
 * Iterates through items of the given array or array-like object and performs action on each item.
 * @param obj An array or an array-like object.
 * @param callback Function that will be executed in the context of each item.
 */
export function each<T>(obj: readonly T[] | ArrayLike<T>, callback: (i: number, v: T) => any): void;

/**
 * Iterates through items of the given set and performs action on each item.
 * @param obj A set object.
 * @param callback  Function that will be executed in the context of each item. Unlike Set#forEach, an index for each item is supplied as the key argument of the callback.
 */
export function each<T>(obj: Set<T>, callback: (i: number, v: T) => any): void;

/**
 * Iterates through items of the given map and performs action on each map entry.
 * @param obj A map object.
 * @param callback Function that will be executed in the context of each map entry.
 */
export function each<K, V>(obj: Map<K, V>, callback: (i: K, v: V) => any): void;

/**
 * Iterates through properties of the given object and performs action on each property key-value pair.
 * @param obj An object.
 * @param callback Function that will be executed in the context of each key-value pair.
 */
export function each<K, V>(obj: Record<K, V>, callback: (i: K, v: V) => any): void;

/**
 * Iterates through properties of the given object and performs action on each property key-value pair.
 * @param obj An object.
 * @param callback Function that will be executed in the context of each key-value pair.
 */
export function each(obj: any, callback: (i: any, v: any) => any): void;

/**
 * Creates an array containing items that is mapped from each item of the given array or array-like object.
 * @param obj An array or an array-like object.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<T, R>(obj: readonly T[] | ArrayLike<T>, callback: (v: T, i: number) => Zeta.MapResultValue<R>): R[];

/**
 * Creates an array containing items that is mapped from each item of the given set.
 * @param obj A set object.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<T, R>(obj: Set<T>, callback: (v: T, i: number) => Zeta.MapResultValue<R>): R[];

/**
 * Creates an array containing items that is mapped from each item of the given map.
 * @param obj A map object.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<K, V, R>(obj: Map<K, V>, callback: (v: V, i: K) => Zeta.MapResultValue<R>): R[];

/**
 * Creates an array containing items that is mapped from each property key-value pair of the given object.
 * @param obj An object.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<R>(obj: any, callback: (v: any, i: any) => Zeta.MapResultValue<R>): R[];

/**
 * Filters items from the given array or array-like object.
 * @param obj An array or an array-like object.
 * @param callback Function called for each item which returns if the item should be included.
 * @returns An array containing items for which the callback returned a truthy value.
 */
export function grep<T>(obj: readonly T[] | ArrayLike<T>, callback: (v: T, i: number) => any): T[];

/**
 * Filters items from the given set.
 * @param obj A set object.
 * @param callback Function called for each item which returns if the item should be included.
 * @returns An array containing items for which the callback returned a truthy value.
 */
export function grep<T>(obj: Set<T>, callback: (v: T, i: number) => any): T[];

/**
 * Filters items from the given map.
 * @param obj A map object.
 * @param callback Function called for each item which returns if the item should be included.
 * @returns An array containing items for which the callback returned a truthy value.
 */
export function grep<K, V>(obj: Map<K, V>, callback: (v: V, i: K) => any): V[];

/**
 * Filters values from the given object.
 * @param obj An object.
 * @param callback  Function called for each property which returns if the property value should be included.
 * @returns An array containing property values for which the callback returned a truthy value.
 */
export function grep(obj: any, callback: (v: any, i: any) => any): any[];

/**
 * Removes items that satifies a condition from an array and returns them as a new array.
 * @param arr An array object.
 * @param callback Function called for each item which returns if the item should be included.
 * @returns An array containing items for which the callback returned a truthy value.
 */
export function splice<T>(arr: T[], callback: (v: T, i: number) => any): T[];

/**
 * Extracts the first item in the given array or array-like object that satifies a condition.
 * @param obj An array or an array-like object.
 * @param callback Function called for each original item which determines if the item satifies a condition.
 * @returns The first item that satisfy the condition; or false if there is none.
 */
export function any<T>(obj: readonly T[] | ArrayLike<T>, callback: (v: T, i: number) => any): T | false;

/**
 * Extracts the first item in the given set that satifies a condition.
 * @param obj A set object.
 * @param callback Function called for each original item which determines if the item satifies a condition.
 * @returns The first item that satisfy the condition; or false if there is none.
 */
export function any<T>(obj: Set<T>, callback: (v: T, i: number) => any): T | false;

/**
 * Extracts the first item in the given map that satifies a condition.
 * @param obj A map object.
 * @param callback Function called for each original item which determines if the item satifies a condition.
 * @returns The first item that satisfy the condition; or false if there is none.
 */
export function any<K, V>(obj: Map<K, V>, callback: (v: V, i: K) => any): V | false;

/**
 * Extracts the first value in the properties of the given object that satifies a condition.
 * @param obj An object.
 * @param callback Function called for each original item which determines if the item satifies a condition.
 * @returns The first item that satisfy the condition; or false if there is none.
 */
export function any(obj: any, callback: (v: any, i: any) => any): any;

/**
 * Iterates the given array or array-like object until a non-falsy value is returned by the given callback.
 * @param obj An array or an array-like object.
 * @param callback Function called for each original item which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<T, R>(obj: readonly T[] | ArrayLike<T>, callback: (v: T, i: number) => R): R | false;

/**
 * Iterates the given set until a non-falsy value is returned by the given callback.
 * @param obj A set object.
 * @param callback Function called for each original item which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<T, R>(obj: Set<T>, callback: (v: T, i: number) => R): R | false;

/**
 * Iterates the given map until a non-falsy value is returned by the given callback.
 * @param obj A map object.
 * @param callback Function called for each original item which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<K, V, R>(obj: Map<K, V>, callback: (v: V, i: K) => R): R | false;

/**
 * Iterates properties of the given object until a non-falsy value is returned by the given callback.
 * @param obj An object.
 * @param callback Function called for each original item which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<R>(obj: any, callback: (v: any, i: string) => R): R | false;

/**
 * Creates an object with a single property with the specified name and value.
 * @param key A string represent the property name.
 * @param value A value associated with the property name.
 * @returns An object with the specified property.
 */
export function kv<T extends string | number | symbol, V>(key: T, value: V): Record<T, V>;

/**
 * Returns a new object that contains a subset of properties.
 * @param obj An object from which properties are copied.
 * @param keys Names of properties to be copied.
 */
export function pick<T>(obj: T, keys: readonly (keyof T)[]): Partial<T>;

export function pick<T>(obj: T, callback: (value: any, key: keyof T) => any): Partial<T>;

/**
 * Returns a new object that does not contain the specified properties
 * @param obj An object from which properties are copied.
 * @param keys Names of properties to be excluded.
 */
export function exclude<T>(obj: T, keys: readonly (keyof T)[]): Partial<T>;

export function exclude<T>(obj: T, callback: (value: any, key: keyof T) => any): Partial<T>;

/**
 * Gets item associated with the specified key in the given map.
 * @param map A map or weak map object.
 * @param key A value or object as the key.
 * @returns The item associated with the key if any.
 */
export function mapGet<K, V>(map: Map<K, V> | (K extends object ? WeakMap<K, V> : never), key: K): V;

/**
 * Gets item associated with the specified key in the given map, and create one if the key does not exist.
 * @param map A map or weak map object.
 * @param key A value or object as the key.
 * @param fn A constructor function, object of this type will be created if the key does not exist in the map.
 * @returns The item associated with the key.
 */
export function mapGet<K, T extends Zeta.AnyConstructor>(map: Map<K, InstanceType<T>> | (K extends object ? WeakMap<K, InstanceType<T>> : never), key: K, fn: T): InstanceType<T>;

/**
 * Gets item associated with the specified key in the given map, and create one if the key does not exist.
 * @param map A map or weak map object.
 * @param key A value or object as the key.
 * @param fn A function that returns the item to be stored in the map when called if the key does not exist in the map.
 * @returns The item associated with the key.
 */
export function mapGet<K, V>(map: Map<K, V> | (K extends object ? WeakMap<K, V> : never), key: K, fn: () => V): V;

export function mapRemove<K, V>(map: Map<K, V> | (K extends object ? WeakMap<K, V> : never), key: K): V;

/**
 * Adds item to a set and returns whether the set is changed, i.e. the item is not in the set before.
 * @param set A set or weak set object.
 * @param obj An item to be added.
 */
export function setAdd<T>(set: Set<T> | WeakSet<T>, obj: T): boolean;

/**
 * Determines whether two maps contains the same keys and each key associates the same value.
 * @param a A Map object to compare.
 * @param b A Map object to compare.
 */
export function equal(a: Map<any, any>, b: Map<any, any>): boolean;

/**
 * Determines whether two sets contains the same collection of items.
 * @param a A Set object to compare.
 * @param b A Set object to compare.
 */
export function equal(a: Set<any>, b: Set<any>): boolean;

/**
 * Determines whether two arrays are sequentially equal.
 * @param a An array to compare.
 * @param b An array to compare.
 */
export function equal(a: readonly any[], b: readonly any[]): boolean;

/**
 * Determines whether two objects have the same properties and each property associates the same value.
 * @param a An object to compare.
 * @param b An object to compare.
 */
export function equal(a: any, b: any): boolean;

/**
 * Creates a callback that when called, each supplied callback are called once with the arguments.
 * @param arr An array of callbacks.
 */
export function combineFn<T extends Zeta.AnyFunction>(arr: readonly T[]): ReturnType<T> extends void ? T : (...args: Parameters<T>) => void;

/**
 * Creates a callback that when called, each supplied callback are called once with the arguments.
 * @param arr An list of callbacks.
 */
export function combineFn<T extends Zeta.AnyFunction>(...arr: T[]): ReturnType<T> extends void ? T : (...args: Parameters<T>) => void;

/**
 * Creates a data store to associate private data to objects, filling the use case of private variables.
 * @returns A function to access the private data store.
 */
export function createPrivateStore<K extends object = object, V = any>(): Zeta.PrivateStore<K, V>;

export function setImmediate(fn: Zeta.AnyFunction, ...args): void;

export function setImmediateOnce(fn: Zeta.AnyFunction): void;

export function setTimeoutOnce(fn: Zeta.AnyFunction): void;


/* --------------------------------------
 * Throw helper
 * -------------------------------------- */

export function throwNotFunction(obj: any): Zeta.AnyFunction;


/* --------------------------------------
 * Strings
 * -------------------------------------- */

export function iequal(a: string, b: string): boolean;

export function randomId(): string;

/**
 * Repeats a given sequence of characters in the specified number of times.
 * @param str An input string.
 * @param count Number of recurrence.
 * @returns A string consists of recurring sequences of the input string.
 */
export function repeat(str: string, count: number): string;

/**
 * Converts a hypenated word into camel casing. It is not the inverse of [zeta.dom.hyphenate] as consecutive upper-cased letters are not preserved.
 * @param str An input string.
 * @returns camel A tring which as the same semantic meaning but in camel casing.
 */
export function camel(str: string): string;

/**
 * Converts a camel-cased string into hypenated lower-cased form. Consecutive upper-cased characters are considered as one word (e.g. DOMString would be converted to dom-string).
 * @param str An input string.
 * @returns A string which has the same semantic meaning but in hyphenated form.
 */
export function hyphenate(str: string): string;

/**
 * Takes an input string and convert the first character into upper case.
 * @param str An input string.
 * @returns A string which the first character is converted to upper case. If the first character is already in upper case, the string is untouched.
 */
export function ucfirst(str: string): string;

/**
 * Takes an input string and convert the first character into lower case.
 * @param str An input string.
 * @returns A string which the first character is converted to lower case. If the first character is already in lower case, the string is untouched.
 */
export function lcfirst(str: string): string;

/**
 * Trims whitespace characters in both ends of the string, including ZWSP (U+200B) but keep NBSP (U+00A0).
 * @param str An input string.
 * @returns A string which whitespace characters in both ends are trimmed.
 */
export function trim(str: string): string;

/**
 * Tests whether a word is contained in a whitespace-separated list of words.
 * @param needle A whitespace-separated list of words.
 * @param haystack A whitespace-separated list of words to match.
 * @returns The first word that appears in both word list; otherwise false.
 */
export function matchWord(needle: string, haystack: string): string | false;

/**
 * Decodes HTML character entities to its represented characters, such as `&lt;` to `<`.
 * @param input A string to be decoded.
 */
export function htmlDecode(input: string): string;


/* --------------------------------------
 * Promise related
 * -------------------------------------- */

/** @alias `Promise.resolve` */
export function resolve<T>(obj?: T): Promise<T>;

/** @alias `Promise.reject` */
export function reject(reason?: any): Promise<never>;

/**
 * Registers a callback to a promise object which is always fired whenever the promise object is fulfilled or rejeccted.
 * @param promise A promise object.
 * @param callback A callback function that receives the promise state and the fulfillment value or rejection reason.
 */
export function always<T, R>(promise: PromiseLike<T>, callback: (resolved: boolean, value: T) => R): Promise<R>;

export function always<T, R>(promise: T, callback: (resolved: boolean, value: Zeta.PromiseResult<T>) => R): Promise<R>;

export function resolveAll<T>(promises: T): Promise<T>;

export function resolveAll<T, R>(promises: T, callback: (result: T extends Promise<infer V> ? V : T) => R): Promise<R>;

/**
 * Creates a promise object that, waits until all promises are fulfilled or rejected,
 * and then resolves if all promises are fulfilled, or rejects if any one of them is rejected.
 * @param promises Promises to be waited.
 * @returns A promise object.
 */
export function resolveAll<T>(promises: readonly Promise<T>[]): Promise<T[]>;

export function resolveAll<T, R>(promises: readonly Promise<T>[], callback: (result: T[]) => R): Promise<R>;

export function resolveAll<T extends object>(promises: T): Promise<{ [P in keyof T]: P[K] extends Promise<infer V> ? V : P[K] }>;

export function resolveAll<T extends object, R>(promises: T, callback: (result: { [P in keyof T]: P[K] extends Promise<infer V> ? V : P[K] }) => R): Promise<R>;

export function catchAsync<T>(promise: Promise<T>): Promise<T>;

export function catchAsync<T>(promise: T): Promise<Zeta.PromiseResult<T>>;

export function setPromiseTimeout(promise: Promise<any>, milliseconds: number, resolveWhenTimeout?: boolean): void;


/* --------------------------------------
 * Property and prototype
 * -------------------------------------- */

/** @alias `Object.keys` */
export function keys(obj: object): string[];

/** @alias `Object.values` */
export function values(obj: object): any[];

export function hasOwnProperty(obj: object, prop: string): boolean;

/** @alias `Object.getOwnPropertyDescriptors` */
export function getOwnPropertyDescriptors(obj: object): PropertyDescriptorMap;

/**
 * Defines properties on an object.
 * Properties with function as values will be defined as non-enumerable.
 * @param o An object which the properties will be defined on.
 * @param p
 */
export function define<T extends object, U extends Zeta.Dictionary<number | string | boolean | object | null | Zeta.AnyFunction>>(o: T, p: Zeta.AdditionalMembers<T, U>);

/**
 * Defines an enumerble value property on an object.
 * @param obj An object which the property will be defined on.
 * @param prop Name of the property.
 * @param value Initial value of the property.
 * @param readonly Specifiying whether the property should be read-only.
 */
export function defineOwnProperty(obj: object, prop: string, value?: any, readonly?: boolean): void;

/**
 * Defined a get/setter property on an object.
 * @param obj An object which the property will be defined on.
 * @param name Name of the property.
 * @param get Getter function of the property.
 * @param [set] Setter function of the property. If none is given, the property will be get only.
 */
export function defineGetterProperty(obj: object, name: string, get: () => any, set?: (value: any) => void): void;

/**
 * Defined a non-enumerable property on an object.
 * @param obj An object which the property will be defined on.
 * @param name Name of the property.
 * @param value Initial value of the property.
 * @param readonly Specifiying whether the property should be read-only.
 */
export function defineHiddenProperty(obj: object, name: string, value: any, readonly?: boolean): void;

/**
 * Defines the parent class and properties on the prototype object of a function.
 * @param fn A function which its prototype object will have specified properties defined.
 * @param parentClass A function which serves as the parent class.
 * @param proto An object containing values, getters, setters or methods which will be defined on the prototype object.
 */
export function definePrototype<T extends Function, U extends Function, V extends Zeta.Dictionary<number | string | boolean | null | Zeta.AnyFunction>>(fn: T, parentClass: U, proto?: Zeta.AdditionalMembers<InstanceType<T> & InstanceType<U>, V>): void;

/**
 * Define properties on the prototype object of a function.
 * @param fn A function which its prototype object will have specified properties defined.
 * @param proto An object containing values, getters, setters or methods which will be defined on the prototype object.
 */
export function definePrototype<T extends Function, U extends Zeta.Dictionary<number | string | boolean | null | Zeta.AnyFunction>>(fn: T, proto: Zeta.AdditionalMembers<InstanceType<T>, U>): void;

/**
 * Creates an object which its prototype is set to the given function's prototype object.
 * @param proto A function with prototype object or an object as the prototype object.
 * @returns A new empty object with the specified prototype.
 */
export function inherit<T extends Function>(proto: T, props?: object): InstanceType<T>;

/**
 * Creates an object which its prototype is set to the given function's prototype object.
 * @param proto A function with prototype object or an object as the prototype object.
 * @returns A new empty object with the specified prototype.
 */
export function inherit(proto: any, props?: object): any;

/**
 * Recursively freezes all objects.
 * @param obj Object to be freezed.
 */
export function deepFreeze<T>(obj: T): Zeta.DeepReadonly<T>;


/* --------------------------------------
 * Observable
 * -------------------------------------- */

/**
 * Makes an object observable which hooked listeners
 * are called synchronously immediately after a property is changed.
 *
 * This must be called in advanced of any other methods such as
 * `watch`, `watchOnce`, `defineAliasProperty`, `defineObservableProperty`
 * which automatically turns an object observable.
 *
 * @param obj An object to observe.
 * @param sync Must be the boolean value `true`.
 * @returns A function which when called with a callback, the hooked listeners are not called until the given callback returns.
 * This is primarily for making updates to multiple properties singleton.
 */
export function watch(obj: object, sync: true): ((callback: () => any) => void);

/**
 * Hooks a listener callback which will be fired when any observed property has been changed.
 * @param obj An object to observe.
 * @param handler A callback which receives changed values.
 */
export function watch<T extends object>(obj: T, handler: (e: { oldValues: Partial<T>, newValues: Partial<T> }) => any): void;

export function watch<T extends object, P extends keyof T>(obj: T, prop: P, handler?: (this: T, newValue: T[P], oldValue: T[P], prop: P, obj: T) => void, fireInit?: boolean): void;

export function watchOnce<T extends object, P extends keyof T>(obj: T, prop: P): Promise<T[P]>;

export function watchOnce<T extends object, P extends keyof T, U>(obj: T, prop: P, handler: (this: T, newValue: T[P], oldValue: T[P], prop: P, obj: T) => U): Promise<U>;

/**
 * Creates a new object with `watch` and `watchOnce` method defined.
 */
export function watchable(): Zeta.Watchable<any>;

/**
 * Attaches `watch` and `watchOnce` method to the specified object.
 * @param obj An object.
 */
export function watchable<T extends object>(obj: T): Zeta.WatchableInstance<T>;

/**
 * Defines a property that gets and sets another property of the same or a different object
 * and will also get notified if that property has been changed.
 * @param obj An object which the new property is defined on.
 * @param prop Property name.
 * @param target An object which the new property will access.
 * @param targetProp Name of property to be accessed. If omitted, the property of the same name will be access.
 */
export function defineAliasProperty(obj: object, prop: string, target: object, targetProp?: string): void;

/**
 * Defines an observable property.
 * @param obj An object which the new property is defined on.
 * @param prop Property name.
 * @param initialValue Initial value.
 * @returns A setter function to update the value.
 * @see watch
 * @see watchOnce
 */
export function defineObservableProperty<T extends object, P extends keyof T>(obj: T, prop: P, initialValue?: T[P]): (value: T[P]) => void;

/**
 * Defines an observable property.
 * @param obj An object which the new property is defined on.
 * @param prop Property name.
 * @param initialValue Initial value.
 * @returns A setter function to update the value.
 * @see watch
 * @see watchOnce
 */
export function defineObservableProperty<T extends object, V>(obj: T, prop: string, initialValue?: V): (value: V) => void;

/**
 * Defines an observable property where the value is infiltrated when being set.
 * @param obj An object which the new property is defined on.
 * @param prop Property name.
 * @param initialValue Initial value.
 * @param callback A callback to mangle on the new value being set. If the returned value is same as old value, no event will be triggered.
 * @returns A setter function to update the value.
 */
export function defineObservableProperty<T extends object, P extends keyof T>(obj: T, prop: P, initialValue: T[P], callback: (this: T, newValue: T[P], oldValue: T[P]) => T[P]): (value: T[P]) => void;

/**
 * Defines an observable property where the value is infiltrated when being set.
 * @param obj An object which the new property is defined on.
 * @param prop Property name.
 * @param initialValue Initial value.
 * @param callback A callback to mangle on the new value being set. If the returned value is same as old value, no event will be triggered.
 * @returns A setter function to update the value.
 */
export function defineObservableProperty<T extends object, V>(obj: T, prop: string, initialValue: V, callback: (this: T, newValue: V, oldValue: V) => V): (value: V) => void;

/**
 * Defines a read-only observable property and retrieves the setter for private use.
 * @param obj An object which the new property is defined on.
 * @param prop Property name.
 * @param initialValue Initial value.
 * @returns A setter function to update the value.
 */
export function defineObservableProperty<T extends object, P extends keyof T>(obj: T, prop: P, initialValue: T[P], readonly: true): (value: T[P]) => void;

/**
 * Defines a read-only observable property and retrieves the setter for private use.
 * @param obj An object which the new property is defined on.
 * @param prop Property name.
 * @param initialValue Initial value.
 * @returns A setter function to update the value.
 */
export function defineObservableProperty<T extends object, V>(obj: T, prop: string, initialValue: V, readonly: true): (value: V) => void;
