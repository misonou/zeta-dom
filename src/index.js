import * as env from "./env.js";
import * as shim from "./shim.js";
import * as _util from "./util.js";
import * as _domUtil from "./domUtil.js";
import * as cssUtil from "./cssUtil.js";
import dom from "./dom.js";

const IS_IOS = env.IS_IOS;
const IS_IE10 = env.IS_IE10;
const IS_IE = env.IS_IE;
const IS_MAC = env.IS_MAC;
const IS_TOUCH = env.IS_TOUCH;
const util = { ..._util, ..._domUtil };

export default {
    IS_IOS,
    IS_IE10,
    IS_IE,
    IS_MAC,
    IS_TOUCH,
    shim,
    util,
    dom,
    css: cssUtil
};

export {
    IS_IOS,
    IS_IE10,
    IS_IE,
    IS_MAC,
    IS_TOUCH,
    shim,
    util,
    dom,
    cssUtil as css
};
