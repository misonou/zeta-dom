import { expectTypeOf } from "expect-type";
import { always, any, arrRemove, catchAsync, combineFn, deepFreeze, deferrable, defineAliasProperty, defineObservableProperty, delay, each, equal, exclude, executeOnce, extend, fill, grep, is, isArray, isArrayLike, isFunction, isThenable, makeArray, makeAsync, map, mapGet, mapObject, mapRemove, matchWord, matchWordMulti, pick, resolve, resolveAll, retryable, setAdd, setPromiseTimeout, single, throwNotFunction, watch, watchOnce, watchable } from "../src/util";

// -------------------------------------
// helper declarations

type Fn = (v: number) => void;

type A = { __a: number; };
type B = { __b: number; };
type C = { a: A; b: B; };
type D = { entries(): Iterator<[string, A]>; };
type E = { readonly length: number;[T: number]: A; };

class K { }
class L { constructor(_: A) { } }
abstract class M { }

const _: unknown = {};

// -------------------------------------
// types.d.ts

expectTypeOf<Zeta.IsAny<any>>().toEqualTypeOf(true);
expectTypeOf<Zeta.IsAny<unknown>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAny<never>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAny<number>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAny<object>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAny<A>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAny<any[]>>().toEqualTypeOf(false);

expectTypeOf<Zeta.IsAnyOrUnknown<any>>().toEqualTypeOf(true);
expectTypeOf<Zeta.IsAnyOrUnknown<unknown>>().toEqualTypeOf(true);
expectTypeOf<Zeta.IsAnyOrUnknown<never>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAnyOrUnknown<number>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAnyOrUnknown<object>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAnyOrUnknown<A>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAnyOrUnknown<any[]>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsAnyOrUnknown<unknown[]>>().toEqualTypeOf(false);

expectTypeOf<Zeta.IsUnknown<any>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsUnknown<unknown>>().toEqualTypeOf(true);
expectTypeOf<Zeta.IsUnknown<never>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsUnknown<number>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsUnknown<object>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsUnknown<A>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsUnknown<unknown[]>>().toEqualTypeOf(false);

expectTypeOf<Zeta.IsNever<any>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsNever<unknown>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsNever<never>>().toEqualTypeOf(true);
expectTypeOf<Zeta.IsNever<number>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsNever<object>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsNever<A>>().toEqualTypeOf(false);
expectTypeOf<Zeta.IsNever<never[]>>().toEqualTypeOf(false);

expectTypeOf(new (<Zeta.AnyConstructor>_)).toBeAny();

// -------------------------------------
// util.d.ts

expectTypeOf(is(_, K)).toEqualTypeOf<K | false>();

expectTypeOf(isArray(_)).toEqualTypeOf<any[] | false>();
expectTypeOf(isArray(<any>_)).toEqualTypeOf<any[] | false>();
expectTypeOf(isArray(<A[]>_)).toEqualTypeOf<A[]>();
expectTypeOf(isArray(<A[] | undefined>_)).toEqualTypeOf<A[] | false>();
expectTypeOf(isArray(<A[] | A>_)).toEqualTypeOf<A[] | false>();

expectTypeOf(isFunction(_)).toMatchTypeOf<Zeta.AnyFunction | Zeta.AnyConstructor | false>();
expectTypeOf(isFunction(<any>_)).toMatchTypeOf<Zeta.AnyFunction | Zeta.AnyConstructor | false>();
expectTypeOf(isFunction(<Fn | undefined>_)).toEqualTypeOf<Fn | false>();
expectTypeOf(isFunction(<typeof K | undefined>_)).toEqualTypeOf<typeof K | false>();
expectTypeOf(isFunction(<typeof M | undefined>_)).toEqualTypeOf<typeof M | false>();

expectTypeOf(isThenable(_)).toEqualTypeOf<PromiseLike<any> | false>();
expectTypeOf(isThenable(<any>_)).toEqualTypeOf<PromiseLike<any> | false>();
expectTypeOf(isThenable(resolve(1))).toEqualTypeOf<Promise<number>>();
expectTypeOf(isThenable(<Promise<number> | undefined>_)).toEqualTypeOf<Promise<number> | false>();

