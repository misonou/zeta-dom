/// <reference types="jquery" />

declare namespace Zeta {

    type RangeLike = Range | Node | HasRange;
    type RectLike = Rect | ClientRect | HasRect;
    type PointLike = Point | Offset | MouseEvent | Touch | JQuery.UIEventBase;
    type ElementLike = Element | HasElement;
    type HtmlContent = string | Node | Node[] | NodeList | JQuery<any> | JQuery.htmlString;

    type Primitive = number | string | boolean | symbol | undefined | null;
    type Dictionary<T = any> = Record<string, T>;
    type ArrayMember<T> = { [P in Extract<keyof T, number>]: T[P] }[Extract<keyof T, number>];
    type KeyOf<T> = T extends (any[] | ArrayLike<any>) ? number :
        T extends Map<infer K, any> ? K :
        T extends WeakMap<infer K, any> ? K :
        T extends Set<infer V> ? V :
        T extends WeakSet<infer V> ? V :
        T extends object ? Exclude<keyof T, symbol> : never;
    type ValueOf<T> = T extends (any[] | ArrayLike<any>) ? ArrayMember<T> :
        T extends Map<any, infer V> ? V :
        T extends WeakMap<any, infer V> ? V :
        T extends Set<infer V> ? V :
        T extends WeakSet<infer V> ? V :
        object extends T ? any :
        T extends object ? T[Exclude<keyof T, symbol>] : never;
    type StringKeyOf<T> = Extract<keyof T, string>;
    type PropertyTypeOrAny<T, P> = P extends keyof T ? T[P] : any;
    type HintedString<T extends string> = string & {} | T;
    type HintedKeyOf<T> = string & {} | keyof T;
    type HintedStringKeyOf<T> = string & {} | Extract<keyof T, string>;

    type WhitespaceDelimited<T extends string> = T extends `${infer L} ${infer R}` ? Exclude<L, ''> | WhitespaceDelimited<R> : Exclude<T, ''>;
    type DeepReadonly<T> = T extends Primitive ? T : T extends (infer V)[] ? readonly V[] : { readonly [P in keyof T]: DeepReadonly<T[P]> };
    /** @deprecated Use the built-in {@link Awaited} instead */
    type PromiseResult<T> = T extends PromiseLike<infer U> ? PromiseResult<U> : T;
    type WatchableInstance<T, K = keyof T> = T & Watchable<T, K>;

    type IteratorNodeFilterResult = 1 | 2 | 3;
    type IteratorNodeFilter<T> = (node: T) => IteratorNodeFilterResult | undefined;
    type MapResultValue<T> = T | T[] | null | undefined;
    type IterateCallbackOrNull<T, R> = null | ((node: T) => MapResultValue<R>);

    type If<T extends boolean, U, V> = T extends true ? U : V;
    type Not<T extends boolean> = If<T, false, true>;
    type IsAny<T> = ((x: T extends never ? true : false) => void) extends (x: boolean) => void ? true : false;
    type IsAnyOrUnknown<T> = ((x: T) => void) extends (x: unknown) => void ? true : false;
    type IsUnknown<T> = If<IsAnyOrUnknown<T>, Not<IsAny<T>>, false>;
    type IsNever<T> = [T] extends [never] ? true : false;
    type Default<T, U> = If<IsUnknown<T>, U, T>;
    type ExtractAny<T, U> = If<Zeta.IsAnyOrUnknown<T>, U, Extract<T, U>>;

    type AnyFunction = (...args: any[]) => any;
    type AnyConstructor = new (...args: any[]) => any;
    type AnyConstructorOrClass = abstract new (...args: any[]) => any;
    type AdditionalMembers<T, U> = { [P in keyof U]: U[P] extends AnyFunction ? (this: T & U, ...args: any[]) => any : U[P] };

    type UnregisterCallback = () => void;

    type NodeOfType<T extends number> = {
        [1]: Element;
        [2]: Attr;
        [3]: Text;
        [4]: CDATASection;
        [8]: Comment;
        [9]: Document;
        [10]: DocumentType;
        [11]: DocumentFragment;
        [a: number]: Node;
    }[T];

    type ElementType<K> = K extends keyof HTMLElementTagNameMap ? HTMLElementTagNameMap[K] :
        K extends keyof SVGElementTagNameMap ? SVGElementTagNameMap[K] :
        K extends keyof MathMLElementTagNameMap ? MathMLElementTagNameMap[K] :
        K extends keyof HTMLElementDeprecatedTagNameMap ? HTMLElementDeprecatedTagNameMap[K] : Element;

    type DOMEventNames =
        keyof AbortSignalEventMap |
        keyof AbstractWorkerEventMap |
        keyof AnimationEventMap |
        keyof AudioScheduledSourceNodeEventMap |
        keyof AudioWorkletNodeEventMap |
        keyof BaseAudioContextEventMap |
        keyof BroadcastChannelEventMap |
        keyof DocumentEventMap |
        keyof ElementEventMap |
        keyof EventSourceEventMap |
        keyof FileReaderEventMap |
        keyof FontFaceSetEventMap |
        keyof GlobalEventHandlersEventMap |
        keyof HTMLBodyElementEventMap |
        keyof HTMLElementEventMap |
        keyof HTMLFrameSetElementEventMap |
        keyof HTMLMediaElementEventMap |
        keyof HTMLVideoElementEventMap |
        keyof IDBDatabaseEventMap |
        keyof IDBOpenDBRequestEventMap |
        keyof IDBRequestEventMap |
        keyof IDBTransactionEventMap |
        keyof MathMLElementEventMap |
        keyof MediaDevicesEventMap |
        keyof MediaKeySessionEventMap |
        keyof MediaQueryListEventMap |
        keyof MediaRecorderEventMap |
        keyof MediaSourceEventMap |
        keyof MediaStreamEventMap |
        keyof MediaStreamTrackEventMap |
        keyof MessagePortEventMap |
        keyof NotificationEventMap |
        keyof OfflineAudioContextEventMap |
        keyof PaymentRequestEventMap |
        keyof PerformanceEventMap |
        keyof PermissionStatusEventMap |
        keyof PictureInPictureWindowEventMap |
        keyof RTCDTMFSenderEventMap |
        keyof RTCDataChannelEventMap |
        keyof RTCDtlsTransportEventMap |
        keyof RTCPeerConnectionEventMap |
        keyof RemotePlaybackEventMap |
        keyof SVGElementEventMap |
        keyof SVGSVGElementEventMap |
        keyof ScreenOrientationEventMap |
        keyof ScriptProcessorNodeEventMap |
        keyof ServiceWorkerEventMap |
        keyof ServiceWorkerContainerEventMap |
        keyof ServiceWorkerRegistrationEventMap |
        keyof ShadowRootEventMap |
        keyof SourceBufferEventMap |
        keyof SourceBufferListEventMap |
        keyof SpeechSynthesisEventMap |
        keyof SpeechSynthesisUtteranceEventMap |
        keyof TextTrackEventMap |
        keyof TextTrackCueEventMap |
        keyof TextTrackListEventMap |
        keyof VisualViewportEventMap |
        keyof WebSocketEventMap |
        keyof WindowEventMap |
        keyof WindowEventHandlersEventMap |
        keyof WorkerEventMap |
        keyof XMLHttpRequestEventMap |
        keyof XMLHttpRequestEventTargetEventMap;

