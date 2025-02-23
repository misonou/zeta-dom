import { IS_IOS, IS_IE10, IS_IE, IS_MAC, IS_TOUCH } from "./env.js";
import * as ErrorCode from "./errorCode.js";
import * as _util from "./util.js";
import * as _domUtil from "./domUtil.js";
import * as cssUtil from "./cssUtil.js";
import { CancellationRequest } from "./domLock.js";
import { ZetaEventContainer, ZetaEventSource } from "./events.js";
import { InheritedNode, InheritedNodeTree, TraversableNode, TraversableNodeTree, TreeWalker } from "./tree.js";
import dom from "./dom.js";

const util = _util.extend({}, _util, _domUtil);

export default {
    IS_IOS,
    IS_IE10,
    IS_IE,
    IS_MAC,
    IS_TOUCH,
    util,
    dom,
    css: cssUtil,
    ErrorCode,
    EventContainer: ZetaEventContainer,
    EventSource: ZetaEventSource,
    CancellationRequest,
    InheritedNode,
    InheritedNodeTree,
    TraversableNode,
    TraversableNodeTree,
    TreeWalker
};

export {
    IS_IOS,
    IS_IE10,
    IS_IE,
    IS_MAC,
    IS_TOUCH,
    util,
    dom,
    cssUtil as css,
    ErrorCode,
    ZetaEventContainer as EventContainer,
    ZetaEventSource as EventSource,
    CancellationRequest,
    InheritedNode,
    InheritedNodeTree,
    TraversableNode,
    TraversableNodeTree,
    TreeWalker
};