expectTypeOf(isArrayLike(_)).toEqualTypeOf<ArrayLike<any> | false>();
expectTypeOf(isArrayLike(<any>_)).toEqualTypeOf<ArrayLike<any> | false>();
expectTypeOf(isArrayLike(<A[] | A>_)).toEqualTypeOf<A[] | false>();

expectTypeOf(makeArray([])).toEqualTypeOf<never[]>();
expectTypeOf(makeArray(undefined)).toEqualTypeOf<never[]>();
expectTypeOf(makeArray(null)).toEqualTypeOf<never[]>();
expectTypeOf(makeArray(1)).toEqualTypeOf<number[]>();
expectTypeOf(makeArray([1])).toEqualTypeOf<number[]>();
expectTypeOf(makeArray(<any[]>_)).toEqualTypeOf<any[]>();
expectTypeOf(makeArray(<E>_)).toEqualTypeOf<A[]>();

expectTypeOf(extend(<A>_)).toEqualTypeOf<A>();
expectTypeOf(extend(<A>_, <B>_)).toEqualTypeOf<A & B>();
expectTypeOf(extend(<A>_, <B>_, <C>_)).toEqualTypeOf<A & B & C>();
expectTypeOf(extend(<A>_, <B>_, undefined)).toEqualTypeOf<A & B>();
expectTypeOf(extend(<A>_, <B>_, null)).toEqualTypeOf<A & B>();
expectTypeOf(extend(<A>_, <B>_, true)).toEqualTypeOf<A & B>();
expectTypeOf(extend(<A>_, <B>_, 1)).toEqualTypeOf<A & B>();
expectTypeOf(extend(<A>_, <B>_, '')).toEqualTypeOf<A & B>();

expectTypeOf(each('a b', (_1: number, _2: 'a' | 'b') => _)).toBeVoid();
expectTypeOf(each(<C>_, (_1: keyof C, _2: A | B) => _)).toBeVoid();
expectTypeOf(each([0, 'a'], (_1: number, _2: number | string) => _)).toBeVoid();
expectTypeOf(each(<Map<A, B>>_, (_1: A, _2: B) => _)).toBeVoid();
expectTypeOf(each(<Set<A>>_, (_1: number, _2: A) => _)).toBeVoid();
expectTypeOf(each(<NodeIterator>_, (_1: number, _2: Node) => _)).toBeVoid();
expectTypeOf(each(<Iterator<A>>_, (_1: number, _2: A) => _)).toBeVoid();
expectTypeOf(each(<D>_, (_1: string, _2: A) => _)).toBeVoid();
expectTypeOf(each(<object>_, (_1: number | string, _2: any) => _)).toBeVoid();
expectTypeOf(each(<Zeta.Dictionary>_, (_1: string, _2: any) => _)).toBeVoid();

expectTypeOf(map(<C>_, (_1: A | B, _2: keyof C) => [1, 2, 3])).toMatchTypeOf<number[]>();
expectTypeOf(map(<C>_, (_1: A | B, _2: keyof C) => _1 ? 1 : undefined)).toMatchTypeOf<number[]>();
expectTypeOf(map(<C>_, (_1: A | B, _2: keyof C) => _1 ? 1 : null)).toMatchTypeOf<number[]>();
expectTypeOf(map([0, 'a'], (_1: number | string, _2: number) => [1, 2, 3])).toMatchTypeOf<number[]>();
expectTypeOf(map([0, 'a'], (_1: number | string, _2: number) => _1 ? 1 : undefined)).toMatchTypeOf<number[]>();
expectTypeOf(map([0, 'a'], (_1: number | string, _2: number) => _1 ? 1 : null)).toMatchTypeOf<number[]>();
expectTypeOf(map(<Map<A, B>>_, (_1: B, _2: A) => [1, 2, 3])).toMatchTypeOf<number[]>();
expectTypeOf(map(<Map<A, B>>_, (_1: B, _2: A) => _1 ? 1 : undefined)).toMatchTypeOf<number[]>();
expectTypeOf(map(<Map<A, B>>_, (_1: B, _2: A) => _1 ? 1 : null)).toMatchTypeOf<number[]>();
expectTypeOf(map(<Set<A>>_, (_1: A, _2: number) => [1, 2, 3])).toMatchTypeOf<number[]>();
expectTypeOf(map(<Set<A>>_, (_1: A, _2: number) => _1 ? 1 : undefined)).toMatchTypeOf<number[]>();
expectTypeOf(map(<Set<A>>_, (_1: A, _2: number) => _1 ? 1 : null)).toMatchTypeOf<number[]>();
expectTypeOf(map(<NodeIterator>_, (_1: Node, _2: number) => [1, 2, 3])).toMatchTypeOf<number[]>();
expectTypeOf(map(<NodeIterator>_, (_1: Node, _2: number) => _1 ? 1 : undefined)).toMatchTypeOf<number[]>();
expectTypeOf(map(<NodeIterator>_, (_1: Node, _2: number) => _1 ? 1 : null)).toMatchTypeOf<number[]>();
expectTypeOf(map(<Iterator<A>>_, (_1: A, _2: number) => [1, 2, 3])).toMatchTypeOf<number[]>();
expectTypeOf(map(<Iterator<A>>_, (_1: A, _2: number) => _1 ? 1 : undefined)).toMatchTypeOf<number[]>();
expectTypeOf(map(<Iterator<A>>_, (_1: A, _2: number) => _1 ? 1 : null)).toMatchTypeOf<number[]>();
expectTypeOf(map(<D>_, (_1: A, _2: string) => [1, 2, 3])).toMatchTypeOf<number[]>();
expectTypeOf(map(<D>_, (_1: A, _2: string) => _1 ? 1 : undefined)).toMatchTypeOf<number[]>();
expectTypeOf(map(<D>_, (_1: A, _2: string) => _1 ? 1 : null)).toMatchTypeOf<number[]>();

