import syn from "syn";
import dom, { focusable, iterateFocusPath, releaseModal, reportError, setModal, textInputAllowed } from "../src/dom";
import { bind, removeNode } from "../src/domUtil";
import { domReady } from "../src/env";
import { ZetaEventContainer } from "../src/events";
import { after, body, initBody, mockFn, root, verifyCalls, _, bindEvent, cleanup, fireEventAsTrusted } from "./testUtil";
import { delay, makeArray, map, pipe } from "../src/util";

async function type(elm, keystroke) {
    await after(() => {
        dom.focus(elm);
        // @ts-ignore: unable to infer dynamically created method
        syn.type(elm, keystroke);
    });
}

const { objectContaining } = expect;

beforeAll(async () => {
    await domReady;
});

describe('activeElement', () => {
    it('should return body as initial focused element', async () => {
        expect(dom.activeElement).toBe(body);
    });

    it('should return current focused element', async () => {
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        expect(dom.activeElement).toBe(button);
    });

    it('should not return detached element', async () => {
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        removeNode(button);
        expect(dom.activeElement).toBe(body);
    });
});

describe('focusedElements', () => {
    it('should return current focused element and its parents', () => {
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        expect(dom.focusedElements).toEqual([button, body, root]);
    });

    it('should not return detached element', () => {
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        removeNode(button);
        expect(dom.focusedElements).toEqual([body, root]);
    });

    it('should exclude elements that is not descandents of modal element', () => {
        const { modal } = initBody(`
            <div id="modal">
                <button id="button"></button>
            </div>
        `);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([modal, root]);
    });
});

describe('modalElement', () => {
    it('should not return detached element', () => {
        const { modal1, modal2 } = initBody(`
            <div id="modal1"></div>
            <div id="modal2"></div>
        `);
        dom.retainFocus(modal1, modal2);
        dom.setModal(modal1);
        dom.setModal(modal2);
        expect(dom.modalElement).toBe(modal2);
        removeNode(modal2);
        expect(dom.modalElement).toBe(modal1);
        removeNode(modal1);
        expect(dom.modalElement).toBeNull();
    });
});

describe('context', () => {
    it('should be null initially', () => {
        expect(dom.context).toBeNull();
    });

    it('should return context object of current DOM event capturing container', () => {
        const { treeRoot, button } = initBody(`
            <div id="treeRoot">
                <button id="button"></button>
            </div>
        `);
        const context = {};
        new ZetaEventContainer(treeRoot, context, {
            captureDOMEvents: true
        });
        button.focus();
        expect(dom.context).toBe(context);
    });
});

describe('reportError', () => {
    it('should raise error event bubbling up to parent elements', () => {
        const { parent, button } = initBody(`
            <div id="parent">
                <button id="button"></button>
            </div>
        `);
        const cb = mockFn();
        const error = new Error();
        bindEvent(button, 'error', cb);
        bindEvent(parent, 'error', cb);
        bindEvent(root, 'error', cb);
        expect(reportError(error, button)).toBeUndefined();

        verifyCalls(cb, [
            [objectContaining({ error }), button],
            [objectContaining({ error }), parent],
            [objectContaining({ error }), root],
        ]);
    });

    it('should return promise if error is handled', async () => {
        const { button } = initBody(`
            <button id="button"></button>
        `);
        bindEvent(button, 'error', () => 42);
        await expect(reportError(new Error(), button)).resolves.toBe(42);
    });

    it('should trigger error event on window if error is not handled', () => {
        const cb = mockFn();
        const error = new Error();
        cleanup(bind(window, 'error', cb));
        reportError(error);
        verifyCalls(cb, [
            [objectContaining({ error })]
        ]);
    });
});

describe('focusable', () => {
    it('should return false if element is blocked by modal element', () => {
        const { modal, other } = initBody(`
            <div id="modal"></div>
            <div id="other"></div>
        `);
        dom.setModal(modal);
        expect(dom.focusable(other)).toBe(false);
    });

    it('should return false if element is detached', () => {
        const div = document.createElement('div');
        expect(dom.focusable(div)).toBe(false);

        dom.retainFocus(body, div);
        expect(dom.focusable(div)).toBe(false);
    });

    it('should return true if element is a descandent of a fixed positioned element not blocked by modal element', () => {
        const { modal, other1, child1, other2, child2 } = initBody(`
            <div id="modal"></div>
            <div id="other1" style="position: fixed">
                <div id="child1"></div>
            </div>
            <div id="other2" style="position: fixed">
                <div id="child2"></div>
            </div>
        `);
        dom.focus(child2);
        dom.setModal(modal);
        expect(dom.focusable(other1)).toBeTruthy();
        expect(dom.focusable(child1)).toBeTruthy();
        expect(dom.focusable(other2)).toBe(false);
        expect(dom.focusable(child2)).toBe(false);
    });
});