    type DOMEventIDLProp<K extends string, E extends Event> = { [P in `on${K}`]: ((ev: E) => any) | null };
    type DOMEventType<T extends EventTarget, K extends string> = ({ [P in K]: T extends DOMEventIDLProp<P, infer E> ? E : Event })[K];
    type DOMEventsOf<T extends EventTarget> = ({ [P in keyof T]: EventListener extends T[P] ? P extends `on${infer E}` ? E : never : never })[keyof T];

    type BoxSide = 'left' | 'top' | 'right' | 'bottom';
    type BoxCorner = 'left bottom' | 'left top' | 'right bottom' | 'right top';
    type BoxAlign = BoxSide | BoxCorner
        | 'left center' | 'top center' | 'right center' | 'bottom center'
        | 'center auto' | 'auto center' | 'center' | 'auto';
    type Direction = BoxSide;
    /**
     * @deprecated
     */
    type Direction2D = Direction
        | 'left bottom' | 'left top' | 'right bottom' | 'right top'
        | 'left bottom inset-x' | 'left top inset-x' | 'right bottom inset-x' | 'right top inset-x'
        | 'left bottom inset-y' | 'left top inset-y' | 'right bottom inset-y' | 'right top inset-y'
        | 'left bottom inset' | 'left top inset' | 'right bottom inset' | 'right top inset'
        | 'left center' | 'top center' | 'right center' | 'bottom center' | 'center'
        | 'left center inset' | 'top center inset' | 'right center inset' | 'bottom center inset' | 'center inset' | 'auto';
    type KeyNameModifier = 'shift' | 'ctrl' | 'alt' | 'ctrlShift' | 'altShift' | 'ctrlAlt' | 'ctrlAltShift';
    type KeyNameSpecial = 'backspace' | 'tab' | 'enter' | 'pause' | 'capsLock' | 'escape' | 'space' | 'pageUp' | 'pageDown' | 'end' | 'home' | 'leftArrow' | 'upArrow' | 'rightArrow' | 'downArrow' | 'insert' | 'delete' | 'leftWindow' | 'rightWindowKey' | 'select' | 'numpad0' | 'numpad1' | 'numpad2' | 'numpad3' | 'numpad4' | 'numpad5' | 'numpad6' | 'numpad7' | 'numpad8' | 'numpad9' | 'multiply' | 'add' | 'subtract' | 'decimalPoint' | 'divide' | 'f1' | 'f2' | 'f3' | 'f4' | 'f5' | 'f6' | 'f7' | 'f8' | 'f9' | 'f10' | 'f11' | 'f12' | 'numLock' | 'scrollLock' | 'semiColon' | 'equalSign' | 'comma' | 'dash' | 'period' | 'forwardSlash' | 'backtick' | 'openBracket' | 'backSlash' | 'closeBracket' | 'singleQuote'
        | 'shiftBackspace' | 'shiftTab' | 'shiftEnter' | 'shiftShift' | 'shiftCtrl' | 'shiftAlt' | 'shiftPause' | 'shiftCapsLock' | 'shiftEscape' | 'shiftSpace' | 'shiftPageUp' | 'shiftPageDown' | 'shiftEnd' | 'shiftHome' | 'shiftLeftArrow' | 'shiftUpArrow' | 'shiftRightArrow' | 'shiftDownArrow' | 'shiftInsert' | 'shiftDelete' | 'shiftLeftWindow' | 'shiftRightWindowKey' | 'shiftSelect' | 'shiftNumpad0' | 'shiftNumpad1' | 'shiftNumpad2' | 'shiftNumpad3' | 'shiftNumpad4' | 'shiftNumpad5' | 'shiftNumpad6' | 'shiftNumpad7' | 'shiftNumpad8' | 'shiftNumpad9' | 'shiftMultiply' | 'shiftAdd' | 'shiftSubtract' | 'shiftDecimalPoint' | 'shiftDivide' | 'shiftF1' | 'shiftF2' | 'shiftF3' | 'shiftF4' | 'shiftF5' | 'shiftF6' | 'shiftF7' | 'shiftF8' | 'shiftF9' | 'shiftF10' | 'shiftF11' | 'shiftF12' | 'shiftNumLock' | 'shiftScrollLock' | 'shiftSemiColon' | 'shiftEqualSign' | 'shiftComma' | 'shiftDash' | 'shiftPeriod' | 'shiftForwardSlash' | 'shiftBacktick' | 'shiftOpenBracket' | 'shiftBackSlash' | 'shiftCloseBracket' | 'shiftSingleQuote'
        | 'ctrlBackspace' | 'ctrlTab' | 'ctrlEnter' | 'ctrlShift' | 'ctrlCtrl' | 'ctrlAlt' | 'ctrlPause' | 'ctrlCapsLock' | 'ctrlEscape' | 'ctrlSpace' | 'ctrlPageUp' | 'ctrlPageDown' | 'ctrlEnd' | 'ctrlHome' | 'ctrlLeftArrow' | 'ctrlUpArrow' | 'ctrlRightArrow' | 'ctrlDownArrow' | 'ctrlInsert' | 'ctrlDelete' | 'ctrl0' | 'ctrl1' | 'ctrl2' | 'ctrl3' | 'ctrl4' | 'ctrl5' | 'ctrl6' | 'ctrl7' | 'ctrl8' | 'ctrl9' | 'ctrlA' | 'ctrlB' | 'ctrlC' | 'ctrlD' | 'ctrlE' | 'ctrlF' | 'ctrlG' | 'ctrlH' | 'ctrlI' | 'ctrlJ' | 'ctrlK' | 'ctrlL' | 'ctrlM' | 'ctrlN' | 'ctrlO' | 'ctrlP' | 'ctrlQ' | 'ctrlR' | 'ctrlS' | 'ctrlT' | 'ctrlU' | 'ctrlV' | 'ctrlW' | 'ctrlX' | 'ctrlY' | 'ctrlZ' | 'ctrlLeftWindow' | 'ctrlRightWindowKey' | 'ctrlSelect' | 'ctrlNumpad0' | 'ctrlNumpad1' | 'ctrlNumpad2' | 'ctrlNumpad3' | 'ctrlNumpad4' | 'ctrlNumpad5' | 'ctrlNumpad6' | 'ctrlNumpad7' | 'ctrlNumpad8' | 'ctrlNumpad9' | 'ctrlMultiply' | 'ctrlAdd' | 'ctrlSubtract' | 'ctrlDecimalPoint' | 'ctrlDivide' | 'ctrlF1' | 'ctrlF2' | 'ctrlF3' | 'ctrlF4' | 'ctrlF5' | 'ctrlF6' | 'ctrlF7' | 'ctrlF8' | 'ctrlF9' | 'ctrlF10' | 'ctrlF11' | 'ctrlF12' | 'ctrlNumLock' | 'ctrlScrollLock' | 'ctrlSemiColon' | 'ctrlEqualSign' | 'ctrlComma' | 'ctrlDash' | 'ctrlPeriod' | 'ctrlForwardSlash' | 'ctrlBacktick' | 'ctrlOpenBracket' | 'ctrlBackSlash' | 'ctrlCloseBracket' | 'ctrlSingleQuote'
        | 'ctrlShiftBackspace' | 'ctrlShiftTab' | 'ctrlShiftEnter' | 'ctrlShiftShift' | 'ctrlShiftCtrl' | 'ctrlShiftAlt' | 'ctrlShiftPause' | 'ctrlShiftCapsLock' | 'ctrlShiftEscape' | 'ctrlShiftSpace' | 'ctrlShiftPageUp' | 'ctrlShiftPageDown' | 'ctrlShiftEnd' | 'ctrlShiftHome' | 'ctrlShiftLeftArrow' | 'ctrlShiftUpArrow' | 'ctrlShiftRightArrow' | 'ctrlShiftDownArrow' | 'ctrlShiftInsert' | 'ctrlShiftDelete' | 'ctrlShift0' | 'ctrlShift1' | 'ctrlShift2' | 'ctrlShift3' | 'ctrlShift4' | 'ctrlShift5' | 'ctrlShift6' | 'ctrlShift7' | 'ctrlShift8' | 'ctrlShift9' | 'ctrlShiftA' | 'ctrlShiftB' | 'ctrlShiftC' | 'ctrlShiftD' | 'ctrlShiftE' | 'ctrlShiftF' | 'ctrlShiftG' | 'ctrlShiftH' | 'ctrlShiftI' | 'ctrlShiftJ' | 'ctrlShiftK' | 'ctrlShiftL' | 'ctrlShiftM' | 'ctrlShiftN' | 'ctrlShiftO' | 'ctrlShiftP' | 'ctrlShiftQ' | 'ctrlShiftR' | 'ctrlShiftS' | 'ctrlShiftT' | 'ctrlShiftU' | 'ctrlShiftV' | 'ctrlShiftW' | 'ctrlShiftX' | 'ctrlShiftY' | 'ctrlShiftZ' | 'ctrlShiftLeftWindow' | 'ctrlShiftRightWindowKey' | 'ctrlShiftSelect' | 'ctrlShiftNumpad0' | 'ctrlShiftNumpad1' | 'ctrlShiftNumpad2' | 'ctrlShiftNumpad3' | 'ctrlShiftNumpad4' | 'ctrlShiftNumpad5' | 'ctrlShiftNumpad6' | 'ctrlShiftNumpad7' | 'ctrlShiftNumpad8' | 'ctrlShiftNumpad9' | 'ctrlShiftMultiply' | 'ctrlShiftAdd' | 'ctrlShiftSubtract' | 'ctrlShiftDecimalPoint' | 'ctrlShiftDivide' | 'ctrlShiftF1' | 'ctrlShiftF2' | 'ctrlShiftF3' | 'ctrlShiftF4' | 'ctrlShiftF5' | 'ctrlShiftF6' | 'ctrlShiftF7' | 'ctrlShiftF8' | 'ctrlShiftF9' | 'ctrlShiftF10' | 'ctrlShiftF11' | 'ctrlShiftF12' | 'ctrlShiftNumLock' | 'ctrlShiftScrollLock' | 'ctrlShiftSemiColon' | 'ctrlShiftEqualSign' | 'ctrlShiftComma' | 'ctrlShiftDash' | 'ctrlShiftPeriod' | 'ctrlShiftForwardSlash' | 'ctrlShiftBacktick' | 'ctrlShiftOpenBracket' | 'ctrlShiftBackSlash' | 'ctrlShiftCloseBracket' | 'ctrlShiftSingleQuote'
        | 'ctrlAltBackspace' | 'ctrlAltTab' | 'ctrlAltEnter' | 'ctrlAltShift' | 'ctrlAltCtrl' | 'ctrlAltAlt' | 'ctrlAltPause' | 'ctrlAltCapsLock' | 'ctrlAltEscape' | 'ctrlAltSpace' | 'ctrlAltPageUp' | 'ctrlAltPageDown' | 'ctrlAltEnd' | 'ctrlAltHome' | 'ctrlAltLeftArrow' | 'ctrlAltUpArrow' | 'ctrlAltRightArrow' | 'ctrlAltDownArrow' | 'ctrlAltInsert' | 'ctrlAltDelete' | 'ctrlAlt0' | 'ctrlAlt1' | 'ctrlAlt2' | 'ctrlAlt3' | 'ctrlAlt4' | 'ctrlAlt5' | 'ctrlAlt6' | 'ctrlAlt7' | 'ctrlAlt8' | 'ctrlAlt9' | 'ctrlAltA' | 'ctrlAltB' | 'ctrlAltC' | 'ctrlAltD' | 'ctrlAltE' | 'ctrlAltF' | 'ctrlAltG' | 'ctrlAltH' | 'ctrlAltI' | 'ctrlAltJ' | 'ctrlAltK' | 'ctrlAltL' | 'ctrlAltM' | 'ctrlAltN' | 'ctrlAltO' | 'ctrlAltP' | 'ctrlAltQ' | 'ctrlAltR' | 'ctrlAltS' | 'ctrlAltT' | 'ctrlAltU' | 'ctrlAltV' | 'ctrlAltW' | 'ctrlAltX' | 'ctrlAltY' | 'ctrlAltZ' | 'ctrlAltLeftWindow' | 'ctrlAltRightWindowKey' | 'ctrlAltSelect' | 'ctrlAltNumpad0' | 'ctrlAltNumpad1' | 'ctrlAltNumpad2' | 'ctrlAltNumpad3' | 'ctrlAltNumpad4' | 'ctrlAltNumpad5' | 'ctrlAltNumpad6' | 'ctrlAltNumpad7' | 'ctrlAltNumpad8' | 'ctrlAltNumpad9' | 'ctrlAltMultiply' | 'ctrlAltAdd' | 'ctrlAltSubtract' | 'ctrlAltDecimalPoint' | 'ctrlAltDivide' | 'ctrlAltF1' | 'ctrlAltF2' | 'ctrlAltF3' | 'ctrlAltF4' | 'ctrlAltF5' | 'ctrlAltF6' | 'ctrlAltF7' | 'ctrlAltF8' | 'ctrlAltF9' | 'ctrlAltF10' | 'ctrlAltF11' | 'ctrlAltF12' | 'ctrlAltNumLock' | 'ctrlAltScrollLock' | 'ctrlAltSemiColon' | 'ctrlAltEqualSign' | 'ctrlAltComma' | 'ctrlAltDash' | 'ctrlAltPeriod' | 'ctrlAltForwardSlash' | 'ctrlAltBacktick' | 'ctrlAltOpenBracket' | 'ctrlAltBackSlash' | 'ctrlAltCloseBracket' | 'ctrlAltSingleQuote'
        | 'altBackspace' | 'altTab' | 'altEnter' | 'altShift' | 'altCtrl' | 'altAlt' | 'altPause' | 'altCapsLock' | 'altEscape' | 'altSpace' | 'altPageUp' | 'altPageDown' | 'altEnd' | 'altHome' | 'altLeftArrow' | 'altUpArrow' | 'altRightArrow' | 'altDownArrow' | 'altInsert' | 'altDelete' | 'alt0' | 'alt1' | 'alt2' | 'alt3' | 'alt4' | 'alt5' | 'alt6' | 'alt7' | 'alt8' | 'alt9' | 'altA' | 'altB' | 'altC' | 'altD' | 'altE' | 'altF' | 'altG' | 'altH' | 'altI' | 'altJ' | 'altK' | 'altL' | 'altM' | 'altN' | 'altO' | 'altP' | 'altQ' | 'altR' | 'altS' | 'altT' | 'altU' | 'altV' | 'altW' | 'altX' | 'altY' | 'altZ' | 'altLeftWindow' | 'altRightWindowKey' | 'altSelect' | 'altNumpad0' | 'altNumpad1' | 'altNumpad2' | 'altNumpad3' | 'altNumpad4' | 'altNumpad5' | 'altNumpad6' | 'altNumpad7' | 'altNumpad8' | 'altNumpad9' | 'altMultiply' | 'altAdd' | 'altSubtract' | 'altDecimalPoint' | 'altDivide' | 'altF1' | 'altF2' | 'altF3' | 'altF4' | 'altF5' | 'altF6' | 'altF7' | 'altF8' | 'altF9' | 'altF10' | 'altF11' | 'altF12' | 'altNumLock' | 'altScrollLock' | 'altSemiColon' | 'altEqualSign' | 'altComma' | 'altDash' | 'altPeriod' | 'altForwardSlash' | 'altBacktick' | 'altOpenBracket' | 'altBackSlash' | 'altCloseBracket' | 'altSingleQuote'
        | 'altShiftBackspace' | 'altShiftTab' | 'altShiftEnter' | 'altShiftShift' | 'altShiftCtrl' | 'altShiftAlt' | 'altShiftPause' | 'altShiftCapsLock' | 'altShiftEscape' | 'altShiftSpace' | 'altShiftPageUp' | 'altShiftPageDown' | 'altShiftEnd' | 'altShiftHome' | 'altShiftLeftArrow' | 'altShiftUpArrow' | 'altShiftRightArrow' | 'altShiftDownArrow' | 'altShiftInsert' | 'altShiftDelete' | 'altShift0' | 'altShift1' | 'altShift2' | 'altShift3' | 'altShift4' | 'altShift5' | 'altShift6' | 'altShift7' | 'altShift8' | 'altShift9' | 'altShiftA' | 'altShiftB' | 'altShiftC' | 'altShiftD' | 'altShiftE' | 'altShiftF' | 'altShiftG' | 'altShiftH' | 'altShiftI' | 'altShiftJ' | 'altShiftK' | 'altShiftL' | 'altShiftM' | 'altShiftN' | 'altShiftO' | 'altShiftP' | 'altShiftQ' | 'altShiftR' | 'altShiftS' | 'altShiftT' | 'altShiftU' | 'altShiftV' | 'altShiftW' | 'altShiftX' | 'altShiftY' | 'altShiftZ' | 'altShiftLeftWindow' | 'altShiftRightWindowKey' | 'altShiftSelect' | 'altShiftNumpad0' | 'altShiftNumpad1' | 'altShiftNumpad2' | 'altShiftNumpad3' | 'altShiftNumpad4' | 'altShiftNumpad5' | 'altShiftNumpad6' | 'altShiftNumpad7' | 'altShiftNumpad8' | 'altShiftNumpad9' | 'altShiftMultiply' | 'altShiftAdd' | 'altShiftSubtract' | 'altShiftDecimalPoint' | 'altShiftDivide' | 'altShiftF1' | 'altShiftF2' | 'altShiftF3' | 'altShiftF4' | 'altShiftF5' | 'altShiftF6' | 'altShiftF7' | 'altShiftF8' | 'altShiftF9' | 'altShiftF10' | 'altShiftF11' | 'altShiftF12' | 'altShiftNumLock' | 'altShiftScrollLock' | 'altShiftSemiColon' | 'altShiftEqualSign' | 'altShiftComma' | 'altShiftDash' | 'altShiftPeriod' | 'altShiftForwardSlash' | 'altShiftBacktick' | 'altShiftOpenBracket' | 'altShiftBackSlash' | 'altShiftCloseBracket' | 'altShiftSingleQuote'
        | 'ctrlAltShiftBackspace' | 'ctrlAltShiftTab' | 'ctrlAltShiftEnter' | 'ctrlAltShiftShift' | 'ctrlAltShiftCtrl' | 'ctrlAltShiftAlt' | 'ctrlAltShiftPause' | 'ctrlAltShiftCapsLock' | 'ctrlAltShiftEscape' | 'ctrlAltShiftSpace' | 'ctrlAltShiftPageUp' | 'ctrlAltShiftPageDown' | 'ctrlAltShiftEnd' | 'ctrlAltShiftHome' | 'ctrlAltShiftLeftArrow' | 'ctrlAltShiftUpArrow' | 'ctrlAltShiftRightArrow' | 'ctrlAltShiftDownArrow' | 'ctrlAltShiftInsert' | 'ctrlAltShiftDelete' | 'ctrlAltShift0' | 'ctrlAltShift1' | 'ctrlAltShift2' | 'ctrlAltShift3' | 'ctrlAltShift4' | 'ctrlAltShift5' | 'ctrlAltShift6' | 'ctrlAltShift7' | 'ctrlAltShift8' | 'ctrlAltShift9' | 'ctrlAltShiftA' | 'ctrlAltShiftB' | 'ctrlAltShiftC' | 'ctrlAltShiftD' | 'ctrlAltShiftE' | 'ctrlAltShiftF' | 'ctrlAltShiftG' | 'ctrlAltShiftH' | 'ctrlAltShiftI' | 'ctrlAltShiftJ' | 'ctrlAltShiftK' | 'ctrlAltShiftL' | 'ctrlAltShiftM' | 'ctrlAltShiftN' | 'ctrlAltShiftO' | 'ctrlAltShiftP' | 'ctrlAltShiftQ' | 'ctrlAltShiftR' | 'ctrlAltShiftS' | 'ctrlAltShiftT' | 'ctrlAltShiftU' | 'ctrlAltShiftV' | 'ctrlAltShiftW' | 'ctrlAltShiftX' | 'ctrlAltShiftY' | 'ctrlAltShiftZ' | 'ctrlAltShiftLeftWindow' | 'ctrlAltShiftRightWindowKey' | 'ctrlAltShiftSelect' | 'ctrlAltShiftNumpad0' | 'ctrlAltShiftNumpad1' | 'ctrlAltShiftNumpad2' | 'ctrlAltShiftNumpad3' | 'ctrlAltShiftNumpad4' | 'ctrlAltShiftNumpad5' | 'ctrlAltShiftNumpad6' | 'ctrlAltShiftNumpad7' | 'ctrlAltShiftNumpad8' | 'ctrlAltShiftNumpad9' | 'ctrlAltShiftMultiply' | 'ctrlAltShiftAdd' | 'ctrlAltShiftSubtract' | 'ctrlAltShiftDecimalPoint' | 'ctrlAltShiftDivide' | 'ctrlAltShiftF1' | 'ctrlAltShiftF2' | 'ctrlAltShiftF3' | 'ctrlAltShiftF4' | 'ctrlAltShiftF5' | 'ctrlAltShiftF6' | 'ctrlAltShiftF7' | 'ctrlAltShiftF8' | 'ctrlAltShiftF9' | 'ctrlAltShiftF10' | 'ctrlAltShiftF11' | 'ctrlAltShiftF12' | 'ctrlAltShiftNumLock' | 'ctrlAltShiftScrollLock' | 'ctrlAltShiftSemiColon' | 'ctrlAltShiftEqualSign' | 'ctrlAltShiftComma' | 'ctrlAltShiftDash' | 'ctrlAltShiftPeriod' | 'ctrlAltShiftForwardSlash' | 'ctrlAltShiftBacktick' | 'ctrlAltShiftOpenBracket' | 'ctrlAltShiftBackSlash' | 'ctrlAltShiftCloseBracket' | 'ctrlAltShiftSingleQuote';
    type KeyNameSingleCharacter = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z';
    type ClickName = 'click' | 'dblclick' | 'rightClick' | 'doubleClick' | 'ctrlClick' | 'shiftClick' | 'altClick' | 'ctrlShiftClick' | 'ctrlAltClick' | 'altShiftClick' | 'ctrlAltShiftClick';
    type GestureName = 'swipeUp' | 'swipeDown' | 'swipeLeft' | 'swipeRight' | 'pinchZoom';

