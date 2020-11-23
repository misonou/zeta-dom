import * as _domUtil from "./domUtil";
import * as _util from "./util";

export { IS_IOS, IS_IE10, IS_IE, IS_MAC, IS_TOUCH } from "./env";
export * as shim from "./shim";
export var util: typeof _util & typeof _domUtil;
export { default as dom } from "./dom";
export * as css from "./cssUtil";
export { ZetaEventContainer as EventContainer } from "./events";
export * from "./tree";

export as namespace zeta;
