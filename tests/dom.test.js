import syn from "syn";
import dom from "../src/dom";
import userEvent from "@testing-library/user-event";
import { removeNode } from "../src/domUtil";
import { domReady } from "../src/env";
import { ZetaEventContainer } from "../src/events";
import { after, body, initBody, mockFn, objectContaining, root, verifyCalls, _ } from "./testUtil";

/** @type {import("@testing-library/user-event/dist/types/setup/setup").UserEvent} */
const { keyboard } = userEvent.default;

async function type(elm, keystroke) {
    await domReady;
    await after(() => {
        dom.focus(elm);
        // @ts-ignore: unable to infer dynamically created method
        syn.type(elm, keystroke);
    });
}

describe('activeElement', () => {
    it('should return body as initial focused element', async () => {
        await dom.ready;
        expect(dom.activeElement).toBe(body);
    });

    it('should return current focused element', async () => {
        await dom.ready;
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        expect(dom.activeElement).toBe(button);
    });

    it('should not return detached element', async () => {
        await dom.ready;
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        removeNode(button);
        expect(dom.activeElement).toBe(body);
    });
});

describe('focusedElements', () => {
    it('should return current focused element and its parents', async () => {
        await dom.ready;
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        expect(dom.focusedElements).toEqual([button, body, root]);
    });

    it('should not return detached element', async () => {
        await dom.ready;
        const { button } = initBody(`
            <button id="button"></button>
        `);
        button.focus();
        removeNode(button);
        expect(dom.focusedElements).toEqual([body, root]);
    });

    it('should exclude elements that is not descandents of modal element', async () => {
        await dom.ready;
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
    it('should not return detached element', async () => {
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
    it('should be null initially', async () => {
        await dom.ready;
        expect(dom.context).toBeNull();
    });

    it('should return context object of current DOM event capturing container', async () => {
        await dom.ready;
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

describe('focusable', () => {
    it('should return false if element is blocked by modal element', async () => {
        await dom.ready;
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
    it('should not throw when delegated element containing the source element', async () => {
        await dom.ready;
        const { outer, inner } = initBody(`
            <div id="outer">
                <div id="inner"></div>
            </div>
        `);
        dom.retainFocus(inner, outer);
        dom.focus(inner);
    });

    it('should not throw when source element containing the delegated element', async () => {
        await dom.ready;
        const { outer, inner } = initBody(`
            <div id="outer">
                <div id="inner"></div>
            </div>
        `);
        dom.retainFocus(outer, inner);
        dom.focus(inner);
    });
});

describe('setModal', () => {
    it('should focus modal element', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div>
                <div id="modal"></div>
            </div>
        `);
        expect(dom.setModal(modal)).toBe(true);
        expect(dom.activeElement).toBe(modal);
        expect(dom.modalElement).toBe(modal);
    });

    it('should keep modal element and its descendant as focused', async () => {
        await dom.ready;
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

    it('should keep focus inside modal element', async () => {
        await dom.ready;
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

    it('should fire focusreturn event if keyboard, mouse or touch event is triggered outside modal element', async () => {
        await dom.ready;
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
        await dom.ready;
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

    it('should do no-op and return true when element is already modal', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([modal, root]);

        expect(dom.setModal(modal)).toBe(true);
        expect(dom.focusedElements).toEqual([modal, root]);
    });

    it('should do no-op and return false when element is not focusable', async () => {
        await dom.ready;
        const { modal } = initBody(`
            <div id="modal"></div>
        `);
        dom.setModal(modal);
        expect(dom.focusedElements).toEqual([modal, root]);

        expect(dom.setModal(body)).toBe(false);
        expect(dom.focusedElements).toEqual([modal, root]);
    });

    it('should emit modalchange event', async () => {
        await dom.ready;
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
    it('should keep currently focused element', async () => {
        await dom.ready;
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
        expect(dom.focusedElements).toEqual([modal, body, root]);
        expect(dom.modalElement).toBe(null);
    });

    it('should fire focusout event on previously focused element', async () => {
        await dom.ready;
        const { modal, other, button } = initBody(`
            <div id="modal"></div>
            <div id="other">
                <button id="button"></button>
            </div>
        `);
        const cb = mockFn();
        const unregister = dom.on(button, 'focusout', cb);
        button.focus();
        dom.setModal(modal);
        dom.releaseModal(modal);
        expect(cb).toBeCalled();
        unregister();
    });

    it('should emit modalchange event', async () => {
        await dom.ready;
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

    it('should restore correctly when modal is released out-of-order', async () => {
        const { modal1, modal2, other } = await initBody(`
            <div id="modal1"></div>
            <div id="modal2"></div>
            <div id="other"></div>
        `);
        dom.focus(other);
        dom.setModal(modal1);
        expect(dom.focusedElements).toEqual([modal1, root]);

        dom.retainFocus(modal1, modal2);
        expect(dom.setModal(modal2)).toBe(true);
        expect(dom.focusedElements).toEqual([modal2, root]);

        dom.releaseModal(modal1);
        dom.releaseModal(modal2);
        expect(dom.focusedElements).toEqual([modal2, body, root]);
    });
});

describe('retainFocus', () => {
    it('should return keep element given as first argument in focused state', async () => {
        await dom.ready;
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

    it('should allow focus to delegated element outside modal element', async () => {
        await dom.ready;
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
        const { input } = initBody(`
            <input id="input" type="text" />
        `);
        const cb = mockFn();
        dom.on(input, { keystroke: cb, textInput: cb });

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
        /** @type {Zeta.ZetaEventContainer<Zeta.HasElement>} */
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

describe('escape key', () => {
    it('should cause text input to lose focus', async () => {
        const { div, input } = initBody(`
            <div id="div">
                <input id="input" type="text" />
            </div>
        `);
        input.focus();

        await keyboard('{Escape}');
        expect(dom.activeElement).toBe(div);
    });

    it('should cause button to lose focus', async () => {
        const { div, button } = initBody(`
            <div id="div">
                <button id="button">Button</button>
            </div>
        `);
        button.focus();

        await keyboard('{Escape}');
        expect(dom.activeElement).toBe(div);
    });

    it('should cause delegated element to lose focus', async () => {
        const { node1, node2 } = initBody(`
            <div id="node1"></div>
            <div id="node2"></div>
        `);
        dom.focus(node1);
        dom.retainFocus(node1, node2);
        dom.focus(node2);

        await keyboard('{Escape}');
        expect(dom.activeElement).toBe(node1);
    });

    it('should not throw if not element is actually in focus', async () => {
        await keyboard('{Escape}');
    });
});