    type PropertyChangeHandler<T, P, R> = (this: T, newValue: PropertyTypeOrAny<T, P>, oldValue: PropertyTypeOrAny<T, P>, prop: P, obj: T) => R;

    interface PropertyChangeRecord<T> {
        oldValues: Partial<T>;
        newValues: Partial<T>;
    }

    interface Watchable<T = unknown, K = If<IsUnknown<T>, unknown, HintedKeyOf<T>>> {
        /**
         * Hooks a listener callback which will be fired when any observed property has been changed.
         * @param handler A callback which receives changed values.
         */
        watch(handler: (e: PropertyChangeRecord<Default<T, this>>) => void): UnregisterCallback;
        /**
         * Watches a property on the object.
         * @param prop Property name.
         * @param handler Callback to be fired and the property is changed.
         * @param fireInit Optionally fire the handler immediately.
         */
        watch<P extends Default<K, HintedKeyOf<this>>>(prop: P, handler?: PropertyChangeHandler<Default<T, this>, P, void>, fireInit?: boolean): UnregisterCallback;
        /**
         * Watches a property and resolves when the property is changed.
         * @param prop Property name.
         */
        watchOnce<P extends Default<K, HintedKeyOf<this>>>(prop: P): Promise<PropertyTypeOrAny<Default<T, this>, P>>;
        /**
         * Watches a property and resolves when the property is changed.
         * @param prop Property name.
         * @param handler Callback to be fired when the property is changed.
         * @returns A promise that resolves with the returned value from handler callback.
         */
        watchOnce<P extends Default<K, HintedKeyOf<this>>, R>(prop: P, handler: PropertyChangeHandler<Default<T, this>, P, R | Promise<R>>): Promise<R>;
    }

