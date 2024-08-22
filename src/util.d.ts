/// <reference path="types.d.ts" />

interface NodeIterator<T> {
    nextNode(): T
}

interface HasEntries<K, V> {
    entries(): Iterator<[K, V]>;
}

type EntryKey<T> = T extends HasEntries<infer K, any> ? K : never;
type EntryValue<T> = T extends HasEntries<any, infer V> ? V : never;
type CollectionKeyOf<T> =
    T extends HasEntries<infer K, any> ? K :
    T extends NodeIterator<any> ? number :
    T extends Iterator<any> ? number :
    Zeta.KeyOf<T>;
type CollectionValueOf<T> =
    T extends HasEntries<any, infer V> ? V :
    T extends NodeIterator<infer V> ? Exclude<V, null> :
    T extends Iterator<infer V> ? V :
    Zeta.ValueOf<T>;
type ExtractAny<T, U> = Zeta.IsAnyOrUnknown<T> extends true ? U | false : T extends U ? T : false;
type Union<T, V> =
    Zeta.IsAnyOrUnknown<T> extends true ? any :
    T extends object ? (V extends T ? V : T extends V ? T : V extends object ? T & V : T) :
    V extends object ? V : any;
type UnionAll<T> = T extends never[] ? {} : T extends [infer U, ...infer V] ? Union<U, UnionAll<V>> : {};
type InstanceTypeOrObject<T> = T extends Zeta.AnyConstructorOrClass ? InstanceType<T> : object;
type MaybeFunctionOrConstructor = Zeta.AnyFunction & Zeta.AnyConstructor;

/* --------------------------------------
 * Miscellaneous
 * -------------------------------------- */

export function noop(...args: any[]): void;

export function pipe<T>(value: T): T;

export function either(x: any, b: any): boolean;

/**
 * @alias {@link Object.is}
 */
export function sameValue(x: any, y: any): boolean;

export function sameValueZero(x: any, y: any): boolean;

/**
 * Tests whether a given object is an instance of the specified function.
 * @param a An input object to test against.
 * @param b A function.
 * @returns Returns the same object if it is an instance of the function; otherwise false.
 */
export function is<T extends Function>(a: any, b: T): InstanceTypeOrObject<T> | false;

/**
 * Tests whether a given value is undefined or null.
 * @param value An input value to be tested.
 */
export function isUndefinedOrNull(value: any): value is undefined | null;

/**
 * Tests whether the value is an array.
 * @param obj An input value to be tested.
 * @returns The same instance of array if it is a simple object; otherwise false.
 */
export function isArray<T>(obj: T): ExtractAny<T, any[]>;

/**
 * Tests whether the value is a function.
 * @param obj An input value to be tested.
 * @returns The same instance of function if it is a function; otherwise false.
 */
export function isFunction<T>(obj: T): Zeta.IsAnyOrUnknown<T> extends true ? MaybeFunctionOrConstructor | false : ExtractAny<T, Zeta.AnyFunction | Zeta.AnyConstructorOrClass>;

/**
 * Tests whether the value is thenable, i.e. can be chained as a Promise.
 * @param obj An input value to be tested.
 * @returns The same instance of function if it is thenable; otherwise false.
 */
export function isThenable<T>(obj: T): ExtractAny<T, PromiseLike<any>>;

/**
 * Tests whether the value is a simple object, i.e. created with object literal {}, or with no prototype chain.
 * @param obj An input value to be tested.
 * @returns The same instance of object if it is a simple object; otherwise false.
 */
export function isPlainObject<T>(obj: T): ExtractAny<T, object>;

export function isArrayLike<T>(obj: T): ExtractAny<T, ArrayLike<any>>;

/**
 * Creates an array from input if it is not an array.
 * @param obj An input object.
 * @returns A copy of array if the object is an array; or an array containing items in an array-like object or iterable collection like Map or Set;
 * or an array with exactly one item (the input object) if it does not equals to null or undefined; otherwise an empty array.
 */
export function makeArray<T>(obj: T): Zeta.IsAnyOrUnknown<T> extends true ? any[] : T extends (infer U)[] | ArrayLike<infer U> | Map<any, infer U> | Set<infer U> ? U[] : Exclude<T, null | undefined>[];

/**
 * Copys all properties that is not with undefined value to the object supplied as the first argument.
 * Object values are copied by reference.
 * @param obj An object where properties to be copied to.
 * @param args One or more objects which their properties are copied.
 * @returns The same instance of object supplied as the first argument.
 */
