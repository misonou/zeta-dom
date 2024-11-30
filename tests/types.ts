import { expectTypeOf } from "expect-type";
import { always, any, arrRemove, catchAsync, combineFn, deepFreeze, deferrable, defineAliasProperty, defineObservableProperty, delay, each, equal, exclude, executeOnce, extend, fill, grep, is, isArray, isArrayLike, isFunction, isThenable, makeArray, makeAsync, map, mapGet, mapObject, mapRemove, matchWord, matchWordMulti, pick, resolve, resolveAll, retryable, setAdd, setPromiseTimeout, single, throwNotFunction, watch, watchOnce, watchable } from "../src/util";
import dom from "../src/dom";
import { bind } from "../src/domUtil";

// -------------------------------------
// helper declarations

type Fn = (v: number) => void;

type A = { __a: number; };
type B = { __b: number; };
type C = { a: A; b: B; };
type D = { element: HTMLElement };
type E = { element: HTMLElement } & Zeta.ZetaDelegatedEventTarget<HTMLElement>;

type HasEntries<T> = { entries(): Iterator<[string, T]>; };
type HasForEach<T> = { forEach(callback: (v: T, i: number) => void): void }

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

expectTypeOf(isArrayLike(_)).toEqualTypeOf<boolean>();
expectTypeOf(isArrayLike(<any>_)).toEqualTypeOf<boolean>();
expectTypeOf(isArrayLike(<A[] | A>_)).toEqualTypeOf<boolean>();

expectTypeOf(makeArray([])).toEqualTypeOf<never[]>();
expectTypeOf(makeArray(undefined)).toEqualTypeOf<never[]>();
expectTypeOf(makeArray(null)).toEqualTypeOf<never[]>();
expectTypeOf(makeArray(1)).toEqualTypeOf<number[]>();
expectTypeOf(makeArray([1])).toEqualTypeOf<number[]>();
expectTypeOf(makeArray(<any[]>_)).toEqualTypeOf<any[]>();
expectTypeOf(makeArray(<Map<string, A>>_)).toEqualTypeOf<A[]>();
expectTypeOf(makeArray(<Set<A>>_)).toEqualTypeOf<A[]>();
expectTypeOf(makeArray(<ArrayLike<A>>_)).toEqualTypeOf<A[]>();
expectTypeOf(makeArray(<HasForEach<A>>_)).toEqualTypeOf<A[]>();

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
expectTypeOf(each(<readonly string[]>_, (_1: number, _2: string) => _)).toBeVoid();
expectTypeOf(each(<string[]>_, (_1: number, _2: string) => _)).toBeVoid();
expectTypeOf(each([0, 'a'], (_1: number, _2: number | string) => _)).toBeVoid();
expectTypeOf(each(<Map<A, B>>_, (_1: A, _2: B) => _)).toBeVoid();
expectTypeOf(each(<Set<A>>_, (_1: number, _2: A) => _)).toBeVoid();
expectTypeOf(each(<NodeIterator>_, (_1: number, _2: Node) => _)).toBeVoid();
expectTypeOf(each(<Iterator<A>>_, (_1: number, _2: A) => _)).toBeVoid();
expectTypeOf(each(<HasEntries<A>>_, (_1: string, _2: A) => _)).toBeVoid();
expectTypeOf(each(<HasForEach<A>>_, (_1: number, _2: A) => _)).toBeVoid();
expectTypeOf(each(<Zeta.Dictionary<A>>_, (_1: string, _2: A) => _)).toBeVoid();
expectTypeOf(each(<any>_, (_1: any, _2: any) => _)).toBeVoid();
expectTypeOf(each(<unknown>_, (_1: any, _2: any) => _)).toBeVoid();

each(<any>_, (i, v) => {
    expectTypeOf(i).toBeAny();
    expectTypeOf(v).toBeAny();
});
each(<unknown>_, (i, v) => {
    expectTypeOf(i).toBeAny();
    expectTypeOf(v).toBeAny();
});