    interface Deferrable {
        /**
         * Defers the fulfillment until the supplied promises are all fulfilled or rejected.
         * It has no effects if the parent promise has already been fulfilled.
         * @param args One or more promises.
         * @returns Whether the supplied promises will be awaited.
         */
        waitFor(...args: Promise<any>[]): boolean;
    }

    interface RunAsyncContext {
        /**
         * Gets a signal object that get notified when operation has been cancelled.
         */
        readonly signal: AbortSignal;
        /**
         * Gets a promise that resolves with callback result.
         */
        readonly promise: Promise<any>;
    }

    interface PrivateStore<K extends object, V> {
        (obj: K): V;
        (obj: K, value: V): V;
    }

    interface Point {
        x: number;
        y: number;
    }

    interface Offset {
        left: number;
        top: number;
    }

    interface Inset {
        top: number;
        left: number;
        right: number;
        bottom: number;
    }

    interface Rect {
        readonly width: number;
        readonly height: number;
        readonly centerX: number;
        readonly centerY: number;

        top: number;
        left: number;
        right: number;
        bottom: number;

        /**
         * Returns a new rect that represent the specified side of this rect.
         * @param side A string referring one of the four side of a rect.
         * @returns A new rect object.
         */
        collapse(side: BoxSide, offset?: number): Rect;