export function extend<T extends any[]>(...args: T): UnionAll<T>;

/**
 * Copys all properties that is not with undefined value to the object supplied as the second argument.
 * @param deep If set to true, object values are copied by value.
 * @param obj An object where properties to be copied to.
 * @param args One or more objects which their properties are copied.
 * @returns The same instance of object supplied as the second argument.
 */
export function extend<T extends any[]>(deep: true, ...args: T): UnionAll<T>;

/**
 * Treats the specified string as a whitespace-deimited list of tokens and performs action on each token.
 * @param value A whitespace-deimited string.
 * @param callback Function that will be executed in the context of each item.
 */
export function each<T extends string>(value: T, callback: (this: T, i: number, v: Zeta.WhitespaceDelimited<T>) => any): void;

/**
 * Iterates through items of the given array or array-like object and performs action on each item.
 * @param obj An array or an array-like object.
 * @param callback Function that will be executed in the context of each item.
 */
export function each<T extends readonly any[] | ArrayLike<any>>(obj: T, callback: (this: T, i: number, v: Zeta.ArrayMember<T>) => any): void;

/**
 * Iterates through items of the given set and performs action on each item.
 * @param obj A set object.
 * @param callback  Function that will be executed in the context of each item. Unlike Set#forEach, an index for each item is supplied as the key argument of the callback.
 */
export function each<T>(obj: Set<T>, callback: (this: Set<T>, i: number, v: T) => any): void;

/**
 * Iterates through items of the given map and performs action on each map entry.
 * @param obj A map object.
 * @param callback Function that will be executed in the context of each map entry.
 */
export function each<K, V>(obj: Map<K, V>, callback: (this: Map<K, V>, i: K, v: V) => any): void;

/**
 * Iterates through key-value pairs and performs action on each key-value pair.
 * @param obj A key-value pair provider object.
 * @param callback Function that will be executed in the context of each key-value pair.
 */
export function each<T extends HasEntries<any, any>>(obj: T, callback: (this: T, i: EntryKey<T>, v: EntryValue<T>) => any): void;

/**
 * Iterates through nodes from the node iterator and performs action on each node.
 * Note that the iterator will be not reset after iteration.
 * @param obj A node iterator.
 * @param callback Function that will be executed in the context of each node.
 */
export function each<T extends NodeIterator<any>>(obj: T, callback: (this: T, i: number, v: CollectionValueOf<T>) => any): void;

/**
 * Iterates through data from the iterator and performs action on each data.
 * Note that the iterator will be not reset after iteration.
 * @param obj An iterator.
 * @param callback Function that will be executed in the context of each data.
 */
export function each<T extends Iterator<any>>(obj: T, callback: (this: T, i: number, v: CollectionValueOf<T>) => any): void;

/**
 * Iterates through properties of the given object and performs action on each property key-value pair.
 * @param obj An object.
 * @param callback Function that will be executed in the context of each key-value pair.
 */
export function each<T>(obj: T, callback: (this: T, i: CollectionKeyOf<T>, v: CollectionValueOf<T>) => any): void;

/**
 * Creates an array containing items that is mapped from each item of the given array or array-like object.
 * @param obj An array or an array-like object.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<T extends readonly any[] | ArrayLike<any>, R>(obj: T, callback: (this: T, v: Zeta.ArrayMember<T>, i: number) => Zeta.MapResultValue<R>): R[];

/**
 * Creates an array containing items that is mapped from each item of the given set.
 * @param obj A set object.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<T, R>(obj: Set<T>, callback: (this: Set<T>, v: T, i: number) => Zeta.MapResultValue<R>): R[];

/**
 * Creates an array containing items that is mapped from each item of the given map.
 * @param obj A map object.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<K, V, R>(obj: Map<K, V>, callback: (this: Map<K, V>, v: V, i: K) => Zeta.MapResultValue<R>): R[];

/**
 * Creates an array containing items that is mapped from each key-value pair.
 * @param obj A key-value pair provider object.
 * @param callback Function called for each key-value pair which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<T extends HasEntries<any, any>, R>(obj: T, callback: (this: T, v: EntryValue<T>, i: EntryKey<T>) => Zeta.MapResultValue<R>): R[];

/**
 * Creates an array containing items that is mapped from each iterated node.
 * Note that the iterator will be not reset after iteration.
 * @param obj A node iterator.
 * @param callback Function called for each node which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<T extends NodeIterator<any>, R>(obj: T, callback: (this: T, v: CollectionValueOf<T>, i: number) => Zeta.MapResultValue<R>): R[];

/**
 * Creates an array containing items that is mapped from each iterated data.
 * Note that the iterator will be not reset after iteration.
 * @param obj An iterator.
 * @param callback Function called for each data which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<T extends Iterator<any>, R>(obj: T, callback: (this: T, v: CollectionValueOf<T>, i: number) => Zeta.MapResultValue<R>): R[];

/**
 * Creates an array containing items that is mapped from each property key-value pair of the given object.
 * @param obj An object.
 * @param callback Function called for each original item which returns one or more items to the result array. If null or undefined is returned, it will not be included in the result array.
 * @returns An array containing resulting items from the callback.
 */