describe('blur', () => {
    it('should not change focus if given element is not focused', () => {
        const { button1, button2 } = initBody(`
            <button id="button1"></button>
            <button id="button2"></button>
        `);
        dom.focus(button1);
        expect(dom.activeElement).toBe(button1);

        expect(dom.blur(button2)).toBe(true);
        expect(dom.activeElement).toBe(button1);
    });

    it('should not change focus if given element is detached', () => {
        const { button } = initBody(`
            <button id="button"></button>
        `);
        dom.focus(button);
        expect(dom.activeElement).toBe(button);

        expect(dom.blur(document.createElement('div'))).toBe(true);
        expect(dom.activeElement).toBe(button);
    });

    it('should set focus to parent element', () => {
        const { parent, button } = initBody(`
            <div id="parent">
                <button id="button"></button>
            </div>
        `);
        dom.focus(button);
        expect(dom.activeElement).toBe(button);

        expect(dom.blur(button)).toBe(true);
        expect(dom.activeElement).toBe(parent);
    });

    it('should set focus to parent element', () => {
        const { parent, button } = initBody(`
            <div id="parent">
                <button id="button"></button>
            </div>
        `);
        dom.focus(button);
        expect(dom.activeElement).toBe(button);

        expect(dom.blur(button)).toBe(true);
        expect(dom.activeElement).toBe(parent);
    });

    it('should set focus to source element from which focus is delegated', () => {
        const { button1, button2 } = initBody(`
            <button id="button1"></button>
            <button id="button2"></button>
        `);
        dom.focus(button1);
        dom.retainFocus(button1, button2);
        dom.focus(button2);
        expect(dom.activeElement).toBe(button2);

        expect(dom.blur(button2)).toBe(true);
        expect(dom.activeElement).toBe(button1);
    });

    it('should return false if element is behind modal element', () => {
        const { button1, button2 } = initBody(`
            <button id="button1"></button>
            <button id="button2"></button>
        `);
        dom.focus(button1);
        dom.retainFocus(button1, button2);
        dom.setModal(button2);
        dom.focus(button2);
        expect(dom.activeElement).toBe(button2);

        expect(dom.blur(button1)).toBe(false);
        expect(dom.activeElement).toBe(button2);
    });
});

describe('setFocus', () => {
    it('should not throw when delegated element containing the source element', () => {
        const { outer, inner } = initBody(`
            <div id="outer">
                <div id="inner"></div>
            </div>
        `);
        dom.retainFocus(inner, outer);
        dom.focus(inner);
    });

    it('should not throw when source element containing the delegated element', () => {
        const { outer, inner } = initBody(`
            <div id="outer">
                <div id="inner"></div>
            </div>
        `);
        dom.retainFocus(outer, inner);
        dom.focus(inner);
    });

    it('should focus correctly when given child element of focusable element', () => {
        const { button, inner } = initBody(`
            <button id="button">
                <span id="inner"></span>
            </button>
        `);
        dom.focus(inner);
        expect(dom.activeElement).toBe(inner);
        expect(document.activeElement).toBe(button);
    });

    it('should focus descandent of a fixed positioned element not blocked by modal element', () => {
        const { modal, other, child } = initBody(`
            <div id="modal"></div>
            <div id="other" style="position: fixed">
                <div id="child"></div>
            </div>
        `);
        dom.setModal(modal);
        dom.focus(child);
        expect(dom.focusedElements).toEqual([child, other, modal, root]);

        dom.releaseModal(modal);
        expect(dom.focusedElements).toEqual([child, other, modal, body, root]);
    });

    it('should trigger focuschange event to elements that neither got or lost focus', async () => {
        const { outer, inner } = initBody(`
            <div id="outer">
                <div id="inner"></div>
            </div>
        `);

        const cb = mockFn();
        bindEvent(root, 'focuschange', cb);
        bindEvent(body, 'focuschange', cb);
        bindEvent(outer, 'focuschange', cb);
        bindEvent(inner, 'focuschange', cb);

        dom.focus(inner);
        verifyCalls(cb, [
            [objectContaining({ target: body }), _],
            [objectContaining({ target: root }), _],
        ]);
        cb.mockClear();

        dom.focus(outer);
        verifyCalls(cb, [
            [objectContaining({ target: outer }), _],
            [objectContaining({ target: body }), _],
            [objectContaining({ target: root }), _],
        ]);
    });

    it('should not trigger focuschange event if active elements did not change', async () => {
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([modal, root]);

        const cb = mockFn();
        bindEvent(root, 'focuschange', cb);
        bindEvent(body, 'focuschange', cb);
        bindEvent(modal, 'focuschange', cb);

        expect(dom.focus(modal)).toBe(true);
        expect(cb).not.toBeCalled();

        expect(dom.focus(body)).toBe(false);
        expect(cb).not.toBeCalled();
    });
});