        /**
         * Returns a new rect that has the same size but at a different position.
         * @param x Number of pixels to move in X-axis.
         * @param y Number of pixels to move in Y-axis.
         * @returns A new rect object.
         */
        translate(x: number, y: number): Rect;

        /**
         * Returns a new rect expanded or contracted by the specified pixels from each direction.
         * @param left Number of pixels to expand (contract for negative number) from the left edge.
         * @param top Number of pixels to expand (contract for negative number) from the top edge. If not supplied, this will be equal to `left` parameter.
         * @param right Number of pixels to expand (contract for negative number) from the right edge. If not supplied, this will be equal to `left` parameter.
         * @param bottom Number of pixels to expand (contract for negative number) from the bottom edge. If not supplied, this will be equal to `top` parameter.
         */
        expand(left: number, top?: number, right?: number, bottom?: number): Rect;

        /**
         * Returns a new rect expanded or contracted by the specified pixels from each direction.
         * @param amount An object containing number of pixels to expand (contract for negative number) for each direction.
         * @param factor Optional factor multiplied to value for each direction, default is 1.
         */
        expand(amount: Inset, factor?: number): Rect;
    }

    interface HasRange {
        /**
         * Gets a DOM range represented by or associated with the object.
         */
        getRange(): Range;
    }