export function map<T, R>(obj: T, callback: (this: T, v: CollectionValueOf<T>, i: CollectionKeyOf<T>) => Zeta.MapResultValue<R>): R[];

/**
 * Filters items from the given array or array-like object.
 * @param obj An array or an array-like object.
 * @param callback Function called for each item which returns if the item should be included. If omitted, truthy items will be included.
 * @returns An array containing items for which the callback returned a truthy value.
 */
export function grep<T extends readonly any[] | ArrayLike<any>>(obj: T, callback?: (this: T, v: Zeta.ArrayMember<T>, i: number) => any): Zeta.ArrayMember<T>[];

/**
 * Filters items from the given set.
 * @param obj A set object.
 * @param callback Function called for each item which returns if the item should be included. If omitted, truthy items will be included.
 * @returns An array containing items for which the callback returned a truthy value.
 */
export function grep<T>(obj: Set<T>, callback?: (this: Set<T>, v: T, i: number) => any): T[];

/**
 * Filters items from the given map.
 * @param obj A map object.
 * @param callback Function called for each item which returns if the item should be included. If omitted, truthy items will be included.
 * @returns An array containing items for which the callback returned a truthy value.
 */
export function grep<K, V>(obj: Map<K, V>, callback?: (this: Map<K, V>, v: V, i: K) => any): V[];

/**
 * Filters items from the key-value pairs returned by the given object.
 * @param obj A key-value pair provider object.
 * @param callback Function called for each item which returns if the item should be included. If omitted, truthy items will be included.
 * @returns An array containing values for which the callback returned a truthy value.
 */
export function grep<T extends HasEntries<any, any>>(obj: T, callback?: (this: T, v: EntryValue<T>, i: EntryKey<T>) => any): EntryValue<T>[];

/**
 * Filters nodes iterated from the node iterator.
 * Note that the iterator will be not reset after iteration.
 * @param obj A node iterator.
 * @param callback Function called for each node which returns if the node should be included. If omitted, truthy items will be included.
 * @returns An array containing nodes for which the callback returned a truthy value.
 */
export function grep<T extends NodeIterator<any>>(obj: T, callback?: (this: T, v: CollectionValueOf<T>, i: number) => any): CollectionValueOf<T>[];

/**
 * Filters data iterated from the iterator.
 * Note that the iterator will be not reset after iteration.
 * @param obj An iterator.
 * @param callback Function called for each data which returns if the node should be included. If omitted, truthy items will be included.
 * @returns An array containing nodes for which the callback returned a truthy value.
 */
export function grep<T extends Iterator<any>>(obj: T, callback?: (this: T, v: CollectionValueOf<T>, i: number) => any): CollectionValueOf<T>[];

/**
 * Filters values from the given object.
 * @param obj An object.
 * @param callback  Function called for each property which returns if the property value should be included. If omitted, truthy items will be included.
 * @returns An array containing property values for which the callback returned a truthy value.
 */
export function grep<T>(obj: T, callback?: (this: T, v: CollectionValueOf<T>, i: CollectionKeyOf<T>) => any): CollectionValueOf<T>[];

/**
 * Removes items that satifies a condition from an array and returns them as a new array.
 * @param arr An array object.
 * @param callback Function called for each item which returns if the item should be included.
 * @returns An array containing items for which the callback returned a truthy value.
 */
export function splice<T>(arr: T[], callback: (this: T[], v: T, i: number) => any): T[];

