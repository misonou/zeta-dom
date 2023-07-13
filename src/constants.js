/**
 *  Key code mapping for keyboard events.
 */
export const KEYNAMES = {
    8: 'backspace',
    9: 'tab',
    13: 'enter',
    16: 'shift',
    17: 'ctrl',
    18: 'alt',
    19: 'pause',
    20: 'capsLock',
    27: 'escape',
    32: 'space',
    33: 'pageUp',
    34: 'pageDown',
    35: 'end',
    36: 'home',
    37: 'leftArrow',
    38: 'upArrow',
    39: 'rightArrow',
    40: 'downArrow',
    45: 'insert',
    46: 'delete',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'leftWindow',
    92: 'rightWindowKey',
    93: 'select',
    96: 'numpad0',
    97: 'numpad1',
    98: 'numpad2',
    99: 'numpad3',
    100: 'numpad4',
    101: 'numpad5',
    102: 'numpad6',
    103: 'numpad7',
    104: 'numpad8',
    105: 'numpad9',
    106: 'multiply',
    107: 'add',
    109: 'subtract',
    110: 'decimalPoint',
    111: 'divide',
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12',
    144: 'numLock',
    145: 'scrollLock',
    186: 'semiColon',
    187: 'equalSign',
    188: 'comma',
    189: 'dash',
    190: 'period',
    191: 'forwardSlash',
    192: 'backtick',
    219: 'openBracket',
    220: 'backSlash',
    221: 'closeBracket',
    222: 'singleQuote'
};

'1234567890'.split('').forEach(function (v) {
    KEYNAMES['Digit' + v] = v;
    KEYNAMES['Numpad' + v] = 'numpad' + v;
});
'abcdefghijklmnopqrstuvwxyz'.split('').forEach(function (v) {
    KEYNAMES['Key' + v.toUpperCase()] = v;
});

const map = {
    ShiftLeft: 16,       // shift
    ShiftRight: 16,      // shift
    ControlLeft: 17,     // ctrl
    ControlRight: 17,    // ctrl
    AltLeft: 18,         // alt
    AltRight: 18,        // alt
    ArrowLeft: 37,       // leftArrow
    ArrowUp: 38,         // upArrow
    ArrowRight: 39,      // rightArrow
    ArrowDown: 40,       // downArrow
    OSLeft: 91,          // leftWindow
    OSRight: 92,         // rightWindowKey
    ContextMenu: 93,     // select
    NumpadMultiply: 106, // multiply
    NumpadAdd: 107,      // add
    NumpadSubtract: 109, // subtract
    NumpadDecimal: 110,  // decimalPoint
    NumpadDivide: 111,   // divide
    Semicolon: 186,      // semiColon
    Equal: 187,          // equalSign
    Minus: 189,          // dash
    Slash: 191,          // forwardSlash
    Backquote: 192,      // backtick
    BracketLeft: 219,    // openBracket
    BracketRight: 221,   // closeBracket
    Quote: 222           // singleQuote
};
for (var i in map) {
    KEYNAMES[i] = KEYNAMES[map[i]];
}

[
    8,   // backspace
    9,   // tab
    13,  // enter
    19,  // pause
    20,  // capsLock
    27,  // escape
    32,  // space
    33,  // pageUp
    34,  // pageDown
    35,  // end
    36,  // home
    45,  // insert
    46,  // delete
    144, // numLock
    145, // scrollLock
    188, // comma
    190, // period
    220, // backSlash
    112, // f1
    113, // f2
    114, // f3
    115, // f4
    116, // f5
    117, // f6
    118, // f7
    119, // f8
    120, // f9
    121, // f10
    122, // f11
    123  // f12
].forEach(function (v) {
    v = KEYNAMES[v];
    KEYNAMES[v[0].toUpperCase() + v.slice(1)] = v;
});
