import { defineHiddenProperty, throws } from "./util.js";

const ZETA_KEY = '__ZETA__';
if (window[ZETA_KEY]) {
    throws('Another copy of zeta-dom is instantiated. Please check your dependencies.');
}
defineHiddenProperty(window, ZETA_KEY, true, true);

export default null;