/**
 * Extracts the first item in the given array or array-like object that satifies a condition.
 * @param obj An array or an array-like object.
 * @param callback Function called for each original item which determines if the item satifies a condition. If omitted, item will be tested for truthiness.
 * @returns The first item that satisfy the condition; or false if there is none.
 */
export function any<T extends readonly any[] | ArrayLike<any>>(obj: T, callback?: (this: T, v: Zeta.ArrayMember<T>, i: number) => any): Zeta.ArrayMember<T> | false;

/**
 * Extracts the first item in the given set that satifies a condition.
 * @param obj A set object.
 * @param callback Function called for each original item which determines if the item satifies a condition. If omitted, item will be tested for truthiness.
 * @returns The first item that satisfy the condition; or false if there is none.
 */
export function any<T>(obj: Set<T>, callback?: (this: Set<T>, v: T, i: number) => any): T | false;

/**
 * Extracts the first item in the given map that satifies a condition.
 * @param obj A map object.
 * @param callback Function called for each original item which determines if the item satifies a condition. If omitted, item will be tested for truthiness.
 * @returns The first item that satisfy the condition; or false if there is none.
 */
export function any<K, V>(obj: Map<K, V>, callback?: (this: Map<K, V>, v: V, i: K) => any): V | false;

/**
 * Extracts the first value from the iterated key-value pairs that satifies a condition.
 * @param obj A key-value pair provider object.
 * @param callback Function called for each key-value pair which determines if the item satifies a condition. If omitted, value from the key-value pair will be tested for truthiness.
 * @returns The first value that satisfy the condition; or false if there is none.
 */
export function any<T extends HasEntries<any, any>>(obj: T, callback: (this: T, v: EntryValue<T>, i: EntryKey<T>) => any): EntryValue<T> | false;

/**
 * Extracts the first node iterated from the node iterator the that satifies a condition.
 * Note that the iterator will be not reset after iteration.
 * @param obj A node iterator.
 * @param callback Function called for each node which determines if the node satifies a condition. If omitted, the node will be tested for truthiness.
 * @returns The first node that satisfy the condition; or false if there is none.
 */
export function any<T extends NodeIterator<any>>(obj: T, callback: (this: T, v: CollectionValueOf<T>, i: number) => any): CollectionValueOf<T> | false;

/**
 * Extracts the first data iterated from the iterator the that satifies a condition.
 * Note that the iterator will be not reset after iteration.
 * @param obj An iterator.
 * @param callback Function called for each data which determines if the node satifies a condition. If omitted, the data will be tested for truthiness.
 * @returns The first data that satisfy the condition; or false if there is none.
 */
export function any<T extends Iterator<any>>(obj: T, callback: (this: T, v: CollectionValueOf<T>, i: number) => any): CollectionValueOf<T> | false;

/**
 * Extracts the first value in the properties of the given object that satifies a condition.
 * @param obj An object.
 * @param callback Function called for each original item which determines if the item satifies a condition. If omitted, item will be tested for truthiness.
 * @returns The first item that satisfy the condition; or false if there is none.
 */
export function any<T>(obj: T, callback?: (this: T, v: CollectionValueOf<T>, i: CollectionKeyOf<T>) => any): Zeta.ValueOf<T> | false;

/**
 * Iterates the given array or array-like object until a non-falsy value is returned by the given callback.
 * @param obj An array or an array-like object.
 * @param callback Function called for each original item which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<T extends readonly any[] | ArrayLike<any>, R>(obj: T, callback: (this: T, v: Zeta.ArrayMember<T>, i: number) => R): R | false;

/**
 * Iterates the given set until a non-falsy value is returned by the given callback.
 * @param obj A set object.
 * @param callback Function called for each original item which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<T, R>(obj: Set<T>, callback: (this: Set<T>, v: T, i: number) => R): R | false;

/**
 * Iterates the given map until a non-falsy value is returned by the given callback.
 * @param obj A map object.
 * @param callback Function called for each original item which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<K, V, R>(obj: Map<K, V>, callback: (this: Map<K, V>, v: V, i: K) => R): R | false;

/**
 * Iterates the key-value pairs until a non-falsy value is returned by the given callback.
 * @param obj A key-value pair provider object.
 * @param callback Function called for each key-value pair which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<T extends HasEntries<any, any>, R>(obj: T, callback: (this: T, v: EntryValue<T>, i: EntryKey<T>) => R): R | false;

/**
 * Iterates the node iterator until a non-falsy value is returned by the given callback.
 * Note that the iterator will be not reset after iteration.
 * @param obj A node iterator.
 * @param callback Function called for each key-value pair which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<T extends NodeIterator<any>, R>(obj: T, callback: (this: T, v: CollectionValueOf<T>, i: number) => R): R | false;

/**
 * Iterates the iterator until a non-falsy value is returned by the given callback.
 * Note that the iterator will be not reset after iteration.
 * @param obj An iterator.
 * @param callback Function called for each key-value pair which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<T extends Iterator<any>, R>(obj: T, callback: (this: T, v: CollectionValueOf<T>, i: number) => R): R | false;

/**
 * Iterates properties of the given object until a non-falsy value is returned by the given callback.
 * @param obj An object.
 * @param callback Function called for each original item which either returns a non-falsy value to stop iteration or a falsy value to continue.
 * @returns The non-falsy value returned by the last invocation of the given callback.
 */