    interface HasRect {
        /**
         * Gets a region on screen represented by or associated with the object.
         */
        getRect(): Rect;
    }

    interface HasElement<T = HTMLElement> {
        /**
         * The element represented by or associated with the object.
         */
        readonly element: T;
    }

    interface HasParent {
        readonly parent?: any;
    }

    interface HasParentNode {
        readonly parentNode?: any;
    }

    interface NodeIterator<T> {
        /**
         * Moves the iterator to previous node. If there is no previous node iterable, the iterator will stay on the same node.
         * @returns The previous node, or null if there is no such node.
         */
        previousNode(): T | null;

        /**
         * Moves the iterator to next node. If there is no next node iterable, the iterator will stay on the same node.
         * @returns The next node, or null if there is no such node.
         */
        nextNode(): T | null;
    }

    interface TreeTraverser<T> extends NodeIterator<T> {
        parentNode(): T | null;
        firstChild(): T | null;
        lastChild(): T | null;
        previousSibling(): T | null;
        nextSibling(): T | null;
    }

    interface PointerTracking {
        preventScroll(): void;
    }


    /* --------------------------------------
     * events.js
     * -------------------------------------- */

    type ZetaEventSourceName = 'script' | 'mouse' | 'wheel' | 'keyboard' | 'touch' | 'input' | 'cut' | 'copy' | 'paste' | 'drop';

    type ZetaDOMEventName = HintedString<keyof ZetaDOMEventMap>;