expectTypeOf(map(<any>_, () => <number>_)).toMatchTypeOf<number[]>();
expectTypeOf(map(<any>_, () => <number[]>_)).toMatchTypeOf<number[]>();
expectTypeOf(map(<any>_, () => <number | number[]>_)).toMatchTypeOf<number[]>();
expectTypeOf(map(<any>_, () => <number | undefined>_)).toMatchTypeOf<number[]>();
expectTypeOf(map(<any>_, () => <number | null>_)).toMatchTypeOf<number[]>();

expectTypeOf(map(<C>_, (_1: A | B, _2: keyof C) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<readonly string[]>_, (_1: string, _2: number) => <C>_)).toEqualTypeOf<C[]>();
expectTypeOf(map(<string[]>_, (_1: string, _2: number) => <C>_)).toEqualTypeOf<C[]>();
expectTypeOf(map([0, 'a'], (_1: number | string, _2: number) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<Map<A, B>>_, (_1: B, _2: A) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<Set<A>>_, (_1: A, _2: number) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<NodeIterator>_, (_1: Node, _2: number) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<Iterator<A>>_, (_1: A, _2: number) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<HasEntries<A>>_, (_1: A, _2: string) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<HasForEach<A>>_, (_1: A, _2: number) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<Zeta.Dictionary<A>>_, (_1: A, _2: string) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<any>_, (_1: any, _2: any) => <C>_)).toMatchTypeOf<C[]>();
expectTypeOf(map(<unknown>_, (_1: any, _2: any) => <C>_)).toMatchTypeOf<C[]>();

expectTypeOf(grep(<C>_, (_1: A | B, _2: keyof C) => _)).toEqualTypeOf<Array<A | B>>();
expectTypeOf(grep(<readonly string[]>_, (_1: string, _2: number) => <C>_)).toEqualTypeOf<string[]>();
expectTypeOf(grep(<string[]>_, (_1: string, _2: number) => <C>_)).toEqualTypeOf<string[]>();
expectTypeOf(grep([0, 'a'], (_1: number | string, _2: number) => _)).toEqualTypeOf<Array<number | string>>();
expectTypeOf(grep(<Map<A, B>>_, (_1: B, _2: A) => _)).toEqualTypeOf<B[]>();
expectTypeOf(grep(<Set<A>>_, (_1: A, _2: number) => _)).toEqualTypeOf<A[]>();
expectTypeOf(grep(<NodeIterator>_, (_1: Node, _2: number) => _)).toEqualTypeOf<Node[]>();
expectTypeOf(grep(<Iterator<A>>_, (_1: A, _2: number) => _)).toEqualTypeOf<A[]>();
expectTypeOf(grep(<HasEntries<A>>_, (_1: A, _2: string) => _)).toEqualTypeOf<A[]>();
expectTypeOf(grep(<HasForEach<A>>_, (_1: A, _2: number) => _)).toEqualTypeOf<A[]>();
expectTypeOf(grep(<Zeta.Dictionary<A>>_, (_1: A, _2: string) => _)).toEqualTypeOf<A[]>();
expectTypeOf(grep(<any>_, (_1: any, _2: any) => _)).toEqualTypeOf<any[]>();
expectTypeOf(grep(<unknown>_, (_1: any, _2: any) => _)).toEqualTypeOf<any[]>();