export function single<T, R>(obj: T, callback: (this: T, v: CollectionValueOf<T>, i: CollectionKeyOf<T>) => R): R | false;

/**
 * Creates an object with a single property with the specified name and value.
 * @param key A string represent the property name.
 * @param value A value associated with the property name.
 * @returns An object with the specified property.
 */
export function kv<T extends string | number | symbol, V>(key: T, value: V): { [P in T]: V };

/**
 * Creates an object containing properties filled with the supplied value.
 * @param keys Names of properties to be set.
 * @param value Value to be set.
 */
export function fill<K extends string | number | symbol, V>(keys: K[], value: V): { [P in K]: V };

/**
 * Creates an object containing properties filled with the supplied value.
 * @param keys Names of properties to be set.
 * @param value Value to be set.
 */
export function fill<K extends string, V>(keys: K, value: V): { [P in Zeta.WhitespaceDelimited<K>]: V };

/**
 * Sets properties with the supplied value on an object.
 * @param obj An object of which properties will be set.
 * @param keys Names of properties to be set.
 * @param value Value to be set.
 */
export function fill<T extends any[], V>(obj: T, keys: number[], value: V): (Zeta.ValueOf<T> | V)[];

/**
 * Sets properties with the supplied value on an object.
 * @param obj An object of which properties will be set.
 * @param keys Names of properties to be set.
 * @param value Value to be set.
 */
export function fill<T extends object, K extends string | number | symbol, V>(obj: T, keys: K[], value: V): T & { [P in K]: V };

/**
 * Sets properties with the supplied value on an object.
 * @param obj An object of which properties will be set.
 * @param keys Names of properties to be set.
 * @param value Value to be set.
 */
export function fill<T extends object, K extends string, V>(obj: T, keys: K, value: V): T & { [P in Zeta.WhitespaceDelimited<K>]: V };

/**
 * Returns a new object that contains a subset of properties.
 * @param obj An object from which properties are copied.
 * @param keys Names of properties to be copied.
 */
export function pick<T, K extends readonly (keyof T)[]>(obj: T, keys: K): Pick<T, Zeta.ArrayMember<K>>;

export function pick<T>(obj: T, callback: (this: T, value: Zeta.ValueOf<T>, key: Zeta.KeyOf<T>) => any): Partial<T>;

/**
 * Returns a new object that does not contain the specified properties
 * @param obj An object from which properties are copied.
 * @param keys Names of properties to be excluded.
 */
export function exclude<T, K extends readonly (keyof T)[]>(obj: T, keys: K): Omit<T, Zeta.ArrayMember<K>>;

export function exclude<T>(obj: T, callback: (this: T, value: Zeta.ValueOf<T>, key: Zeta.KeyOf<T>) => any): Partial<T>;

/**
 * Returns a new object having properties from original object with values returned from the callback.
 * @param obj An object from which properties are enumerated.
 * @param callback A callback that returns value to be set on the new object for each property.
 */
export function mapObject<T, V>(obj: T, callback: (this: T, value: Zeta.ValueOf<T>, key: Zeta.KeyOf<T>) => V): { [P in Extract<Zeta.KeyOf<T>, string | number | symbol>]: V };

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
export function mapGet<K, V>(map: Map<K, V> | (K extends object ? WeakMap<K, V> : never), key: K, fn: new () => V): V;