    type ZetaDOMEventMap<T = Element> = { [P in ClickName]: ZetaMouseEvent<T> } & { [P in KeyNameSpecial]: ZetaNativeUIEvent<T> } & { [P in GestureName]: ZetaNativeUIEvent<T> } & {
        asyncStart: ZetaDOMEvent<T>;
        asyncEnd: ZetaDOMEvent<T>;
        cancelled: ZetaDOMEvent<T>;
        focusin: ZetaFocusEvent<T>;
        focusout: ZetaFocusEvent<T>;
        focuschange: ZetaDOMEvent<T>;
        focusreturn: ZetaDOMEvent<T>;
        modalchange: ZetaModalChangeEvent<T>;
        drag: ZetaDragEvent<T>;
        longPress: ZetaTouchEvent<T>;
        touchstart: ZetaTouchEvent<T>;
        mousedown: ZetaPointerEvent<T>;
        mousewheel: ZetaWheelEvent<T>;
        metakeychange: ZetaKeystrokeEvent<T>;
        keystroke: ZetaKeystrokeEvent<T>;
        gesture: ZetaGestureEvent<T>;
        textInput: ZetaTextInputEvent<T>;
        input: ZetaInputEvent<T>;
        error: ZetaErrorEvent<HTMLElement, T>;
        scrollBy: ZetaScrollByEvent<T>;
        getContentRect: ZetaGetContentRectEvent<T>;
    };

    type ZetaEventType<E extends string, M, T = any> = E extends keyof M ?
        M[E] & (M[E] extends ZetaEventContext<T> ? unknown : ZetaEventContext<T>) :
        ZetaEvent<T>;

    type ZetaEventEmitDataType<E extends string, M> = ExtractAny<PropertyTypeOrAny<ZetaEventType<E, M>, 'data'>, Primitive>;
    type ZetaEventInit<E extends string, M> = E extends keyof M ? Partial<M[E]> | ZetaEventEmitDataType<E, M> : ZetaEventGenericInit;
    type ZetaEventGenericInit = ({ [s: string]: any } & Partial<ZetaEvent<any>>) | Primitive;

    type ZetaEventEmitOptionType<E extends string, M> =
        ZetaEventType<E, M> extends ZetaDeferrableEvent<any> ? EventEmitOptions & { deferrable: true } :
        ZetaEventType<E, M> extends ZetaHandleableEvent<any, any> ? EventEmitOptions & { asyncResult: false } :
        boolean | EventEmitOptions;

    type ZetaEventEmitReturnType<E extends string, M> =
        ZetaEventType<E, M> extends ZetaDeferrableEvent<any> ? Promise<void> :
        ZetaEventType<E, M> extends ZetaHandleableEvent<infer R, any> ? R | undefined :
        ZetaEventType<E, M> extends ZetaAsyncHandleableEvent<infer R, any> ? Promise<R> | undefined : any;

    type ZetaEventEmitReturnTypeByOptions<T> =
        T extends { handleable: false } ? void :
        T extends { deferrable: true } ? Promise<void> :
        T extends { asyncResult: false } ? any : Promise<any> | undefined;

    type ZetaEventHandlerReturnType<E extends string, M> =
        ZetaEventType<E, M> extends ZetaHandleableEvent<infer R, any> ? R | undefined | void :
        ZetaEventType<E, M> extends ZetaAsyncHandleableEvent<infer R, any> ? Promise<R> | R | undefined | void : any;

    type ZetaEventHandler<E extends string, M, T = Element> = { bivarianceHack(this: T, e: ZetaEventType<E, M, T>, self: T): ZetaEventHandlerReturnType<E, M> }['bivarianceHack'];

    type ZetaEventHandlers<M, T = Element> = { [P in HintedStringKeyOf<M>]?: P extends keyof M ? ZetaEventHandler<P, M, T> : Zeta.AnyFunction };

    type ZetaDOMEventHandler<E extends string, T = Element> = ZetaEventHandler<E, ZetaDOMEventMap<T>, T>;

    type ZetaDOMEventHandlers<T = Element> = ZetaEventHandlers<ZetaDOMEventMap<T>, T>;

    /** @deprecated */
    type ZetaEventContextBase<T> = ZetaEventContext<T>;

    interface ZetaDelegatedEventTarget<T> extends HasElement<T> {
        readonly θ__dummy_delegated_target: unknown;
    }

    interface ZetaEventContext<T> {
        /**
         * Gets a custom object that represents a functional sub-component.
         */
        readonly context: T;

        /**
         * Gets the HTML element represented by the context object, or the context object itself.
         */
        readonly currentTarget: T extends ZetaDelegatedEventTarget<infer V> ? V : T;
    }

    interface ZetaEventDispatcher<M, T = Element> {
        /**
         * Adds event handlers to multiple events.
         * @param handlers A dictionary which the keys are event names and values are the callback for each event.
         */
        on(handlers: ZetaEventHandlers<M, T>): UnregisterCallback;

        /**
         * Adds an event handler to a specific event.
         * @param event Name of the event.
         * @param handler A callback function to be fired when the specified event is triggered.
         */
        on<E extends StringKeyOf<M>>(event: E, handler: ZetaEventHandler<E, M, T>): UnregisterCallback;

        /**
         * Adds an event handler to a specific event.
         * @param event Name of the event.
         * @param handler A callback function to be fired when the specified event is triggered.
         */
        on<E extends HintedStringKeyOf<M>>(event: E, handler: ZetaEventHandler<WhitespaceDelimited<E>, M, T>): UnregisterCallback;
    }

    interface ZetaEventData<T> {
        /**
         * Gets the event name.
         */
        readonly eventName: string;

        /**
         * Gets the target that received this event.
         */
        readonly target: T;

        /**
         * Gets the user action which triggers this event.
         * If this event is not directly triggered from DOM events, i.e. it is fan out from other components, the value is always script.
         */
        readonly source: ZetaEventSourceName;

        /**
         * Gets the key or key combinations if this event is triggered by keyboard.
         */
        readonly sourceKeyName: KeyNameSingleCharacter | KeyNameSpecial | null;

        /**
         * Gets a high precision timestamp indicating the time at which this event is fired.
         * @see Performance#now
         */
        readonly timestamp: number;

        /**
         * Gets the native DOM event that triggers this event.
         */
        readonly originalEvent: Event | null;

        /**
         * Specifies x-coordinate of a point on screen associated with the event.
         */
        readonly clientX: number | undefined;

        /**
         * Specifies y-coordinate of a point on screen associated with the event.
         */
        readonly clientY: number | undefined;
    }

