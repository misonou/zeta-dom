import * as _domUtil from "./domUtil";
import * as _util from "./util";

export * from "./env";
export * as shim from "./shim";
export var util: typeof _util & typeof _domUtil;
export { default as dom } from "./dom";
export * as css from "./cssUtil";
export { ZetaEventContainer as EventContainer } from "./events";
export * from "./tree";

export as namespace zeta;