/**
 * Gets item associated with the specified key in the given map, and create one if the key does not exist.
 * @param map A map or weak map object.
 * @param key A value or object as the key.
 * @param fn A constructor function, object of this type will be created if the key does not exist in the map.
 * @param passKey Pass the specified key to the constructor function.
 * @returns The item associated with the key.
 */
export function mapGet<K, V>(map: Map<K, V> | (K extends object ? WeakMap<K, V> : never), key: K, fn: new (key: K) => V, passKey: true): V;

/**
 * Gets item associated with the specified key in the given map, and create one if the key does not exist.
 * @param map A map or weak map object.
 * @param key A value or object as the key.
 * @param fn A function that returns the item to be stored in the map when called if the key does not exist in the map.
 * @returns The item associated with the key.
 */
export function mapGet<K, V>(map: Map<K, V> | (K extends object ? WeakMap<K, V> : never), key: K, fn: () => V): V;

/**
 * Gets item associated with the specified key in the given map, and create one if the key does not exist.
 * @param map A map or weak map object.
 * @param key A value or object as the key.
 * @param fn A function that returns the item to be stored in the map when called if the key does not exist in the map.
 * @param passKey Pass the specified key to the function.
 * @returns The item associated with the key.
 */
export function mapGet<K, V>(map: Map<K, V> | (K extends object ? WeakMap<K, V> : never), key: K, fn: (key: K) => V, passKey: true): V;

export function mapRemove<K, V>(map: Map<K, V> | (K extends object ? WeakMap<K, V> : never), key: K): V;

/**
 * Removes an item from an array. If the item appears more than one time, only the first entry is removed.
 * @param arr An array.
 * @param obj Object to remove.
 * @returns The object if the item was in the array; or undefined otherwise.
 */
export function arrRemove<T>(arr: T[], obj: T): T | undefined;

/**
 * Adds item to a set and returns whether the set is changed, i.e. the item is not in the set before.
 * @param set A set or weak set object.
 * @param obj An item to be added.
 */
export function setAdd<T extends Set<any> | WeakSet<any>>(set: T, obj: Zeta.ValueOf<T>): boolean;

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
 * Creates a callback that executes the given callback exactly once, and returns cached value in subsequent calls.
 * @param fn A callback.
 */
export function executeOnce<T extends Zeta.AnyFunction>(fn: T): T;

/**
 * Creates a data store to associate private data to objects, filling the use case of private variables.
 * @returns A function to access the private data store.
 */
export function createPrivateStore<K extends object = object, V = any>(): Zeta.PrivateStore<K, V>;

export function setImmediate<T extends Zeta.AnyFunction>(fn: T, ...args: Parameters<T>): void;

export function setImmediateOnce(fn: () => any): void;

export function setTimeoutOnce(fn: () => any, ms?: number): void;

export function clearImmediateOnce(fn: () => any): void;

/**
 * Equivalent to calling `window.setTimeout` except that a callback for cancelling timeout is returned.
 * @returns A callback that will cancel the timeout when invoked.
 */
export function setTimeout<T extends Zeta.AnyFunction>(callback: T, ms?: number, ...args: Parameters<T>): Zeta.UnregisterCallback;

/**
 * Equivalent to calling `window.setInterval` except that a callback for cancelling timed repeating action is returned.
 * @returns A callback that will cancel the timed, repeating action when invoked.
 */
export function setInterval<T extends Zeta.AnyFunction>(callback: T, ms?: number, ...args: Parameters<T>): Zeta.UnregisterCallback;

/**
 * Similar to {@link setInterval} but the next invocation of the action will not be scheduled until
 * the promise returned from callback is fulfilled or rejected.
 * This avoids simultaneous running of action in case the action took longer than the scheduled interval.
 * @returns A callback that will cancel the timed, repeating action when invoked.
 */
export function setIntervalSafe<T extends Zeta.AnyFunction>(callback: T, ms?: number, ...args: Parameters<T>): Zeta.UnregisterCallback;

/* --------------------------------------
 * Throw helper
 * -------------------------------------- */

export function throws(error: string | Error): never;

export function throwNotFunction<T>(obj: T): Zeta.IsAnyOrUnknown<T> extends true ? MaybeFunctionOrConstructor : Extract<T, Zeta.AnyFunction | Zeta.AnyConstructorOrClass>;

export function errorWithCode(code: string, message?: string, props?: Zeta.Dictionary<any>): Error;