expectTypeOf(any(<C>_, (_1: A | B, _2: keyof C) => <C>_)).toEqualTypeOf<A | B | false>();
expectTypeOf(any(<readonly string[]>_, (_1: string, _2: number) => <C>_)).toEqualTypeOf<string | false>();
expectTypeOf(any(<string[]>_, (_1: string, _2: number) => <C>_)).toEqualTypeOf<string | false>();
expectTypeOf(any([0, 'a'], (_1: number | string, _2: number) => <C>_)).toEqualTypeOf<number | string | false>();
expectTypeOf(any(<Map<A, B>>_, (_1: B, _2: A) => <C>_)).toEqualTypeOf<B | false>();
expectTypeOf(any(<Set<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<A | false>();
expectTypeOf(any(<NodeIterator>_, (_1: Node, _2: number) => <C>_)).toEqualTypeOf<Node | false>();
expectTypeOf(any(<Iterator<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<A | false>();
expectTypeOf(any(<HasEntries<A>>_, (_1: A, _2: string) => <C>_)).toEqualTypeOf<A | false>();
expectTypeOf(any(<HasForEach<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<A | false>();
expectTypeOf(any(<Zeta.Dictionary<A>>_, (_1: A, _2: string) => _)).toEqualTypeOf<A | false>();
expectTypeOf(any(<any>_, (_1: any, _2: any) => _)).toBeAny();
expectTypeOf(any(<unknown>_, (_1: any, _2: any) => _)).toBeAny();

expectTypeOf(single(<C>_, (_1: A | B, _2: keyof C) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<readonly string[]>_, (_1: string, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<string[]>_, (_1: string, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single([0, 'a'], (_1: number | string, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<Map<A, B>>_, (_1: B, _2: A) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<Set<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<NodeIterator>_, (_1: Node, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<Iterator<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<HasEntries<A>>_, (_1: A, _2: string) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<HasForEach<A>>_, (_1: A, _2: number) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<Zeta.Dictionary<A>>_, (_1: A, _2: string) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<any>_, (_1: any, _2: any) => <C>_)).toEqualTypeOf<C | false>();
expectTypeOf(single(<unknown>_, (_1: any, _2: any) => <C>_)).toEqualTypeOf<C | false>();

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
expectTypeOf(defineAliasProperty(<C>_, 'a', <A>_)).toBeVoid();
expectTypeOf(defineAliasProperty(<C>_, 'a', <A>_, '__a')).toBeVoid();

// defineAliasProperty - unknown property
expectTypeOf(defineAliasProperty(<C>_, 'c', <A>_)).toBeVoid();
expectTypeOf(defineAliasProperty(<C>_, 'c', <A>_, '__b')).toBeVoid();

// defineObservableProperty - basic
expectTypeOf(defineObservableProperty(<C>_, 'a')).toEqualTypeOf<(value: A) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'a', <A>_, true)).toEqualTypeOf<(value: A) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'a', <A>_, (_1: A, _2: A) => _1)).toEqualTypeOf<(value: A) => void>();

// defineObservableProperty - unknown property
expectTypeOf(defineObservableProperty(<C>_, 'c')).toEqualTypeOf<(value: unknown) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'c', 1)).toEqualTypeOf<(value: number) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'c', 1, true)).toEqualTypeOf<(value: number) => void>();
expectTypeOf(defineObservableProperty(<C>_, 'c', 1, (_1: number, _2: number) => _1)).toEqualTypeOf<(value: number) => void>();

// -------------------------------------
// domUtil.d.ts

bind(window, 'focus', (_1: FocusEvent) => _);
bind(window, 'focus', (_1: FocusEvent) => _, true);
bind(window, 'focus', (_1: FocusEvent) => _, false);
bind(window, 'focus', (_1: FocusEvent) => _, { capture: true, passive: true });
bind(window, 'unknown', (_1: Event) => _);
bind(window, 'popstate mousedown', (_1: PopStateEvent | MouseEvent) => _);
// @ts-expect-error
bind(window, 'popstate', (_1: FocusEvent) => _);
// @ts-expect-error
bind(window, 'popstate mousedown', (_1: PopStateEvent) => _);

bind(window, 'focus', e => {
    expectTypeOf(e).toEqualTypeOf<FocusEvent>();
});
bind(window, 'popstate mousedown', e => {
    expectTypeOf(e).toEqualTypeOf<PopStateEvent | MouseEvent>();
});

// bind - multiple event handlers
bind(window, {
    focus(_1: FocusEvent) { },
    popstate(_1: PopStateEvent) { },
    unknown(_1: any) { },
});
bind(window, {
    focus(_1: FocusEvent) { },
    // @ts-expect-error
    popstate(_1: FocusEvent) { },
});

// bind - event listener options
bind(window, { focus() { } }, true);
bind(window, { focus() { } }, false);
bind(window, { focus() { } }, { capture: true, passive: true });

// -------------------------------------
// events.d.ts

interface EventMap<T> {
    basic: Zeta.ZetaEventBase<T>;
    async: Zeta.ZetaAsyncHandleableEvent<A, T>;
    sync: Zeta.ZetaHandleableEvent<A, T>;
    defer: Zeta.ZetaDeferrableEvent<T>;
    objectData: DataEvent<T, B>;
    nonObjectData: DataEvent<T, string>;
    anyData: DataEvent<T, any>;
}

interface DataEvent<T, V> extends Zeta.ZetaEventBase<T> {
    data: V;
}

declare const container: Zeta.ZetaEventContainer<C, EventMap<C>>;
declare const target: Zeta.ZetaEventDispatcher<EventMap<C>, C>;

// on - return type
expectTypeOf(target.on('basic', () => _)).toEqualTypeOf<Zeta.UnregisterCallback>();
expectTypeOf(target.on('unknown', () => _)).toEqualTypeOf<Zeta.UnregisterCallback>();

// on - callback's argument type
target.on('basic', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaEventBase<C>>();
    expectTypeOf(e.context).toEqualTypeOf<C>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<C>();
    expectTypeOf(self).toEqualTypeOf<C>();
});
target.on('async', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaAsyncHandleableEvent<A, C>>();
    expectTypeOf(e.context).toEqualTypeOf<C>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<C>();
    expectTypeOf(self).toEqualTypeOf<C>();
});
target.on('sync', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaHandleableEvent<A, C>>();
    expectTypeOf(e.context).toEqualTypeOf<C>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<C>();
    expectTypeOf(self).toEqualTypeOf<C>();
});
target.on('defer', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaDeferrableEvent<C>>();
    expectTypeOf(e.context).toEqualTypeOf<C>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<C>();
    expectTypeOf(self).toEqualTypeOf<C>();
});
target.on('unknown', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaEvent<C>>();
    expectTypeOf(e.context).toEqualTypeOf<C>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<C>();
    expectTypeOf(self).toEqualTypeOf<C>();
});
(<Zeta.ZetaEventDispatcher<EventMap<D>, D>>_).on('basic', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaEventBase<D>>();
    expectTypeOf(e.context).toEqualTypeOf<D>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<D>();
    expectTypeOf(self).toEqualTypeOf<D>();
});
(<Zeta.ZetaEventDispatcher<EventMap<E>, E>>_).on('basic', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaEventBase<E>>();
    expectTypeOf(e.context).toEqualTypeOf<E>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<HTMLElement>();
    expectTypeOf(self).toEqualTypeOf<E>();
});

