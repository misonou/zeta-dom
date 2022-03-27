declare namespace Zeta {

    type RangeLike = Range | Node | HasRange;
    type RectLike = Rect | ClientRect | HasRect;
    type PointLike = Point | Offset | MouseEvent | Touch | JQuery.UIEventBase;
    type ElementLike = Element | HasElement;
    type HtmlContent = string | Node | Node[] | NodeList | JQuery<any> | JQuery.htmlString;

    type Dictionary<T = any> = Record<string, T>;
    type ArrayMember<T> = { [P in Extract<keyof T, number>]: T[P] }[Extract<keyof T, number>];
    type KeyOf<T> = T extends (any[] | ArrayLike<any>) ? number :
        T extends Map<infer K, any> ? K :
        T extends Set<infer V> ? V :
        T extends object ? Exclude<keyof T, symbol> : never;
    type ValueOf<T> = T extends (any[] | ArrayLike<any>) ? ArrayMember<T> :
        T extends Map<any, infer V> ? V :
        T extends Set<infer V> ? V :
        T extends object ? T[Exclude<keyof T, symbol>] : never;
    type WhitespaceDelimited<T extends string> = T extends `${infer L} ${infer R}` ? Exclude<L, ''> | WhitespaceDelimited<R> : Exclude<T, ''>;
    type DeepReadonly<T> = T extends number | string | boolean | symbol | undefined | null ? T : T extends (infer V)[] ? readonly V[] : { readonly [P in keyof T]: DeepReadonly<T[P]> };
    type PromiseResult<T> = T extends PromiseLike<infer U> ? PromiseResult<U> : T;
    type WatchableInstance<T, K = keyof T> = T & Watchable<T, K>;

    type IteratorNodeFilterResult = 1 | 2 | 3;
    type IteratorNodeFilter<T> = (node: T) => IteratorNodeFilterResult | undefined;
    type MapResultValue<T> = T | T[] | null | undefined;
    type IterateCallbackOrNull<T, R> = null | ((node: T) => MapResultValue<R>);

    type AnyFunction = (...args) => any;
    type AnyConstructor = new (...args) => any;
    type AdditionalMembers<T, U> = { [P in keyof U]: U[P] extends AnyFunction ? (this: T & U, ...args) => any : U[P] };

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

    type DOMEventNames =
        keyof AbortSignalEventMap |
        keyof AbstractWorkerEventMap |
        keyof AnimationEventMap |
        keyof AudioScheduledSourceNodeEventMap |
        keyof AudioWorkletNodeEventMap |
        keyof BaseAudioContextEventMap |
        keyof BroadcastChannelEventMap |
        keyof DocumentEventMap |
        keyof DocumentAndElementEventHandlersEventMap |
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
    type DOMEventType<T extends EventTarget, K extends string> = T extends DOMEventIDLProp<K, infer E> ? E : never;
    type DOMEventsOf<T extends EventTarget> = ({ [K in DOMEventNames]: T extends DOMEventIDLProp<K, any> ? K : never })[DOMEventNames];

    type Direction = 'left' | 'top' | 'right' | 'bottom';
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
    type ClickName = 'click' | 'rightClick' | 'doubleClick' | 'ctrlClick' | 'shiftClick' | 'altClick' | 'ctrlShiftClick' | 'ctrlAltClick' | 'altShiftClick' | 'ctrlAltShiftClick';
    type GestureName = 'swipeUp' | 'swipeDown' | 'swipeLeft' | 'swipeRight' | 'pinchZoom';

    interface Watchable<T, K = keyof T> {
        /**
         * Watches a property on the object.
         * @param prop Property name.
         * @param handler Callback to be fired and the property is changed.
         * @param fireInit Optionally fire the handler immediately.
         */
        watch<P extends K>(prop: P, handler?: (this: T, newValue: T[P], oldValue: T[P], prop: P, obj: T) => void, fireInit?: boolean): Zeta.UnregisterCallback;
        /**
         * Watches a property and resolves when the property is changed.
         * @param prop Property name.
         * @param handler Callback to be fired when the property is changed.
         */
        watchOnce<P extends K>(prop: P, handler?: (this: T, newValue: T[P], oldValue: T[P], prop: P, obj: T) => void): Promise<T[P]>;
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
        collapse(side: Direction, offset?: number): Rect;

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

    interface HasElement {
        /**
         * The element represented by or associated with the object.
         */
        readonly element: HTMLElement;
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


    /* --------------------------------------
     * events.js
     * -------------------------------------- */

    type ZetaEventSourceName = 'script' | 'mouse' | 'keyboard' | 'touch' | 'input' | 'cut' | 'copy' | 'paste' | 'drop';

    type ZetaDOMEventName = keyof ZetaDOMEventMap | KeyNameSpecial | ClickName | GestureName | 'focusreturn' | 'modalchange' | 'asyncStart' | 'asyncEnd' | 'cancelled';

    type ZetaDOMEventMap = { [P in ClickName]: ZetaMouseEvent } & ZetaCustomEventMap & {
        focusin: ZetaFocusEvent;
        focusout: ZetaFocusEvent;
        drag: ZetaMouseEvent;
        longPress: ZetaMouseEvent;
        mousedown: ZetaMouseEvent;
        mousewheel: ZetaWheelEvent;
        metakeychange: ZetaKeystrokeEvent;
        keystroke: ZetaKeystrokeEvent;
        gesture: ZetaGestureEvent;
        textInput: ZetaTextInputEvent;
        error: ZetaErrorEvent;
        scrollBy: ZetaScrollByEvent;
        getContentRect: ZetaGetContentRectEvent;
    };

    type ZetaEventType<E extends string, M> = (M & { [s: string]: ZetaEvent })[E];

    type ZetaEventHandlerReturnType<T> = T extends ZetaAsyncHandleableEvent<infer R> ? Promise<R> | R : T extends ZetaHandleableEvent<infer R> ? R : any

    type ZetaEventHandler<E extends string, M = {}, T = Element> = (this: T, e: ZetaEventType<E, M> & ZetaEventContext<T>, self: T) => ZetaEventHandlerReturnType<ZetaEventType<E, M>> | void;

    type ZetaEventHandlers<E extends string, M = {}, T = Element> = { [P in E]?: ZetaEventHandler<P, M, T> };

    type ZetaEventContext<T> = T extends ZetaEventContextBase<any> ? T : ZetaEventContextBase<T>;

    interface ZetaCustomEventMap {
    }

    interface ZetaEventContextBase<T> {
        /**
         * Gets a custom object that represents a functional sub-component.
         */
        readonly context: T;

        readonly θ__dummy__: any;
    }

    interface ZetaEventDispatcher<M, T = Element> {
        /**
         * Adds an event handler to a specific event.
         * @param event Name of the event.
         * @param handler A callback function to be fired when the specified event is triggered.
         */
        on<E extends keyof M>(event: E, handler: ZetaEventHandler<E, M, T>);

        /**
         * Adds an event handler to a specific event on the given target.
         * @param event Name of the event.
         * @param handler A callback function to be fired when the specified event is triggered.
         */
        on<E extends keyof M>(target: T, event: E, handler: ZetaEventHandler<E, M, T>);

        /**
         * Adds event handlers to multiple events.
         * @param handlers A dictionary which the keys are event names and values are the callback for each event.
         */
        on(handlers: ZetaEventHandlers<keyof M, M, T>);

        /**
         * Adds event handlers to multiple events on the given target.
         * @param handlers A dictionary which the keys are event names and values are the callback for each event.
         */
        on(target: T, handlers: ZetaEventHandlers<keyof M, M, T>);
    }

    interface ZetaEventBase {
        /**
         * Gets the event name.
         */
        readonly eventName: string;

        /**
         * Gets the event name.
         */
        readonly type: string;

        /**
         * Gets the DOM element that triggered this event.
         */
        readonly target: HTMLElement;

        /**
         * Gets the DOM element which current event handler is bound to.
         */
        readonly currentTarget: HTMLElement;

        /**
         * Gets the user action which triggers this event.
         * If this event is not directly triggered from DOM events, i.e. it is fan out from other components, the value is always script.
         */
        readonly source: ZetaEventSourceName;

        /**
         * Gets the key or key combinations if this event is triggered by keyboard.
         */
        readonly sourceKeyName: KeyNameSingleCharacter | KeyNameSpecial;

        /**
         * Gets the data associated with this event.
         */
        readonly data: any;

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
         * Suppresses the default behavior by the browser.
         */
        preventDefault(): void;

        /**
         * Gets whether the default behavior by browser is suppressed.
         * @returns true if The the default behavior is suppressed.
         */
        isDefaultPrevented(): boolean;
    }

    interface ZetaHandleableEvent<T = any> extends ZetaEventBase {
        /**
         * Signals that this event or user action is already handled and should not be observed by other components.
         * @param value A value for handling.
         */
        handled(value: T): void;

        /**
         * Gets whether this event or user action is already handled.
         * @returns true if handled.
         */
        isHandled(): boolean;
    }

    interface ZetaAsyncHandleableEvent<T = any> extends ZetaEventBase {
        /**
         * Signals that this event or user action is already handled and should not be observed by other components.
         * @param promise A value or a promise object for async handling.
         */
        handled(promise?: Promise<T> | T): void;

        /**
         * Gets whether this event or user action is already handled.
         * @returns true if handled.
         */
        isHandled(): boolean;
    }

    interface ZetaEvent extends ZetaAsyncHandleableEvent {
    }

    interface ZetaNativeUIEvent extends ZetaAsyncHandleableEvent {
    }

    interface ZetaFocusEvent extends ZetaEventBase {
        readonly relatedTarget: HTMLElement;
    }

    interface ZetaMouseEvent extends ZetaNativeUIEvent {
        readonly clientX: number;
        readonly clientY: number;
        readonly metakey: string;
    }

    interface ZetaWheelEvent extends ZetaNativeUIEvent {
        readonly data: -1 | 1;
    }

    interface ZetaKeystrokeEvent extends ZetaNativeUIEvent {
        readonly data: string;
    }

    interface ZetaGestureEvent extends ZetaNativeUIEvent {
        readonly data: string;
    }

    interface ZetaTextInputEvent extends ZetaNativeUIEvent {
        readonly data: string;
    }

    interface ZetaErrorEvent extends ZetaAsyncHandleableEvent {
        readonly error: any;
    }

    interface ZetaScrollByEvent extends ZetaHandleableEvent<{ x: number, y: number } | false> {
        readonly x: number;
        readonly y: number;
    }

    interface ZetaGetContentRectEvent extends ZetaHandleableEvent<RectLike> {
    }

    declare class ZetaEventSource {
        constructor(target: Element, path?: Element[]);

        readonly path: string;
        readonly source: ZetaEventSourceName;
        sourceKeyName: string;
    }

    interface EventEmitOptions {
        /**
         * Specifies x-coordinate of a point on screen associated with the event.
         * If specified, only elements at the point will receive the event.
         */
        clientX?: number;

        /**
         * Specifies y-coordinate of a point on screen associated with the event.
         * If specified, only elements at the point will receive the event.
         */
        clientY?: number;

        /**
         * Specifies if the event should bubble up.
         * Default is false.
         */
        bubbles?: boolean;

        /**
         * Specifies whether the event can be handled, such that by returning a result value,
         * subsequent event handlers would be skipped and the returned value will be passed to
         * the caller of the emit function. Default is true.
         */
        handleable?: boolean;

        /**
         * Specifies if the emit function should wrap the return value from event handlers as a Promise.
         * Default is true.
         */
        asyncResult?: boolean;

        /**
         * Specifies the event source that controls how the event should bubble up, as well as
         * the `source` and `sourceKeyName` properties of the event object that would be passed
         * to event handlers.
         */
        source?: Zeta.ZetaEventSource;

        /**
         * Provides a native Event object the event is associated with.
         */
        originalEvent?: Event;
    };

    interface EventContainerOptions<T> {
        /**
         * Sets whether all event handlers are automatically removed when the root element is detached.
         */
        autoDestroy?: boolean;

        /**
         * Sets whether successive touchstart and touchend events without touchmove will be normalized to click event.
         */
        normalizeTouchEvents?: boolean;

        /**
         * Sets whether DOM events will be captured.
         * If yes, DOM events will be dispatched to registered components within this container in prior to global event handlers registered by `dom.on`.
         */
        captureDOMEvents?: boolean;

        /**
         * Process event object before event is dispatched to handlers registered on this container.
         */
        initEvent?: (e: ZetaEventBase & ZetaEventContext<T>) => void;
    }

    declare class ZetaEventContainer<T = Element, M = ZetaDOMEventMap> implements HasElement {
        /**
         * Createa a new event container for listening or dispatching events.
         * @param root A DOM element of which DOM events fired on descedant elements will be captured.
         * @param context An object to be exposed through `dom.context` if the `captureDOMEvents` option is set to `true`.
         * @param options A dictionary containing options specifying the behavior of the container.
         */
        constructor(root?: Element, context?: any, options?: EventContainerOptions<T>);

        /**
         * Gets the root element this container associates with.
         */
        readonly element: HTMLElement;

        /**
         * Gets the public interfacing object exposed through `dom.context` if the `captureDOMEvents` option is set to `true`.
         */
        readonly context: any;

        /**
         * Gets the event currently being fired within this container.
         */
        readonly event: ZetaEventBase & ZetaEventContext<T> | null;

        /**
         * Gets whether all event handlers are automatically removed when the root element is detached.
         */
        readonly autoDestroy: boolean;

        /**
         * Gets whether successive touchstart and touchend events without touchmove will be normalized to click event.
         */
        readonly normalizeTouchEvents: boolean;

        /**
         * Gets whether DOM events will be captured.
         */
        readonly captureDOMEvents: boolean;

        /**
         * Gets context object associated with the event target.
         * @param target An event target, typically a DOM element.
         */
        getContexts(target: T): (T extends ZetaEventContextBase<infer R> ? R : T)[];

        /**
         * Registers event handlers to a DOM element or a custom event target.
         * @param target An event target.
         * @param handlers An object which each entry represent the handler to be registered on the event.
         * @returns A function that will unregister the handler when called.
         */
        add(target: T, handlers: ZetaEventHandlers<keyof M, M, T>): UnregisterCallback;

        /**
         * Registers event handlers to a DOM element or a custom event target.
         * @param target An event target.
         * @param event Name of the event.
         * @param handler A callback function to be fired when the specified event is triggered.
         * @returns A function that will unregister the handlers when called.
         */
        add<E extends keyof M>(target: T, event: E, handlers: ZetaEventHandler<E, M, T>): UnregisterCallback;

        /**
         * Removes the DOM element or custom event target from the container.
         * All event handlers are also removed.
         * @param target An event target.
         */
        delete(target: T): void;

        /**
         * Defunct the container. Destroy event will be fired for all registered elements.
         */
        destroy(): void;

        /**
         * Re-emits an event to components.
         * If the event is handled by component, a promise object is returned.
         * @param event An instance of ZetaEvent representing the event to be re-emitted.
         * @param target A DOM element which the event should be dispatched on.
         * @param data Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
         * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
         */
        emit(event: ZetaEventBase, target?: T, data?: any, options?: boolean | EventEmitOptions): any;

        /**
         * Emits an event to components synchronously.
         * If the event is handled by component, a promise object is returned.
         * @param eventName Event name.
         * @param target A DOM element which the event should be dispatched on.
         * @param data Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
         * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
         */
        emit<E extends keyof M>(eventName: E, target?: T, data?: any, options?: boolean | EventEmitOptions): any;

        /**
         * Emits an event to components asynchronously.
         * @param eventName Event name.
         * @param target A DOM element which the event should be dispatched on.
         * @param data Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
         * @param options Specifies how the event should be emitted. If boolean is given, it specified fills the `bubbles` option.
         * @param mergeData A callback to aggregates data from the previous undispatched event of the same name on the same target.
         */
        emitAsync<E extends keyof M, V = any>(eventName: E, target?: T, data?: V, options?: boolean | EventEmitOptions, mergeData?: (v: V, a: V) => V): void;

        /**
         * Adds a handler to intercept event being fired within this container.
         * @param handler An event handler.
         */
        tap(handler: ZetaEventHandler<'tap', {}, ZetaEventContainer>): void;

        /**
         * Fire scheduled asynchronous events immediately.
         */
        flushEvents(): void;
    }

    /* --------------------------------------
     * tree.js
     * -------------------------------------- */

    interface NodeTreeOptions {
        /**
         * If supplied, new element matching the selector will have its
         * correspoding virtual nodes created.
         */
        selector?: string
    }

    interface TraversableNodeTreeOptions<T> extends NodeTreeOptions {
    }

    interface InheritedNodeTreeOptions<T> extends NodeTreeOptions {
    }

    interface NodeTreeEventMap<T extends VirtualNode> {
        update: NodeTreeUpdateEvent<T>;
    }

    interface NodeTreeUpdateEvent<T extends VirtualNode> extends ZetaEventBase {
        /**
         * @deprecated Use `records` property instead.
         */
        readonly updatedNodes: T[];
        readonly records: NodeTreeMutationRecord<T>[];
    }

    interface NodeTreeMutationRecord<T extends VirtualNode> {
        /**
         * Gets the node that has been removed or relocated as child or sibling of other nodes.
         */
        readonly node: T;

        /**
         * Gets the original parent node before mutation.
         */
        readonly parentNode: T | null;

        /**
         * Gets the original previous sibling before mutation.
         */
        readonly previousSilbing: T | null;

        /**
         * Gets the original next sibiling before mutation.
         */
        readonly nextSibling: T | null;
    }

    declare abstract class NodeTree<T extends VirtualNode> implements ZetaEventDispatcher<NodeTreeEventMap<T>, NodeTree<T>>, HasElement {
        readonly element: Element;
        readonly rootNode: T;

        getNode(element: Element): T | null;
        setNode(element: Element): T;
        removeNode(node: T): void;
        update(): void;

        on<E extends keyof NodeTreeEventMap<T>>(event: E, handler: ZetaEventHandler<E, NodeTreeEventMap<T>, NodeTree<T>>): Zeta.UnregisterCallback;
        on<E extends keyof NodeTreeEventMap<T>>(tree: NodeTree<T>, event: E, handler: ZetaEventHandler<E, NodeTreeEventMap<T>, NodeTree<T>>): Zeta.UnregisterCallback;
        on(handler: ZetaEventHandlers<keyof NodeTreeEventMap<T>, NodeTreeEventMap<T>, NodeTree<T>>): Zeta.UnregisterCallback;
        on(tree: NodeTree<T>, handler: ZetaEventHandlers<keyof NodeTreeEventMap<T>, NodeTreeEventMap<T>, NodeTree<T>>): Zeta.UnregisterCallback;
    }

    declare class TraversableNodeTree<T extends TraversableNode> extends NodeTree<T> {
        constructor(element: Element, constructor?: new (...args) => T, options?: TraversableNodeTreeOptions<T>);
        constructor(element: Element, constructor?: Zeta.AnyConstructor, options?: TraversableNodeTreeOptions<T>);

        isNodeVisible(node: T, iterator: TreeWalker<T>): boolean;
        acceptNode(node: T, iterator: TreeWalker<T>): IteratorNodeFilterResult;
    }

    declare class InheritedNodeTree<T extends InheritedNode> extends NodeTree<T> {
        constructor(element: Element, constructor?: new (...args) => T, options?: InheritedNodeTreeOptions<T>);
        constructor(element: Element, constructor?: Zeta.AnyConstructor, options?: InheritedNodeTreeOptions<T>);

        descendants(node: T | Element): Iterator<T>;
    }

    declare abstract class VirtualNode implements HasElement {
        readonly element: HTMLElement;
    }

    declare class TraversableNode extends VirtualNode {
        constructor(tree: NodeTree, element: Element);

        readonly parentNode: TraversableNode | null;
        readonly firstChild: TraversableNode | null;
        readonly lastChild: TraversableNode | null;
        readonly previousSibling: TraversableNode | null;
        readonly nextSibling: TraversableNode | null;
        readonly childNodes: TraversableNode[];
    }

    declare class InheritedNode extends VirtualNode {
        constructor(tree: NodeTree, element: Element);
    }

    declare class TreeWalker<T extends TraversableNode> implements NodeIterator<T> {
        constructor(root: T, whatToShow?: number, filter?: IteratorNodeFilter<T>);

        readonly root: T;
        readonly whatToShow: number;
        readonly filter: IteratorNodeFilter<T>;

        currentNode: T;

        nextNode(): T | null;
        previousNode(): T | null;
        parentNode(): T | null;
        firstChild(): T | null;
        lastChild(): T | null;
        previousSibling(): T | null;
        nextSibling(): T | null;
    }
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