export function isErrorWithCode(error: any, code: string): boolean;


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
export function matchWord<T extends string>(needle: string, haystack: T): Zeta.WhitespaceDelimited<T> | false;

/**
 * Extracts words contained in a whitespace-separated list of words.
 * @param needle A whitespace-separated list of words.
 * @param haystack A whitespace-separated list of words to match.
 * @returns A callback that returns the next appeared word; or `false` if there is no more matches.
 */
export function matchWordMulti<T extends string>(needle: string, haystack: T): () => Zeta.WhitespaceDelimited<T> | false;

/**
 * Decodes HTML character entities to its represented characters, such as `&lt;` to `<`.
 * @param input A string to be decoded.
 */
export function htmlDecode(input: string): string;


/* --------------------------------------
 * Promise related
 * -------------------------------------- */

/** @alias `Promise.resolve` */
export function resolve<T>(obj?: T): Promise<Awaited<T>>;

/** @alias `Promise.reject` */
export function reject(reason?: any): Promise<never>;

/**
 * Registers a callback to a promise object which is always fired whenever the promise object is fulfilled or rejeccted.
 * @param promise A promise object.
 * @param callback A callback function that receives the promise state and the fulfillment value or rejection reason.
 */
export function always<T, R>(promise: T, callback: (...args: [resolved: true, value: Awaited<T>] | [resolved: false, error: any]) => R): Promise<Awaited<R>>;

export function always<T, R>(promise: T, callback: (resolved: boolean) => R): Promise<Awaited<R>>;

/**
 * Creates a promise object that, waits until all promises are fulfilled or rejected,
 * and then resolves if all promises are fulfilled, or rejects if any one of them is rejected.
 * @param promises Promises to be waited.
 * @returns A promise object.
 */