// on - callback's argument type, whitespace-delimited event name
target.on('basic async', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaEventBase<C> | Zeta.ZetaAsyncHandleableEvent<A, C>>();
    expectTypeOf(e.context).toEqualTypeOf<C>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<C>();
    expectTypeOf(self).toEqualTypeOf<C>();
});

// on - backward compatible generic signature
(<E extends keyof EventMap<C>>(event: E, handler: Zeta.ZetaEventHandler<E, EventMap<C>, C>) => {
    return target.on(event, handler);
});

// on - callback's return type
target.on('async', () => void 0);
target.on('async', () => <A>_);
target.on('async', () => resolve(<A>_));
target.on('async', e => e.handled());
target.on('async', e => e.handled(<A>_));
target.on('async', e => e.handled(resolve(<A>_)));

target.on('sync', () => void 0);
target.on('sync', () => <A>_);
// @ts-expect-error
target.on('sync', () => resolve(<A>_)); // sync event does not accept promise
// @ts-expect-error
target.on('sync', e => e.handled()); // sync event require argument
target.on('sync', e => e.handled(<A>_));
// @ts-expect-error
target.on('sync', e => e.handled(resolve(<A>_))); // sync event does not accept promise

// on - multiple handlers
target.on({
    basic(_1: Zeta.ZetaEventBase<C>, _2: C) { },
    async(_1: Zeta.ZetaAsyncHandleableEvent<A, C>, _2: C) { },
    sync(_1: Zeta.ZetaHandleableEvent<A, C>, _2: C) { },
    defer(_1: Zeta.ZetaDeferrableEvent<C>, _2: C) { },
    unknown(_1: Zeta.ZetaEvent<C>, _2: C) { },
});