expectTypeOf(grep(<C>_, (_1: A | B, _2: keyof C) => _)).toEqualTypeOf<Array<A | B>>();
expectTypeOf(grep([0, 'a'], (_1: number | string, _2: number) => _)).toEqualTypeOf<Array<number | string>>();
expectTypeOf(grep(<Map<A, B>>_, (_1: B, _2: A) => _)).toEqualTypeOf<B[]>();
expectTypeOf(grep(<Set<A>>_, (_1: A, _2: number) => _)).toEqualTypeOf<A[]>();
expectTypeOf(grep(<NodeIterator>_, (_1: Node, _2: number) => _)).toEqualTypeOf<Node[]>();
expectTypeOf(grep(<Iterator<A>>_, (_1: A, _2: number) => _)).toEqualTypeOf<A[]>();
expectTypeOf(grep(<D>_, (_1: A, _2: string) => _)).toEqualTypeOf<A[]>();

expectTypeOf(any(<C>_, (_1: A | B, _2: keyof C) => <C>_)).toEqualTypeOf<A | B | false>();
expectTypeOf(any([0, 'a'], (_1: number | string, _2: number) => <C>_)).toEqualTypeOf<number | string | false>();
expectTypeOf(any(<Map<A, B>>_, (_1: B, _2: A) => <C>_)).toEqualTypeOf<B | false>();
expectTypeOf(any(<Set<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<A | false>();
expectTypeOf(any(<NodeIterator>_, (_1: Node, _2: number) => <C>_)).toEqualTypeOf<Node | false>();
expectTypeOf(any(<Iterator<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<A | false>();
expectTypeOf(any(<D>_, (_1: A, _2: string) => <C>_)).toEqualTypeOf<A | false>();
expectTypeOf(any(<object>_, (_1: any, _2: string | number) => _)).toBeAny();
expectTypeOf(any(<Zeta.Dictionary>_, (_1: any, _2: string) => _)).toBeAny();

expectTypeOf(single(<C>_, (_1: A | B, _2: keyof C) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single([0, 'a'], (_1: number | string, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<Map<A, B>>_, (_1: B, _2: A) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<Set<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<NodeIterator>_, (_1: Node, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<Iterator<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<D>_, (_1: A, _2: string) => <C>_)).toEqualTypeOf<C | false>();

expectTypeOf(fill(['a', 'b'], 1)).toMatchTypeOf<{ a: number, b: number }>();
expectTypeOf(fill('a b', 1)).toMatchTypeOf<{ a: number, b: number }>();
expectTypeOf(fill({ c: '' }, ['a', 'b'], 1)).toMatchTypeOf<{ c: string, a: number, b: number }>();
expectTypeOf(fill({ c: '' }, 'a b', 1)).toMatchTypeOf<{ c: string, a: number, b: number }>();

expectTypeOf(pick(<C>_, ['a'])).toEqualTypeOf<{ a: A }>();
expectTypeOf(pick(<C>_, (_1: A | B, _2: keyof C) => _)).toEqualTypeOf<Partial<C>>();

expectTypeOf(exclude(<C>_, ['a'])).toEqualTypeOf<{ b: B }>();
expectTypeOf(exclude(<C>_, (_1: A | B, _2: keyof C) => _)).toEqualTypeOf<Partial<C>>();

expectTypeOf(mapObject(<C>_, (_1: A | B, _2: keyof C) => 1)).toEqualTypeOf<{ a: number, b: number }>();

expectTypeOf(mapGet(<Map<A, B>>_, <A>_)).toEqualTypeOf<B>(); // should be B | undefined
expectTypeOf(mapGet(<Map<A, B>>_, <A>_, () => (<B>_))).toEqualTypeOf<B>();
expectTypeOf(mapGet(<Map<A, K>>_, <A>_, K)).toEqualTypeOf<K>();
expectTypeOf(mapGet(<Map<A, L>>_, <A>_, L, true)).toEqualTypeOf<L>();
expectTypeOf(mapGet(<WeakMap<A, B>>_, <A>_)).toEqualTypeOf<B>(); // should be B | undefined
expectTypeOf(mapGet(<WeakMap<A, B>>_, <A>_, () => (<B>_))).toEqualTypeOf<B>();
expectTypeOf(mapGet(<WeakMap<A, K>>_, <A>_, K)).toEqualTypeOf<K>();
expectTypeOf(mapGet(<WeakMap<A, L>>_, <A>_, L, true)).toEqualTypeOf<L>();

expectTypeOf(mapRemove(<Map<A, B>>_, <A>_)).toEqualTypeOf<B>(); // should be B | undefined

expectTypeOf(arrRemove([1, 2, 3], 1)).toEqualTypeOf<number | undefined>();

expectTypeOf(setAdd(<Set<A>>_, <A>_)).toBeBoolean();
expectTypeOf(setAdd(<WeakSet<A>>_, <A>_)).toBeBoolean()

expectTypeOf(equal(<Map<A, B>>_, <Map<A, B>>_)).toBeBoolean();
expectTypeOf(equal(<Map<A, B>>_, <object>_)).toBeBoolean();
expectTypeOf(equal(_, _)).toBeBoolean();

expectTypeOf(combineFn([<Fn>_, <Fn>_])).toEqualTypeOf<Fn>();
expectTypeOf(combineFn([<Fn>_, <Fn>_] as const)).toEqualTypeOf<Fn>();
expectTypeOf(combineFn(<Fn>_, <Fn>_)).toEqualTypeOf<Fn>();

expectTypeOf(executeOnce(<Fn>_)).toEqualTypeOf<Fn>();

expectTypeOf(throwNotFunction(_)).toMatchTypeOf<Zeta.AnyFunction | Zeta.AnyConstructor>();
expectTypeOf(throwNotFunction(<any>_)).toMatchTypeOf<Zeta.AnyFunction | Zeta.AnyConstructor>();
expectTypeOf(throwNotFunction(<Fn | undefined>_)).toEqualTypeOf<Fn>();
expectTypeOf(throwNotFunction(<typeof K | undefined>_)).toEqualTypeOf<typeof K>();
expectTypeOf(throwNotFunction(<typeof M | undefined>_)).toEqualTypeOf<typeof M>();
expectTypeOf(throwNotFunction(<any>_)()).toBeAny();
expectTypeOf(new (throwNotFunction(<any>_))()).toBeAny();

expectTypeOf(matchWord('', 'a b c')).toEqualTypeOf<'a' | 'b' | 'c' | false>();

expectTypeOf(matchWordMulti('', 'a b c')).toEqualTypeOf<() => 'a' | 'b' | 'c' | false>();

// always - basic
expectTypeOf(always(resolve(1), (_1: boolean, _2: any) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(always(resolve(1), (_1: boolean, _2: any) => resolve(''))).toEqualTypeOf<Promise<string>>();

// always - result inference
expectTypeOf(always(resolve(1), () => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(always(resolve(1), (_1) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(always(resolve(1), (_1, _2) => _1 ? _2 : '')).toEqualTypeOf<Promise<number | ''>>();

// resolveAll - no callback
expectTypeOf(resolveAll([resolve(1), 2])).toEqualTypeOf<Promise<[number, number]>>();
expectTypeOf(resolveAll([resolve(1), 2] as const)).toEqualTypeOf<Promise<[number, 2]>>();
expectTypeOf(resolveAll({ a: resolve(1), b: 2 })).toEqualTypeOf<Promise<{ a: number, b: number }>>();
expectTypeOf(resolveAll({ a: resolve(1), b: 2 } as const)).toEqualTypeOf<Promise<{ a: number, b: 2 }>>();
expectTypeOf(resolveAll(resolve(1))).toEqualTypeOf<Promise<number>>();
expectTypeOf(resolveAll(undefined)).toEqualTypeOf<Promise<undefined>>();
expectTypeOf(resolveAll(null)).toEqualTypeOf<Promise<null>>();
expectTypeOf(resolveAll(1)).toEqualTypeOf<Promise<number>>();

// resolveAll - callback with non-promise return
expectTypeOf(resolveAll([resolve(1), 2], (_1: [number, number]) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll([resolve(1), 2] as const, (_1: [number, number]) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll({ a: resolve(1), b: 2 }, (_1: { a: number, b: number }) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll({ a: resolve(1), b: 2 } as const, (_1: { a: number, b: number }) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll(resolve(1), (_1: number) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll(undefined, (_1: undefined) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll(null, (_1: null) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll(1, (_1: number) => '')).toEqualTypeOf<Promise<string>>();

// resolveAll - callback with promise return
expectTypeOf(resolveAll([resolve(1), 2], (_1: [number, number]) => resolve(''))).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll([resolve(1), 2] as const, (_1: [number, number]) => resolve(''))).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll({ a: resolve(1), b: 2 }, (_1: { a: number, b: number }) => resolve(''))).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll({ a: resolve(1), b: 2 } as const, (_1: { a: number, b: number }) => resolve(''))).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll(resolve(1), (_1: number) => resolve(''))).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll(undefined, (_1: undefined) => resolve(''))).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll(null, (_1: null) => resolve(''))).toEqualTypeOf<Promise<string>>();
expectTypeOf(resolveAll(1, (_1: number) => resolve(''))).toEqualTypeOf<Promise<string>>();

expectTypeOf(retryable(async () => 1)).toEqualTypeOf<() => Promise<number>>();
expectTypeOf(retryable(async () => resolve(1))).toEqualTypeOf<() => Promise<number>>();

expectTypeOf(deferrable()).toEqualTypeOf<Promise<void> & Zeta.Deferrable>();
expectTypeOf(deferrable(resolve(1))).toEqualTypeOf<Promise<void> & Zeta.Deferrable>();
expectTypeOf(deferrable([resolve(1)])).toEqualTypeOf<Promise<void> & Zeta.Deferrable>();

expectTypeOf(deferrable().waitFor()).toEqualTypeOf<boolean>();
expectTypeOf(deferrable().waitFor(resolve(1))).toEqualTypeOf<boolean>();
expectTypeOf(deferrable().waitFor(resolve(1), resolve(1))).toEqualTypeOf<boolean>();

expectTypeOf(catchAsync(<A>_)).toEqualTypeOf<Promise<A | undefined>>();
expectTypeOf(catchAsync(resolve(<A>_))).toEqualTypeOf<Promise<A | undefined>>();

expectTypeOf(setPromiseTimeout(resolve(1), 0)).toEqualTypeOf<Promise<number>>();
expectTypeOf(setPromiseTimeout(resolve(1), 0, true)).toEqualTypeOf<Promise<number>>();
expectTypeOf(setPromiseTimeout(resolve(1), 0, false)).toEqualTypeOf<Promise<number>>();

expectTypeOf(delay(0)).toEqualTypeOf<Promise<void>>();
expectTypeOf(delay(0, () => 1)).toEqualTypeOf<Promise<number>>();
expectTypeOf(delay(0, () => resolve(1))).toEqualTypeOf<Promise<number>>();

expectTypeOf(makeAsync(() => 1)).toEqualTypeOf<() => Promise<number>>();
expectTypeOf(makeAsync(() => resolve(1))).toEqualTypeOf<() => Promise<number>>();

expectTypeOf(deepFreeze(1)).toEqualTypeOf<number>();
expectTypeOf(deepFreeze(<C>_)).toEqualTypeOf<{ readonly a: Readonly<A>; readonly b: Readonly<B> }>();

expectTypeOf(watch(<C>_, true)).toBeFunction();
expectTypeOf(watch(<C>_, false)).toBeFunction();
expectTypeOf(watch(<C>_, (_1: { oldValues: Partial<C>, newValues: Partial<C> }) => _)).toEqualTypeOf<Zeta.UnregisterCallback>();
expectTypeOf(watch(<C>_, 'a', (_1: A, _2: A, _3: string, _4: C) => _)).toEqualTypeOf<Zeta.UnregisterCallback>();
expectTypeOf(watch(<C>_, 'c', (_1: any, _2: any, _3: string, _4: C) => _)).toEqualTypeOf<Zeta.UnregisterCallback>();

expectTypeOf(watch(<C>_, true)(() => { })).toEqualTypeOf<void>();
expectTypeOf(watch(<C>_, true)(() => 0)).toEqualTypeOf<number>();

expectTypeOf(watchOnce(<C>_, 'a')).toEqualTypeOf<Promise<A>>();
expectTypeOf(watchOnce(<C>_, 'c')).toEqualTypeOf<Promise<any>>();
expectTypeOf(watchOnce(<C>_, 'a', (_1: A, _2: A, _3: string, _4: C) => '')).toEqualTypeOf<Promise<string>>();
expectTypeOf(watchOnce(<C>_, 'a', (_1: A, _2: A, _3: string, _4: C) => resolve(''))).toEqualTypeOf<Promise<string>>();

expectTypeOf(watchable()).toEqualTypeOf<Zeta.Watchable<any>>();
expectTypeOf(watchable(<C>_)).toEqualTypeOf<Zeta.WatchableInstance<C>>();

expectTypeOf((<Zeta.Watchable>_).watch('a', (_1: any, _2: any, _3: string, _4: any) => { })).toEqualTypeOf<Zeta.UnregisterCallback>();
expectTypeOf((<Zeta.Watchable & C>_).watch('a', (_1: A, _2: A, _3: string, _4: C) => { })).toEqualTypeOf<Zeta.UnregisterCallback>();
expectTypeOf((<Zeta.Watchable<C>>_).watch('a', (_1: A, _2: A, _3: string, _4: C) => { })).toEqualTypeOf<Zeta.UnregisterCallback>();
expectTypeOf((<Zeta.Watchable<C>>_).watch('c', (_1: any, _2: any, _3: string, _4: C) => { })).toEqualTypeOf<Zeta.UnregisterCallback>();
expectTypeOf((<Zeta.Watchable<{}, 'a'>>_).watch('a', (_1: any, _2: any, _3: string, _4: {}) => { })).toEqualTypeOf<Zeta.UnregisterCallback>();

expectTypeOf((<Zeta.Watchable & C>_).watch((_: { oldValues: Partial<C>, newValues: Partial<C> }) => { })).toEqualTypeOf<Zeta.UnregisterCallback>();
expectTypeOf((<Zeta.Watchable<C>>_).watch((_: { oldValues: Partial<C>, newValues: Partial<C> }) => { })).toEqualTypeOf<Zeta.UnregisterCallback>();

// defineAliasProperty - basic
expectTypeOf(defineAliasProperty(<C>_, 'a', <D>_)).toBeVoid();
expectTypeOf(defineAliasProperty(<C>_, 'a', <D>_, 'b')).toBeVoid();

// defineAliasProperty - unknown property
expectTypeOf(defineAliasProperty(<C>_, 'c', <D>_)).toBeVoid();
expectTypeOf(defineAliasProperty(<C>_, 'c', <D>_, 'b')).toBeVoid();

// defineObservableProperty - basic
expectTypeOf(defineObservableProperty(<C>_, 'a')).toEqualTypeOf<(value: A) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'a', <A>_, true)).toEqualTypeOf<(value: A) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'a', <A>_, (_1: A, _2: A) => _1)).toEqualTypeOf<(value: A) => void>();

// defineObservableProperty - unknown property
expectTypeOf(defineObservableProperty(<C>_, 'c')).toEqualTypeOf<(value: unknown) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'c', 1)).toEqualTypeOf<(value: number) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'c', 1, true)).toEqualTypeOf<(value: number) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'c', 1, (_1: number, _2: number) => _1)).toEqualTypeOf<(value: number) => void>();
