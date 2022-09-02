import { defineHiddenProperty } from "./util.js";

const ZETA_KEY = '__ZETA__';
if (window[ZETA_KEY]) {
    throw new Error('Another copy of zeta-dom is instantiated. Please check your dependencies.');
}
defineHiddenProperty(window, ZETA_KEY, true, true);

export default null;