target.on({
    basic(...args) {
        expectTypeOf(args).toEqualTypeOf<[Zeta.ZetaEventBase<C>, C]>();
    },
    async(...args) {
        expectTypeOf(args).toEqualTypeOf<[Zeta.ZetaAsyncHandleableEvent<A, C>, C]>();
    },
    sync(...args) {
        expectTypeOf(args).toEqualTypeOf<[Zeta.ZetaHandleableEvent<A, C>, C]>();
    },
    defer(...args) {
        expectTypeOf(args).toEqualTypeOf<[Zeta.ZetaDeferrableEvent<C>, C]>();
    },
    unknown(...args) {
        expectTypeOf(args).toEqualTypeOf<any[]>();
    },
});

// add - backward compatible generic signature
(<E extends keyof EventMap<C>>(event: E, handler: Zeta.ZetaEventHandler<E, EventMap<C>, C>) => {
    return container.add(<C>_, event, handler);
});

// emit - return type of known event
expectTypeOf(container.emit('basic', <C>_)).toEqualTypeOf<any>();
expectTypeOf(container.emit('async', <C>_)).toEqualTypeOf<Promise<A> | undefined>();
// @ts-expect-error
expectTypeOf(container.emit('sync', <C>_)).toEqualTypeOf<A | undefined>(); // must specify asynResult options
expectTypeOf(container.emit('defer', <C>_, null, { deferrable: true })).toEqualTypeOf<Promise<void>>();
// @ts-expect-error
expectTypeOf(container.emit('defer', <C>_, null, { deferrable: false })).toEqualTypeOf<Promise<void>>(); // must specify deferrable options
// @ts-expect-error
expectTypeOf(container.emit('defer', <C>_)).toEqualTypeOf<Promise<void>>(); // must specify deferrable options
expectTypeOf(container.emit('unknown', <C>_)).toEqualTypeOf<Promise<any> | undefined>();

// emit - return type of unknown event
expectTypeOf(container.emit('unknown', <C>_, null, { deferrable: true })).toEqualTypeOf<Promise<void>>();
expectTypeOf(container.emit('unknown', <C>_, null, { asyncResult: false })).toEqualTypeOf<any>();
expectTypeOf(container.emit('unknown', <C>_, null, { handleable: false })).toEqualTypeOf<void>();
expectTypeOf(container.emit('unknown', <C>_, null, { deferrable: false })).toEqualTypeOf<Promise<any> | undefined>();
expectTypeOf(container.emit('unknown', <C>_, null, true)).toEqualTypeOf<Promise<any> | undefined>();
expectTypeOf(container.emit('unknown', <C>_, null, false)).toEqualTypeOf<Promise<any> | undefined>();
expectTypeOf(container.emit('unknown', <C>_, null)).toEqualTypeOf<Promise<any> | undefined>();

// emit - data argument
container.emit('objectData', <C>_, { data: <B>_ });
// @ts-expect-error
container.emit('objectData', <C>_, { data: <A>_ }); // incorrect data type
// @ts-expect-error
container.emit('objectData', <C>_, <B>_); // must be supplied by data property