    interface ZetaEventBase<T = unknown, U = unknown> extends ZetaEventData<Default<T, HTMLElement>>, ZetaEventContext<Default<U, T>> {
        /**
         * Gets the event name.
         * @alias {@link ZetaEventData.eventName}
         */
        readonly type: string;

        /**
         * Gets the data associated with this event.
         */
        readonly data: any;

        /**
         * Suppresses the default behavior by the browser.
         */
        preventDefault(): void;

        /**
         * Gets whether the default behavior by browser is suppressed.
         * @returns true if The the default behavior is suppressed.
         */
        isDefaultPrevented(): boolean;
    }

    interface ZetaDeferrableEvent<T = unknown, U = unknown> extends ZetaEventBase<T, U>, Deferrable {
    }

    interface ZetaHandleableEvent<V = any, T = unknown, U = unknown> extends ZetaEventBase<T, U> {
        /**
         * Signals that this event or user action is already handled and should not be observed by other components.
         * @param value A value for handling.
         */
        handled(value: V): void;

        /**
         * Gets whether this event or user action is already handled.
         * @returns true if handled.
         */
        isHandled(): boolean;

        readonly θ__dummy__handlable: any;
    }

    interface ZetaAsyncHandleableEvent<V = any, T = unknown, U = unknown> extends ZetaEventBase<T, U> {
        /**
         * Signals that this event or user action is already handled and should not be observed by other components.
         * @param promise A value or a promise object for async handling.
         */
        handled(promise?: Promise<V> | V): void;

        /**
         * Gets whether this event or user action is already handled.
         * @returns true if handled.
         */
        isHandled(): boolean;

        readonly θ__dummy__async_handlable: any;
    }

    interface ZetaEvent<T = unknown, U = unknown> extends ZetaAsyncHandleableEvent<any, T, U> {
    }

    interface ZetaErrorEvent<T = unknown, U = unknown> extends ZetaAsyncHandleableEvent<any, T, U> {
        readonly error: any;
    }

    interface ZetaDOMEvent<T = Element> extends ZetaAsyncHandleableEvent<any, HTMLElement, T> {
    }

    interface ZetaNativeUIEvent<T = Element, E extends UIEvent = UIEvent> extends ZetaDOMEvent<T> {
        readonly originalEvent: E;
    }

    interface ZetaFocusEvent<T = Element> extends ZetaEventBase<HTMLElement, T> {
        readonly relatedTarget: HTMLElement;
    }

    interface ZetaModalChangeEvent<T = Element> extends ZetaEventBase<HTMLElement, T> {
        readonly modalElement: Element;
    }

    interface ZetaPointerEvent<T = Element, E extends UIEvent = MouseEvent | TouchEvent> extends ZetaNativeUIEvent<T, E> {
        readonly clientX: number;
        readonly clientY: number;
        readonly metakey: string;
    }

    interface ZetaMouseEvent<T = Element> extends ZetaPointerEvent<T, MouseEvent> {
    }

    interface ZetaTouchEvent<T = Element> extends ZetaPointerEvent<T, TouchEvent> {
    }

    interface ZetaDragEvent<T = Element> extends ZetaPointerEvent<T> {
    }

    interface ZetaWheelEvent<T = Element> extends ZetaNativeUIEvent<T, WheelEvent> {
        readonly clientX: number;
        readonly clientY: number;
        readonly metakey: '' | KeyNameModifier;
        readonly data: -1 | 1;
    }

    interface ZetaKeystrokeEvent<T = Element> extends ZetaNativeUIEvent<T, KeyboardEvent> {
        readonly data: string;
    }

    interface ZetaGestureEvent<T = Element> extends ZetaNativeUIEvent<T, TouchEvent> {
        readonly data: string;
    }

    interface ZetaTextInputEvent<T = Element> extends ZetaNativeUIEvent<T, KeyboardEvent | CompositionEvent | InputEvent> {
        readonly data: string;
    }

    interface ZetaInputEvent<T = Element> extends ZetaNativeUIEvent<T, InputEvent> {
    }

    interface ZetaScrollByEvent<T = Element> extends ZetaHandleableEvent<{ x: number, y: number } | false, HTMLElement, T> {
        readonly x: number;
        readonly y: number;
        readonly behavior: ScrollBehavior;
    }

    interface ZetaGetContentRectEvent<T = Element> extends ZetaHandleableEvent<RectLike, HTMLElement, T> {
    }

    interface ZetaEventSource {
        /**
         * Gets the type of user interaction that triggers the event.
         */
        readonly source: ZetaEventSourceName;
        /**
         * Gets the keystroke that triggers the event, or `null` if the event is not triggered by keyboard.
         */
        readonly sourceKeyName: string | null;
    }

    type EventEmitAlias = import("./events").EventEmitAlias;
    type EventEmitOptions = import("./events").EventEmitOptions;
    type EventContainerOptions<T> = import("./events").EventContainerOptions<T>;

    /* --------------------------------------
     * tree.js
     * -------------------------------------- */

    interface θ__tree_export {
        VirtualNode: import("./tree").VirtualNode;
    }

    type NodeTreeOptions = import("./tree").NodeTreeOptions;
    type TraversableNodeTreeOptions<T> = import("./tree").TraversableNodeTreeOptions<T>;
    type InheritedNodeTreeOptions<T> = import("./tree").InheritedNodeTreeOptions<T>;
    type NodeTreeEventMap<T extends θ__tree_export['VirtualNode']> = import("./tree").NodeTreeEventMap<T>;
    type NodeTreeUpdateEvent<T extends θ__tree_export['VirtualNode']> = import("./tree").NodeTreeUpdateEvent<T>;
    type NodeTreeMutationRecord<T extends θ__tree_export['VirtualNode']> = import("./tree").NodeTreeMutationRecord<T>;
}

// supplement to lib.dom.d.ts

interface Date {
    /**
     * @deprecated
     */
    toGMTString(): string;
}

interface Document {
    createNodeIterator(root: Node, whatToShow?: number, filter?: NodeFilter | null, entityReferenceExpansion?: boolean): NodeIterator;
}
