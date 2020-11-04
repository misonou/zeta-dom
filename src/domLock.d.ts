/// <reference path="types.d.ts" />

export declare function lock(element: Element, promise: Promise<any>, oncancel?: () => Promise<any>): Promise<any>;
export declare function locked(element: Element, parents?: boolean): boolean;
export declare function cancelLock(element: Element, force?: boolean): void;
export declare function removeLock(element: Element): void;