container.emit('nonObjectData', <C>_, '');
container.emit('nonObjectData', <C>_, { data: '' });
// @ts-expect-error
container.emit('nonObjectData', <C>_, 0); // incorrect data type
// @ts-expect-error
container.emit('nonObjectData', <C>_, { data: <A>_ }); // incorrect data type

container.emit('anyData', <C>_, '');
container.emit('anyData', <C>_, { data: '' });
// @ts-expect-error
container.emit('anyData', <C>_, <B>_); // must be supplied by data property

container.emit('unknown', <C>_, { customProps: true });
// @ts-expect-error
container.emit('basic', <C>_, { customProps: true }); // custom props are only allowed in unknown event

// emit - event as first argument
container.emit(<Zeta.ZetaEventBase>_, <C>_);
container.emit(<Zeta.ZetaEventBase>_, <C>_, { customProps: true });

// -------------------------------------
// dom.d.ts

expectTypeOf<Zeta.ZetaMouseEvent<HTMLInputElement>>().toMatchTypeOf<Zeta.ZetaMouseEvent>();

dom.on('click', (_1: Zeta.ZetaMouseEvent) => _);
dom.on('unknown', (_1: Zeta.ZetaEvent) => _);
// @ts-expect-error
dom.on('click', (_1: Zeta.ZetaKeystrokeEvent) => _); // incorrect argument type

dom.on('click', 'button', (_1: Zeta.ZetaMouseEvent) => _);
dom.on('unknown', 'button', (_1: Zeta.ZetaEvent) => _);

dom.on('click', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaMouseEvent<HTMLHtmlElement>>();
    expectTypeOf(e.target).toEqualTypeOf<HTMLElement>();
    expectTypeOf(e.context).toEqualTypeOf<HTMLHtmlElement>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<HTMLHtmlElement>();
    expectTypeOf(self).toEqualTypeOf<HTMLHtmlElement>();
});
dom.on('click', 'button', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaMouseEvent<HTMLButtonElement>>();
    expectTypeOf(e.target).toEqualTypeOf<HTMLElement>();
    expectTypeOf(e.context).toEqualTypeOf<HTMLButtonElement>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<HTMLButtonElement>();
    expectTypeOf(self).toEqualTypeOf<HTMLButtonElement>();
});

dom.on('click keystroke', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaMouseEvent<HTMLHtmlElement> | Zeta.ZetaKeystrokeEvent<HTMLHtmlElement>>();
    expectTypeOf(e.target).toEqualTypeOf<HTMLElement>();
    expectTypeOf(e.context).toEqualTypeOf<HTMLHtmlElement>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<HTMLHtmlElement>();
    expectTypeOf(self).toEqualTypeOf<HTMLHtmlElement>();
});
dom.on('click keystroke', 'button', (e, self) => {
    expectTypeOf(e).toEqualTypeOf<Zeta.ZetaMouseEvent<HTMLButtonElement> | Zeta.ZetaKeystrokeEvent<HTMLButtonElement>>();
    expectTypeOf(e.target).toEqualTypeOf<HTMLElement>();
    expectTypeOf(e.context).toEqualTypeOf<HTMLButtonElement>();
    expectTypeOf(e.currentTarget).toEqualTypeOf<HTMLButtonElement>();
    expectTypeOf(self).toEqualTypeOf<HTMLButtonElement>();
});


dom.on({
    focusin(_1: Zeta.ZetaFocusEvent) { },
    focusout(_1: Zeta.ZetaFocusEvent) { },
    unknown(_1: any) { },
});

dom.on({
    focusin(...args) {
        expectTypeOf(args).toEqualTypeOf<[Zeta.ZetaFocusEvent<HTMLHtmlElement>, HTMLHtmlElement]>();
    }
});
