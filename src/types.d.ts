declare namespace Zeta {

    type RangeLike = Range | Node | HasRange;
    type RectLike = Rect | ClientRect | HasRect;
    type PointLike = Point | Offset | MouseEvent | Touch | JQuery.UIEventBase;
    type ElementLike = Element | HasElement;
    type HtmlContent = string | Node | Node[] | NodeList | JQuery<any> | JQuery.htmlString;

    type DeepReadonly<T> = { readonly [P in keyof T]: DeepReadonly<T[P]> };
    type WatchableInstance<T> = T & Watchable<T>;

    type IteratorNodeFilterResult = 1 | 2 | 3;
    type IteratorNodeFilter<T> = (node: T) => IteratorNodeFilterResult | undefined;
    type MapResultValue<T> = T | T[] | null | undefined;
    type IterateCallbackOrNull<T, R> = null | ((node: T) => MapResultValue<R>);

    type AnyFunction = (...args) => any;
    type AnyConstructor = new (...args) => any;
    type AdditionalMembers<T, U> = { [P in keyof U]: U[P] extends AnyFunction ? (this: T & U, ...args) => any : U[P] };

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

    interface Watchable<T> {
        /**
         * Watches a property on the object.
         * @param prop Property name.
         * @param handler Callback to be fired and the property is changed.
         * @param fireInit Optionally fire the handler immediately.
         */
        watch<P extends keyof T>(prop: P, handler?: (this: T, newValue: T[P], oldValue: T[P], prop: P, obj: T) => void, fireInit?: boolean): void;
        /**
         * Watches a property and resolves when the property is changed.
         * @param prop Property name.
         * @param handler Callback to be fired when the property is changed.
         */
        watchOnce<P extends keyof T>(prop: P, handler?: (this: T, newValue: T[P], oldValue: T[P], prop: P, obj: T) => void): Promise<T[P]>;
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

    interface Iterator<T> {
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

    type Dictionary<T = any> = Record<string, T>;

    type ZetaEventName = 'init' | 'destroy' | 'focusin' | 'focusout' | 'focusreturn' | 'metakeychange' | 'keystroke' | 'typing' | 'textInput' | 'mousedown' | 'mousewheel' | 'asyncStart' | 'asyncEnd' | Zeta.KeyNameSpecial | Zeta.ClickName;

    type ZetaEventSourceName = 'script' | 'mouse' | 'keyboard' | 'touch' | 'input' | 'cut' | 'copy' | 'paste' | 'drop';

    type ZetaEventTypeMap = { [P in Zeta.ClickName]: ZetaMouseEvent } & {
        focusin: ZetaFocusEvent;
        focusout: ZetaFocusEvent;
        mousedown: ZetaMouseEvent;
        mousewheel: ZetaWheelEvent;
        metakeychange: ZetaKeystrokeEvent;
        keystroke: ZetaKeystrokeEvent;
        gesture: ZetaGestureEvent;
        textInput: ZetaTextInputEvent;
    };

    type ZetaEventType<E extends string, M> = (M & { [s: string]: ZetaEvent })[E];

    type ZetaEventHandler<E extends ZetaEvent, T extends ElementLike = Element> = (this: T, e: ZetaEventWithContext<E, T>, self: T) => any;

    type ZetaEventHandler<E extends string, T extends ElementLike = Element> = ZetaEventHandler<ZetaEventType<E, ZetaEventTypeMap>, T>;

    type ZetaEventHandlers<T extends ElementLike = Element> = { [P in ZetaEventName]?: ZetaEventHandler<P, T> };

    type ZetaEventWithContext<E, T> = E & ZetaEventContext<T>;

    interface ZetaEventContext<T> {
        /**
         * Gets a custom object that represents a functional sub-component.
         */
        readonly context: T;
    }

    interface ZetaEvent {
        /**
         * Gets the event name.
         */
        readonly eventName: string;

        /**
         * Gets the event name.
         */
        readonly type: string;

        /**
         * Gets the DOM element that received this event.
         */
        readonly target: HTMLElement;

        /**
         * Gets the user action which triggers this event.
         * If this event is not directly triggered from DOM events, i.e. it is fan out from other components, the value is always script.
         */
        readonly source: ZetaEventSource;

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
         * Signals that this event or user action is already handled and should not be observed by other components.
         * @param [promise] A value or a promise object for async handlng.
         */
        handled(promise?: Promise<any> | any): void;

        /**
         * Gets whether this event or user action is already handled.
         * @returns true if handled.
         */
        isHandled(): boolean;

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

    interface ZetaFocusEvent extends ZetaEvent {
        readonly relatedTarget: HTMLElement;
    }

    interface ZetaMouseEvent extends ZetaEvent {
        readonly clientX: number;
        readonly clientY: number;
        readonly metakey: string;
    }

    interface ZetaWheelEvent extends ZetaEvent {
        readonly data: -1 | 1;
    }

    interface ZetaKeystrokeEvent extends ZetaEvent {
        readonly data: string;
    }

    interface ZetaGestureEvent extends ZetaEvent {
        readonly data: string;
    }

    interface ZetaTextInputEvent extends ZetaEvent {
        readonly data: string;
    }

    interface ZetaEventSource {
        new(target: Element, path?: Element[]);

        readonly path: string;
        readonly source: ZetaEventSourceName;
        sourceKeyName: string;
    }

    interface ZetaContainer<T extends ElementLike = Element> extends HasElement {
        /**
         * Gets the event currently being fired within this container.
         */
        readonly event: (ZetaEvent & ZetaEventContext<T>) | null;

        readonly autoDestroy: boolean;

        /**
         * Registers event handlers to a DOM element.
         * @param element A DOM element.
         * @param handlers An object which each entry represent the handler to be registered on the event.
         * @returns A randomly generated key.
         */
        add(element: Element, handlers: ZetaEventHandlers<T>): string;

        /**
         * Registers event handlers to a DOM element with a specific key.
         * @param element A DOM element.
         * @param key A string to be used as the key.
         * @param handlers An object which each entry represent the handler to be registered on the event.
         * @returns The specified key.
         */
        add(element: Element, key: string, handlers: ZetaEventHandlers<T>): string;

        /**
         * Removes the element from the container.
         * Handlers for destroy event will be fired unless handlers are added back immediately using the same key.
         * @param element A DOM element.
         */
        delete(element: Element): void;

        /**
         * Removes event handlers that is registered using the specified key.
         * Handlers for destroy event registered using the key will be fired unless handlers are added back immediately using the same key.
         * @param element A DOM element.
         * @param key A string to be used as the key.
         */
        delete(element: Element, key: string): void;

        /**
         * Defunct the container. Destroy event will be fired for all registered elements.
         */
        destroy(): void;

        /**
         * Re-emits an event to components.
         * If the event is handled by component, a promise object is returned.
         * @param event An instance of ZetaEvent representing the event to be re-emitted.
         * @param [target] A DOM element which the event should be dispatched on.
         * @param [data] Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
         * @param [bubbles] Specifies whether the event should bubble up through the component tree. Default is true.
         */
        emit(event: ZetaEvent, target?: Element, data?: any, bubbles?: boolean): Promise<any> | false;

        /**
         * Emits an event to components synchronously.
         * If the event is handled by component, a promise object is returned.
         * @param eventName Event name.
         * @param [target] A DOM element which the event should be dispatched on.
         * @param [data] Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
         * @param [bubbles] Specifies whether the event should bubble up through the component tree. Default is true.
         */
        emit(eventName: string, target?: Element, data?: any, bubbles?: boolean): Promise<any> | false;

        /**
         * Emits an event to components asynchronously.
         * @param eventName Event name.
         * @param [target] A DOM element which the event should be dispatched on.
         * @param [data] Any data to be set on ZetaEvent#data property. If an object is given, the properties will be copied to the ZetaEvent object during dispatch.
         * @param [bubbles] Specifies whether the event should bubble up through the component tree. Default is true.
         * @param [mergeData] A callback to aggregates data from the previous undispatched event of the same name on the same target.
         */
        emitAsync(eventName: string, target?: Element, data?: any, bubbles?: boolean, mergeData?: (v, a) => any): void;

        /**
         * Gets the custom object that represents the given element,
         * @param element A DOM element.
         */
        getContext(element: Element): T;

        /**
         * Defines a custom object that represents a DOM component.
         * @param element A DOM element.
         * @param context Any object that has the property "element" pointing to the same DOM element.
         */
        setContext(element: Element, context: T): void;

        /**
         * Listens DOM mutations in this container.
         * Mutations from nested containers will not be propagated to parent containers.
         * @param callback A callback to be fired asynchronously when there are changes.
         * @param options An object specifying which types of mutations shuold be included.
         */
        observe(callback: (mutations: MutationRecord[]) => any, options: MutationObserverInit): void;

        /**
         * Adds a handler to intercept event being fired within this container.
         * @param handler An event handler.
         */
        tap(handler: ZetaEventHandler<ZetaEvent, ZetaContainer>): void;

        /**
         * Fire scheduled asynchronous events immediately.
         */
        flushEvents(): void;
    }

    interface ZetaComponentConstructor {
        new (): ZetaComponent;
        (): ZetaComponent;
    }

    interface ZetaComponent {
        readonly states: Dictionary<ZetaEventHandlers>;
        element: Element;
        context: any;
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