export function resolveAll<T extends readonly unknown[] | []>(promises: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;

export function resolveAll<T extends readonly unknown[] | [], R>(promises: T, callback: (result: { -readonly [P in keyof T]: Awaited<T[P]> }) => R): Promise<Awaited<R>>;

export function resolveAll<T extends PromiseLike<any>>(promises: T): Promise<Awaited<T>>;

export function resolveAll<T extends PromiseLike<any>, R>(promises: T, callback: (result: Awaited<T>) => R): Promise<Awaited<R>>;

export function resolveAll<T extends object>(promises: T): Promise<{ -readonly [P in keyof T]: Awaited<T[P]> }>;

export function resolveAll<T extends object, R>(promises: T, callback: (result: { -readonly [P in keyof T]: Awaited<T[P]> }) => R): Promise<Awaited<R>>;

export function resolveAll<T>(promises: T): Promise<T>;

export function resolveAll<T, R>(promises: T, callback: (result: Awaited<T>) => R): Promise<Awaited<R>>;

/**
 * Wraps an asynchronous operation such that it can be retried again if the previous try has failed.
 * Only a single run is triggered at a time; and upon success, the result is cached and subsequent calls will have no effects.
 * @param fn A callback which performs asynchronous operation.
 */
export function retryable<T>(fn: () => PromiseLike<T>): () => Promise<Awaited<T>>;

export function retryable<T, R>(fn: () => PromiseLike<T>, callback: (result: Awaited<T>) => R): () => Promise<Awaited<R>>;

/**
 * Creates a promise of which fulfilment can be deferred awaiting additional promises after it is created.
 * Errors from rejected promises are ignored.
 * @param promises Optional promise objects to be initially awaited.
 */
export function deferrable(promises?: Promise<any> | Promise<any>[]): Promise<void> & Zeta.Deferrable;

export function catchAsync<T>(promise: T): Promise<Awaited<T> | undefined>;

/**
 * @deprecated Use {@link delay} instead.
 */
export function setPromiseTimeout<T>(promise: PromiseLike<T>, milliseconds: number, resolveWhenTimeout?: boolean): Promise<T>;

/**
 * Returns a promise to be fulfilled after a specific amount of time.
 * @param ms Number of milliseconds to delay.
 */
export function delay(ms: number): Promise<void>;

/**
 * Executes the callback after a specific amount of time, and fulfills the promise with the result.
 * @param ms Number of milliseconds to delay.
 * @param callback Callback to be invoked after specific amount of time.
 */
export function delay<T>(ms: number, callback: () => T): Promise<Awaited<T>>;

export function makeAsync<T extends Zeta.AnyFunction>(callback: T): (...args: Parameters<T>) => Promise<Awaited<ReturnType<T>>>;


/* --------------------------------------
 * Property and prototype
 * -------------------------------------- */

/** @alias `Object.keys` */
export function keys(obj: object): string[];

/** @alias `Object.values` */
export function values(obj: object): any[];

/** @alias `Object.freeze` */
export function freeze<T extends object>(obj: T): Readonly<T>;

export function hasOwnProperty(obj: object, prop: string): boolean;

/** @alias `Object.getOwnPropertyDescriptors` */
export function getOwnPropertyDescriptors(obj: object): PropertyDescriptorMap;

/**
 * Defines properties on an object.
 * Properties with function as values will be defined as non-enumerable.
 * @param o An object which the properties will be defined on.
 * @param p
 */
export function define<T extends object, U extends Zeta.Dictionary<number | string | boolean | object | null | Zeta.AnyFunction>>(o: T, p: Zeta.AdditionalMembers<T, U>): void;

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
export function definePrototype<T extends Function, U extends Function, V extends Zeta.Dictionary<number | string | boolean | undefined | null | Zeta.AnyFunction>>(fn: T, parentClass: U, proto?: Zeta.AdditionalMembers<InstanceTypeOrObject<T> & InstanceTypeOrObject<U>, V>): void;

/**
 * Define properties on the prototype object of a function.
 * @param fn A function which its prototype object will have specified properties defined.
 * @param proto An object containing values, getters, setters or methods which will be defined on the prototype object.
 */
export function definePrototype<T extends Function, U extends Zeta.Dictionary<number | string | boolean | undefined | null | Zeta.AnyFunction>>(fn: T, proto: Zeta.AdditionalMembers<InstanceTypeOrObject<T>, U>): void;

/**
 * Creates an object which its prototype is set to the given function's prototype object.
 * @param proto A function with prototype object or an object as the prototype object.
 * @returns A new empty object with the specified prototype.
 */
export function inherit<T extends Function>(proto: T, props?: object): InstanceTypeOrObject<T>;

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
 * Makes an object observable.
 *
 * This must be called in advanced of any other methods such as
 * `watch`, `watchOnce`, `defineAliasProperty`, `defineObservableProperty`
 * which automatically turns an object observable.
 *
 * @param obj An object to observe.
 * @param sync Whether handlers called synchronously immediately after a property is changed.
 * @returns A function which when called with a callback, the hooked listeners are not called until the given callback returns.
 * This is primarily for making updates to multiple properties singleton.
 */
export function watch(obj: object, sync: boolean): ((callback: () => any) => void);

/**
 * Hooks a listener callback which will be fired when any observed property has been changed.
 * @param obj An object to observe.
 * @param handler A callback which receives changed values.
 */
export function watch<T extends object>(obj: T, handler: (e: Zeta.PropertyChangeRecord<T>) => any): Zeta.UnregisterCallback;

/**
 * Watches a property on the object.
 * @param obj An object to observe.
 * @param prop Property name.
 * @param handler Callback to be fired and the property is changed.
 * @param fireInit Optionally fire the handler immediately.
 */
export function watch<T extends object, P extends Zeta.HintedKeyOf<T>>(obj: T, prop: P, handler?: Zeta.PropertyChangeHandler<T, P, void>, fireInit?: boolean): Zeta.UnregisterCallback;

/**
 * Watches a property and resolves when the property is changed.
 * @param obj An object to observe.
 * @param prop Property name.
 */
export function watchOnce<T extends object, P extends Zeta.HintedKeyOf<T>>(obj: T, prop: P): Promise<Zeta.PropertyTypeOrAny<T, P>>;

/**
 * Watches a property and resolves when the property is changed.
 * @param obj An object to observe.
 * @param prop Property name.
 * @param handler Callback to be fired when the property is changed.
 * @returns A promise that resolves with the returned value from handler callback.
 */
export function watchOnce<T extends object, P extends Zeta.HintedKeyOf<T>, U>(obj: T, prop: P, handler: Zeta.PropertyChangeHandler<T, P, U | Promise<U>>): Promise<U>;

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
export function defineAliasProperty<T extends object, U extends object>(obj: T, prop: Zeta.HintedKeyOf<T>, target: U, targetProp?: Zeta.HintedKeyOf<U>): void;

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