describe('setTabRoot', () => {
    it('should set tabIndex to -1 for focusable elements other than those contained', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1"></div>
            <div id="node2">
                <input type="text"/>
                <textarea></textarea>
                <button></button>
                <a href="#"></a>
            </div>
        `);
        dom.setTabRoot(node1);
        dom.focus(node1);
        await delay(10);
        for (let elm of makeArray(node2.children)) {
            expect(elm.tabIndex).toBe(-1);
        }

        const textarea = document.createElement('textarea');
        node2.appendChild(textarea);
        await delay(0);
        expect(textarea.tabIndex).toBe(-1);
    });

    it('should reset tabIndex to original value', async () => {
        const { node1, input1, input2 } = initBody(`
            <div id="node1"></div>
            <div id="node2">
                <input id="input1" type="text"/>
                <input id="input2" type="text" tabindex="1"/>
            </div>
        `);
        dom.setTabRoot(node1);
        dom.focus(node1);
        await delay(10);

        dom.blur(node1);
        await delay(10);
        expect(input1.getAttribute('tabindex')).toBe(null);
        expect(input2.getAttribute('tabindex')).toBe('1');
    });

    it('should be automatically effective for modal element', async () => {
        const { node1, input } = initBody(`
            <div id="node1"></div>
            <div id="node2">
                <input id="input" type="text"/>
            </div>
        `);
        dom.setModal(node1);
        await delay(10);
        expect(input.tabIndex).toBe(-1);

        dom.releaseModal(node1);
        await delay(10);
        expect(input.tabIndex).toBe(0);
    });
});

describe('unsetTabRoot', () => {
    it('should revert behavior by setTabRoot', async () => {
        const { node, input } = initBody(`
            <div id="node"></div>
            <input id="input" type="text"/>
        `);
        dom.setTabRoot(node);
        dom.focus(node);
        await delay(10);
        expect(input.getAttribute('tabindex')).toBe('-1');

        dom.unsetTabRoot(node);
        await delay(10);
        expect(input.getAttribute('tabindex')).toBe(null);
    });
});

describe('setModal', () => {
    it('should focus modal element', () => {
        const { modal } = initBody(`
            <div>
                <div id="modal"></div>
            </div>
        `);
        expect(dom.setModal(modal)).toBe(true);
        expect(dom.activeElement).toBe(modal);
        expect(dom.modalElement).toBe(modal);
    });

    it('should allow setting body\'s immediate child elements as modal element', () => {
        const { modal1, modal2 } = initBody(`
            <div id="modal1"></div>
            <div id="modal2"></div>
        `);
        setModal(modal1);
        expect(dom.modalElement).toBe(modal1);

        expect(focusable(modal2)).toBe(false);
        expect(setModal(modal2)).toBe(true);
        expect(dom.modalElement).toBe(modal2);
        expect(dom.focusedElements).toEqual([modal2, root]);

        releaseModal(modal2);
        expect(dom.modalElement).toBe(modal1);
        expect(dom.focusedElements).toEqual([modal2, modal1, root]);
    });

    it('should keep modal element and its descendant as focused', () => {
        const { modal, child } = initBody(`
            <div id="modal">
                <div id="child"></div>
            </div>
        `);
        dom.focus(child);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([child, modal, root]);
        expect(dom.modalElement).toBe(modal);
    });

    it('should keep focus inside modal element', () => {
        const { modal, button } = initBody(`
            <div>
                <div id="modal"></div>
                <button id="button"></button>
            </div>
        `);
        dom.setModal(modal);
        button.focus();
        expect(dom.activeElement).toBe(modal);
        expect(dom.focusedElements).toEqual([modal, root]);
    });

    it('should fire focuschange event on root element', async () => {
        const { outer, inner } = initBody(`
            <div id="outer">
                <div id="inner"></div>
            </div>
        `);

        const cb = mockFn();
        bindEvent(root, 'focuschange', cb);
        bindEvent(body, 'focuschange', cb);
        bindEvent(outer, 'focuschange', cb);
        bindEvent(inner, 'focuschange', cb);

        dom.setModal(inner);
        verifyCalls(cb, [
            [objectContaining({ target: root }), _]
        ]);
    });

    it('should fire focusreturn event if keyboard, mouse or touch event is triggered outside modal element', () => {
        const { modal, button } = initBody(`
            <div id="modal"></div>
            <button id="button"></button>
        `);
        const cb = mockFn();
        const unregister = dom.on(modal, 'focusreturn', cb);
        dom.setModal(modal);

        const event = new MouseEvent('mousedown');
        button.dispatchEvent(event);
        expect(cb).toBeCalledTimes(1);
        unregister();
    });

    it('should return focus to previously focused element if modal element is removed', async () => {
        const { modal, other, button } = initBody(`
            <div id="modal"></div>
            <div id="other">
                <button id="button"></button>
            </div>
        `);
        button.focus();
        expect(dom.focusedElements).toEqual([button, other, body, root]);
        dom.setModal(modal);
        expect(dom.focusable(button)).toBe(false);
        expect(dom.focusedElements).toEqual([modal, root]);

        await after(() => {
            body.removeChild(modal);
        });
        expect(dom.focusable(button)).toBeTruthy();
        expect(dom.focusedElements).toEqual([button, other, body, root]);
    });

    it('should do no-op and return true when element is already modal', () => {
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([modal, root]);

        expect(dom.setModal(modal)).toBe(true);
        expect(dom.focusedElements).toEqual([modal, root]);
    });

    it('should do no-op and return false when element is not focusable', () => {
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([modal, root]);

        expect(dom.setModal(body)).toBe(false);
        expect(dom.focusedElements).toEqual([modal, root]);
    });

    it('should do no-op and return false when element is root or body', () => {
        expect(focusable(root)).toBeTruthy();
        expect(setModal(root)).toBe(false);
        expect(dom.modalElement).toBeNull();
        expect(dom.focusedElements).toEqual([body, root]);

        expect(focusable(body)).toBeTruthy();
        expect(setModal(body)).toBe(false);
        expect(dom.modalElement).toBeNull();
        expect(dom.focusedElements).toEqual([body, root]);
    });

    it('should emit modalchange event', async () => {
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        const cb = mockFn();
        const unregister = dom.on('modalchange', cb);
        await after(() => {
            dom.setModal(modal);
        });
        verifyCalls(cb, [
            [objectContaining({ type: 'modalchange', modalElement: modal }), _]
        ]);
        unregister();
    });
});

describe('releaseModal', () => {
    it('should keep currently focused element', () => {
        const { modal, other, button } = initBody(`
            <div id="modal"></div>
            <div id="other">
                <button id="button"></button>
            </div>
        `);
        button.focus();
        expect(dom.focusedElements).toEqual([button, other, body, root]);
        dom.setModal(modal);
        expect(dom.focusable(button)).toBe(false);
        expect(dom.focusedElements).toEqual([modal, root]);
        expect(dom.modalElement).toBe(modal);

        dom.releaseModal(modal);
        expect(dom.focusable(button)).toBeTruthy();
        expect(dom.focusedElements).toEqual([modal, button, other, body, root]);
        expect(dom.modalElement).toBe(null);
    });

    it('should fire focusout event when blocked modal is released', () => {
        const { modal1, modal2, button } = initBody(`
            <div id="modal1">
                <button id="button"></button>
            </div>
            <div id="modal2"></div>
        `);
        const cb = mockFn();
        bindEvent(modal1, 'focusout', cb);
        bindEvent(button, 'focusout', cb);

        dom.setModal(modal1);
        dom.focus(button);
        dom.retainFocus(button, modal2);
        dom.setModal(modal2);

        dom.releaseModal(modal1);
        expect(dom.focused(modal1)).toBe(false);
        expect(dom.focused(button)).toBe(false);
        expect(cb).toBeCalledTimes(2);

        dom.releaseModal(modal2);
        expect(dom.focusedElements).toEqual([modal2, body, root]);
    });

    it('should emit modalchange event', async () => {
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        await after(() => {
            dom.setModal(modal);
        });
        const cb = mockFn();
        const unregister = dom.on('modalchange', cb);
        await after(() => {
            dom.releaseModal(modal);
        });
        verifyCalls(cb, [
            [objectContaining({ type: 'modalchange' }), _]
        ]);
        unregister();
    });

    it('should restore correctly when modal is released in-order', () => {
        const { modal1, modal2, other } = initBody(`
            <div id="modal1"></div>
            <div id="modal2"></div>
            <div id="other"></div>
        `);
        dom.focus(other);
        dom.setModal(modal1);
        expect(dom.focusedElements).toEqual([modal1, root]);
        expect(dom.setModal(modal2)).toBe(true);
        expect(dom.focusedElements).toEqual([modal2, root]);

        dom.releaseModal(modal2);
        expect(dom.focusedElements).toEqual([modal2, modal1, root]);
        dom.releaseModal(modal1);
        expect(dom.focusedElements).toEqual([modal2, modal1, other, body, root]);
    });

    it('should restore correctly when modal is released out-of-order', () => {
        const { modal1, modal2, other } = initBody(`
            <div id="modal1"></div>
            <div id="modal2"></div>
            <div id="other"></div>
        `);
        dom.focus(other);
        dom.setModal(modal1);
        expect(dom.focusedElements).toEqual([modal1, root]);
        expect(dom.setModal(modal2)).toBe(true);
        expect(dom.focusedElements).toEqual([modal2, root]);

        dom.releaseModal(modal1);
        expect(dom.focusedElements).toEqual([modal2, root]);
        dom.releaseModal(modal2);
        expect(dom.focusedElements).toEqual([modal2, other, body, root]);
    });
});

describe('retainFocus', () => {
    it('should return keep element given as first argument in focused state', () => {
        const { modal, other, inner } = initBody(`
            <div id="modal">
                <div id="inner"></div>
            </div>
            <div id="other"></div>
        `);
        const cb = mockFn();
        const unregister = dom.on(modal, 'focusout', cb);
        dom.focus(inner);
        dom.retainFocus(modal, other);
        dom.focus(other);
        expect(dom.focusedElements).toEqual([other, modal, body, root]);
        expect(cb).not.toBeCalled();
        unregister();
    });

    it('should allow focus to delegated element outside modal element', () => {
        const { modal, other } = initBody(`
            <div id="modal"></div>
            <div id="other"></div>
        `);
        dom.setModal(modal);
        dom.retainFocus(modal, other);
        dom.focus(other);
        expect(dom.activeElement).toEqual(other);
    });
});

describe('iterateFocusPath', () => {
    it('should return correct path', () => {
        const { modal1, modal2, child1, child2, friend, other } = initBody(`
            <div id="modal1">
                <div id="child1"></div>
                <div id="modal2">
                    <div id="child2"></div>
                </div>
            </div>
            <div id="friend"></div>
            <div id="other"></div>
        `);
        dom.setModal(modal1);
        dom.focus(child1);
        dom.setModal(modal2);
        dom.retainFocus(child2, friend);
        expect(dom.focusedElements).toEqual([modal2, root]);

        expect(map(iterateFocusPath(root), pipe)).toEqual([root]);
        expect(map(iterateFocusPath(body), pipe)).toEqual([body, root]);
        expect(map(iterateFocusPath(other), pipe)).toEqual([other, body, root]);
        expect(map(iterateFocusPath(child1), pipe)).toEqual([child1, modal1, root]);
        expect(map(iterateFocusPath(child2), pipe)).toEqual([child2, modal2, root]);
        expect(map(iterateFocusPath(friend), pipe)).toEqual([friend, child2, modal2, root]);
    });
});

describe('insertText', () => {
    it('should insert text to cursor position', () => {
        const { input } = initBody(`
            <input id="input" value="1234567890">
        `);
        input.setSelectionRange(3, 3);
        expect(dom.insertText(input, 'foo')).toBe(true);
        expect(input).toMatchObject({
            value: '123foo4567890',
            selectionStart: 6,
            selectionEnd: 6
        });
    });

    it('should insert text to specified position', () => {
        const { input } = initBody(`
            <input id="input" value="1234567890">
        `);
        expect(dom.insertText(input, 'foo', 3)).toBe(true);
        expect(input).toMatchObject({
            value: '123foo4567890',
            selectionStart: 6,
            selectionEnd: 6
        });
    });

    it('should replace text in selected position', () => {
        const { input } = initBody(`
            <input id="input" value="1234567890">
        `);
        input.setSelectionRange(3, 6);
        expect(dom.insertText(input, 'foo')).toBe(true);
        expect(input).toMatchObject({
            value: '123foo7890',
            selectionStart: 6,
            selectionEnd: 6
        });
    });

    it('should replace text in specified position', () => {
        const { input } = initBody(`
            <input id="input" value="1234567890">
        `);
        expect(dom.insertText(input, 'foo', 3, 6)).toBe(true);
        expect(input).toMatchObject({
            value: '123foo7890',
            selectionStart: 6,
            selectionEnd: 6
        });
    });

    it('should normalize startOffset and endOffset', () => {
        const { input } = initBody(`
            <input id="input" value="1234567890">
        `);
        dom.insertText(input, 'foo', -1, 10);
        expect(input).toMatchObject({
            value: 'foo',
            selectionStart: 3,
            selectionEnd: 3
        });
        dom.insertText(input, 'bar', 3, 0);
        expect(input).toMatchObject({
            value: 'foobar',
            selectionStart: 6,
            selectionEnd: 6
        });
    });

    it('should respect maxLength property', () => {
        const { input } = initBody(`
            <input id="input" value="1234567890" maxlength="10">
        `);
        expect(dom.insertText(input, 'foobar', 3, 6)).toBe(true);
        expect(input).toMatchObject({
            value: '123foo7890',
            selectionStart: 6,
            selectionEnd: 6
        });
    });

    it('should dispatch input event when value updated', () => {
        const { container, input } = initBody(`
            <div id="container">
                <input id="input">
            </div>
        `);
        const cb = mockFn();
        input.addEventListener('input', cb);
        container.addEventListener('input', cb);
        expect(dom.insertText(input, 'foo')).toBe(true);
        expect(cb).toBeCalledTimes(2);
    });

    it('should return false and not dispatch input event when value not updated', () => {
        const { input } = initBody(`
            <input id="input">
        `);
        const cb = mockFn();
        input.addEventListener('input', cb);
        expect(dom.insertText(input, '')).toBe(false);
        expect(cb).not.toBeCalled();
    });

    it('should work for textarea element', () => {
        // jsdom erreously report maxLength as 0 when maxlength attribute not exists
        const { input } = initBody(`
            <textarea id="input" maxlength="50">1234567890</textarea>
        `);
        expect(dom.insertText(input, 'foo', 3)).toBe(true);
        expect(input).toMatchObject({
            value: '123foo4567890',
            selectionStart: 6,
            selectionEnd: 6
        });
    });
});

describe('textInputAllowed', () => {
    it('should return false for disabled and read-only input', () => {
        const { input, textarea } = initBody(`
            <input id="input" disabled />
            <textarea id="textarea" disabled></textarea>
        `);
        expect(textInputAllowed(input)).toBe(false);
        expect(textInputAllowed(textarea)).toBe(false);
    });

    it('should return false for read-only input', () => {
        const { input, textarea } = initBody(`
            <input id="input" readonly />
            <textarea id="textarea" readonly></textarea>
        `);
        expect(textInputAllowed(input)).toBe(false);
        expect(textInputAllowed(textarea)).toBe(false);
    });
});

describe('eventSource', () => {
    it('should return script by default', () => {
        expect(dom.eventSource).toBe('script');
    });

    it('should return script in manually dispatched event', async () => {
        bindEvent(body, 'mousedown', () => expect(dom.eventSource).toBe('script'));
        body.dispatchEvent(new MouseEvent('mousedown', {
            button: 1,
            buttons: 1,
            bubbles: true,
            cancelable: true
        }));
        expect.assertions(1);
    });

    it('should be determined by trusted event', async () => {
        bindEvent(body, 'touchstart', () => {
            expect(dom.eventSource).toBe('mouse');
            return true;
        });
        bindEvent(body, 'mousedown', () => {
            expect(dom.eventSource).toBe('mouse');
            body.dispatchEvent(new TouchEvent('touchstart', {
                touches: [{ clientX: 0, clientY: 0, identifier: 1, target: body }],
                bubbles: true,
                cancelable: true
            }));
        });
        fireEventAsTrusted(body, new MouseEvent('mousedown', {
            button: 1,
            buttons: 1,
            bubbles: true,
            cancelable: true
        }));
        expect.assertions(2);
    });
});

describe('pressedKey', () => {
    it('should return pressed key combination', async () => {
        const cb = mockFn();
        cleanup(bind(root, 'keydown keypress keyup', e => cb(e.type, dom.pressedKey), { capture: true }));

        await fireEventAsTrusted(() => type(body, '[ctrl]a[ctrl-up]'));
        verifyCalls(cb, [
            ['keydown', 'ctrl'],
            ['keydown', 'ctrlA'],
            ['keypress', 'ctrlA'],
            ['keyup', 'ctrl'],
            ['keyup', ''],
        ]);
    });
});

describe('eventSourcePath', () => {
    it('should return same result during the same trusted event', async () => {
        const cb = mockFn();
        const { node, button } = initBody(`
            <div id="node">
                <button id="button"></button>
            </div>
        `);
        cleanup(dom.on(button, 'keystroke', () => {
            cb(...dom.eventSourcePath);
            dom.blur(button);
            cb(...dom.eventSourcePath);
        }));
        dom.focus(button);

        await fireEventAsTrusted(() => type(button, '[enter]'));
        verifyCalls(cb, [
            [button, node, body, root],
            [button, node, body, root],
        ]);
    });
});

describe('UI event', () => {
    it('should be call preventDefault on associated native event when handled', async () => {
        const { node } = initBody(`
            <div id="node"></div>
        `);
        const cb = mockFn(e => {
            node.dispatchEvent(new MouseEvent('contextmenu', { cancelable: true, bubbles: true }));
            return true;
        });
        dom.on(node, 'click', cb);

        const result = node.dispatchEvent(new MouseEvent('click', { cancelable: true, bubbles: true }));
        expect(cb).toBeCalledTimes(1);
        expect(result).toBe(false);
    });

    it('should be emitted to correct target after previously active element is detached', async () => {
        const { node } = initBody(`
            <div id="node"></div>
        `);
        const cb = mockFn();
        bindEvent(body, 'keystroke', cb);
        bindEvent(node, 'keystroke', cb);
        dom.focus(node);
        removeNode(node);

        type(body, 'a');
        verifyCalls(cb, [
            [objectContaining({ type: 'keystroke' }), body]
        ]);
    });
});

describe('focus event', () => {
    it('is not handleable', () => {
        const { node1, node2 } = initBody(`
            <div id="node1"></div>
            <div id="node2"></div>
        `);
        const cb = mockFn().mockReturnValue(42);
        dom.on(node1, { focusin: cb, focusout: cb });
        dom.on(node1, { focusin: cb, focusout: cb });
        dom.focus(node1);
        verifyCalls(cb, [
            [objectContaining({ type: 'focusin' }), _],
            [objectContaining({ type: 'focusin' }), _]
        ]);

        cb.mockReset();
        dom.focus(node2);
        verifyCalls(cb, [
            [objectContaining({ type: 'focusout', relatedTarget: node2 }), _],
            [objectContaining({ type: 'focusout', relatedTarget: node2 }), _]
        ]);
    });

    it('should be fired in correct order', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn();
        dom.on(node1, { focusin: cb, focusout: cb });
        dom.on(node2, { focusin: cb, focusout: cb });
        dom.focus(node2);
        verifyCalls(cb, [
            [objectContaining({ type: 'focusin', target: node1 }), _],
            [objectContaining({ type: 'focusin', target: node2 }), _]
        ]);

        cb.mockReset();
        dom.focus(body);
        verifyCalls(cb, [
            [objectContaining({ type: 'focusout', target: node2 }), _],
            [objectContaining({ type: 'focusout', target: node1 }), _]
        ]);
    });

    it('should be fired after element gained focus', async () => {
        const { node1, node2 } = initBody(`
            <button id="node1"></button>
            <button id="node2"></button>
        `);
        const cb = mockFn(e => document.activeElement);
        dom.on(node1, { focusin: cb, focusout: cb });
        dom.on(node2, { focusin: cb, focusout: cb });

        dom.focus(node1);
        expect(cb).toBeCalledTimes(1);
        expect(cb.mock.results[0].value).toBe(node1);

        cb.mockClear();
        dom.focus(node2);
        expect(cb).toBeCalledTimes(2);
        expect(cb.mock.results[0].value).toBe(node1); // focusout of node1
        expect(cb.mock.results[1].value).toBe(node2); // focusin of node2
    });

    it('should be fired after delegated element gained focus', async () => {
        const { node1, node2 } = initBody(`
            <button id="node1"></button>
            <button id="node2"></button>
        `);
        const cb = mockFn(e => [document.activeElement, dom.activeElement]);
        dom.on(node1, { focusin: cb, focusout: cb });
        dom.on(node2, { focusin: cb, focusout: cb });

        dom.retainFocus(node1, node2);
        dom.focus(node2);
        expect(cb).toBeCalledTimes(2);
        expect(cb.mock.results[0].value).toEqual([node2, node2]);
        expect(cb.mock.results[1].value).toEqual([node2, node2]);
    });
});

describe('mousedown event', () => {
    it('should have metakey defined when triggered by touch', () => {
        const cb = mockFn();
        bindEvent(root, 'mousedown', cb);
        body.dispatchEvent(new TouchEvent('touchstart', {
            touches: [{ clientX: 10, clientY: 10, identifier: 1, target: body }]
        }));
        expect(cb).toBeCalledWith(expect.objectContaining({
            type: 'mousedown',
            clientX: 10,
            clientY: 10,
            metakey: ''
        }), _);
    });
});

describe('mousewheel event', () => {
    it('should report pressed meta keys', async () => {
        const cb = mockFn();
        bindEvent(root, 'mousewheel', cb);
        fireEventAsTrusted(body, new WheelEvent('wheel', {
            deltaX: 0,
            deltaY: 100,
            deltaZ: 0,
            ctrlKey: true
        }));
        expect(cb).toBeCalledWith(expect.objectContaining({ type: 'mousewheel', metakey: 'ctrl' }), _);
    });
});

describe('click event', () => {
    it('should be emitted when native click event is directly dispatched', () => {
        const cb = mockFn();
        bindEvent(root, 'click', cb);
        document.body.dispatchEvent(new MouseEvent('click', { clientX: 10, clientY: 10 }));
        expect(cb).toBeCalledWith(expect.objectContaining({
            type: 'click',
            clientX: 10,
            clientY: 10
        }), _);
    });

    it('should not be emitted when target is not focusable', async () => {
        const { node } = initBody(`
            <div id="node"></div>
        `);
        dom.setModal(node);
        expect(dom.focusedElements).toEqual([node, root]);

        const cb = mockFn();
        bindEvent(root, 'click', cb);
        bindEvent(body, 'click', cb);
        bindEvent(node, 'click', cb);

        body.dispatchEvent(new MouseEvent('click', {
            clientX: 0,
            clientY: 0,
            bubbles: true,
            cancelable: true
        }));
        expect(cb).not.toBeCalled();
    });

    it('should focus target only when event is trusted', async () => {
        const { node } = initBody(`
            <div id="node"></div>
        `);
        node.dispatchEvent(new MouseEvent('click', {
            clientX: 0,
            clientY: 0,
            bubbles: true,
            cancelable: true
        }));
        expect(dom.activeElement).toBe(body);

        fireEventAsTrusted(node, new MouseEvent('click', {
            clientX: 0,
            clientY: 0,
            bubbles: true,
            cancelable: true
        }));
        expect(dom.activeElement).toBe(node);
    });

    it('should be emitted after prefixed event', async () => {
        const cb = mockFn();
        bindEvent(root, 'ctrlShiftClick', cb);
        bindEvent(root, 'click', cb);

        fireEventAsTrusted(body, new MouseEvent('click', {
            clientX: 0,
            clientY: 0,
            ctrlKey: true,
            shiftKey: true,
            bubbles: true,
            cancelable: true
        }));
        verifyCalls(cb, [
            [objectContaining({ type: 'ctrlShiftClick', metakey: 'ctrlShift' }), _],
            [objectContaining({ type: 'click', metakey: 'ctrlShift' }), _],
        ]);
    });
});

describe('keystroke event', () => {
    it('should be fired in correct order', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1">
                <div id="node2"></div>
            </div>
        `);
        const cb = mockFn();
        dom.on(node1, { keystroke: cb, ctrlA: cb });
        dom.on(node2, { keystroke: cb, ctrlA: cb });
        dom.focus(node2);

        await type(node2, '[ctrl]a[ctrl-up]');
        verifyCalls(cb, [
            [objectContaining({ currentTarget: node2, type: 'ctrlA', data: null }), _],
            [objectContaining({ currentTarget: node2, type: 'keystroke', data: 'ctrlA' }), _],
            [objectContaining({ currentTarget: node1, type: 'ctrlA', data: null }), _],
            [objectContaining({ currentTarget: node1, type: 'keystroke', data: 'ctrlA' }), _],
        ]);
    });

    it('should be fired with correct meta key prefix', async () => {
        const cb = mockFn();
        const unregister = dom.on(body, { metakeychange: cb, keystroke: cb });

        await type(body, '[ctrl]a[ctrl-up]');
        verifyCalls(cb, [
            [objectContaining({ type: 'metakeychange', data: 'ctrl' }), _],
            [objectContaining({ type: 'keystroke', data: 'ctrlA' }), _],
            [objectContaining({ type: 'metakeychange', data: '' }), _]
        ]);
        cb.mockReset();

        await type(body, '[ctrl][shift]a[ctrl-up][shift-up]');
        verifyCalls(cb, [
            [objectContaining({ type: 'metakeychange', data: 'ctrl' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlShift' }), _],
            [objectContaining({ type: 'keystroke', data: 'ctrlShiftA' }), _],
            [objectContaining({ type: 'metakeychange', data: 'shift' }), _],
            [objectContaining({ type: 'metakeychange', data: '' }), _]
        ]);
        cb.mockReset();

        await type(body, '[ctrl][alt]a[ctrl-up][alt-up]');
        verifyCalls(cb, [
            [objectContaining({ type: 'metakeychange', data: 'ctrl' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlAlt' }), _],
            [objectContaining({ type: 'keystroke', data: 'ctrlAltA' }), _],
            [objectContaining({ type: 'metakeychange', data: 'alt' }), _],
            [objectContaining({ type: 'metakeychange', data: '' }), _]
        ]);
        cb.mockReset();

        await type(body, '[ctrl][alt][shift]a[shift-up][ctrl-up][alt-up]');
        verifyCalls(cb, [
            [objectContaining({ type: 'metakeychange', data: 'ctrl' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlAlt' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlAltShift' }), _],
            [objectContaining({ type: 'keystroke', data: 'ctrlAltShiftA' }), _],
            [objectContaining({ type: 'metakeychange', data: 'ctrlAlt' }), _],
            [objectContaining({ type: 'metakeychange', data: 'alt' }), _],
            [objectContaining({ type: 'metakeychange', data: '' }), _]
        ]);
        unregister();
    });

    it('should be followed by textInput event for typed character on element allowing text input', async () => {
        const { input, textarea } = initBody(`
            <input id="input" type="text" />
            <textarea id="textarea"></textarea>
        `);
        const cb = mockFn();
        dom.on(input, { keystroke: cb, textInput: cb });
        dom.on(textarea, { keystroke: cb, textInput: cb });

        await type(input, 'a');
        verifyCalls(cb, [
            [objectContaining({ currentTarget: input, type: 'keystroke', data: 'a' }), _],
            [objectContaining({ currentTarget: input, type: 'textInput', data: 'a' }), _]
        ]);
        cb.mockReset();

        await type(input, ';');
        verifyCalls(cb, [
            [objectContaining({ currentTarget: input, type: 'keystroke', data: 'semiColon' }), _],
            [objectContaining({ currentTarget: input, type: 'textInput', data: ';' }), _]
        ]);
        cb.mockReset();

        await type(textarea, '[enter]');
        verifyCalls(cb, [
            [objectContaining({ currentTarget: textarea, type: 'keystroke', data: 'enter' }), _],
            [objectContaining({ currentTarget: textarea, type: 'textInput', data: '\n' }), _]
        ]);
        cb.mockReset();

        // special case: enter key in normal input
        await type(input, '[enter]');
        verifyCalls(cb, [
            [objectContaining({ currentTarget: input, type: 'keystroke', data: 'enter' }), _],
        ]);
        cb.mockReset();

        // this test is skipped in simulated DOM environment
        // the syn library did not report 'A' in e.key as in real browser
        //
        // await type(input, '[shift]a[shift-up]');
        // verifyCalls(cb, [
        //     [objectContaining({ currentTarget: input, type: 'keystroke', data: 'shiftA' }), _],
        //     [objectContaining({ currentTarget: input, type: 'textInput', data: 'A' }), _]
        // ]);
    });

    it('should be fired in correct order when tapped and re-emitted', async () => {
        const { input } = initBody(`
            <input id="input" type="text" />
        `);
        const cb = mockFn();
        /** @type {ZetaEventContainer<Zeta.HasElement>} */
        const container = new ZetaEventContainer(body, {}, {
            captureDOMEvents: true
        });
        const context = { element: input };
        container.add(context, { a: cb, keystroke: cb, textInput: cb });
        container.tap(function (e) {
            cb(...arguments);
            container.emit(e);
        });
        // @ts-ignore
        dom.on(input, { a: cb, keystroke: cb, textInput: cb });
        input.focus();
        cb.mockReset();

        await type(input, 'a');
        verifyCalls(cb, [
            [objectContaining({ context: container, type: 'keystroke', data: 'a' }), _],
            [objectContaining({ context: context, type: 'a' }), _],
            [objectContaining({ context: context, type: 'keystroke', data: 'a' }), _],
            [objectContaining({ context: container, type: 'textInput', data: 'a' }), _],
            [objectContaining({ context: context, type: 'textInput', data: 'a' }), _],
            [objectContaining({ context: input, type: 'a' }), _],
            [objectContaining({ context: input, type: 'keystroke', data: 'a' }), _],
            [objectContaining({ context: input, type: 'textInput', data: 'a' }), _],
        ]);
    });
});
