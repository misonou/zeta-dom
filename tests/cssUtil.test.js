import { isCssUrlValue, parseCSS, runCSSTransition } from "../src/cssUtil";
import * as ErrorCode from '../src/errorCode';
import { initBody, mockFn, _ } from "./testUtil";

const transitionProps = [
    { property: 'opacity', from: '0', to: '1' },
    { property: 'line-height', from: '1', to: '2' },
    { property: 'width', from: '10px', to: '20em' },
    { property: 'color', from: '#000', to: '#FFF' },
    { property: 'transform', from: 'none', to: 'scale(1.1)' }
];

function dispatchTransitionendEvent(element, propertyName) {
    const event = new CustomEvent('transitionend', {
        bubbles: true,
        cancelable: false
    });
    // @ts-ignore
    event.propertyName = propertyName;
    element.dispatchEvent(event);
}

function dispatchAnimationendEvent(element, animationName) {
    const event = new CustomEvent('animationend', {
        bubbles: true,
        cancelable: false
    });
    // @ts-ignore
    event.animationName = animationName;
    element.dispatchEvent(event);
}

describe('parseCSS', () => {
    it('should return an object containing valid CSS rules', () => {
        expect(parseCSS('display: block; position: relative;')).toEqual({
            display: 'block',
            position: 'relative'
        });
    });
});

describe('isCssUrlValue', () => {
    it('should return matched URL from a valid CSS URL value', () => {
        expect(isCssUrlValue('url(foobar.gif)')).toEqual('foobar.gif');
        expect(isCssUrlValue('url(\'foobar.gif\')')).toEqual('foobar.gif');
        expect(isCssUrlValue('url("foobar.gif")')).toEqual('foobar.gif');
    });

    it('should return falsy value if given value does not contain CSS URL value', () => {
        expect(isCssUrlValue('')).toBeFalsy();
    });
});

describe('runCSSTransition', () => {
    it('should reject if the CSS class already exists', async () => {
        const { node1 } = initBody(`
            <div id="node1" class="active"></div>
        `);
        await expect(runCSSTransition(node1, 'active')).rejects.toBeErrorWithCode(ErrorCode.invalidOperation);
    });

    it('should resolve immediately if there are no CSS transitions or animations triggered', async () => {
        const { node1 } = initBody(`
            <div id="node1" style="transition-duration: 0s; animation-name: none;"></div>
        `);
        const cb = mockFn();
        const promise = runCSSTransition(node1, 'active', cb);
        expect(cb).toBeCalledTimes(1);
        expect(node1.classList).toContain('active');
        await expect(promise).resolves.toBe(node1);
    });

    it('should ignore hidden elements', async () => {
        const { property, from, to } = transitionProps[0];
        const { node1 } = initBody(`
            <style>
                #node2 {
                    transition-property: ${property};
                    transition-duration: 0.1s;
                    ${property}: ${from};
                }
                #node2.active {
                    ${property}: ${to};
                }
            </style>
            <div id="node1">
                <div id="node2" style="display: none"></div>
            </div>
        `);
        const cb = mockFn();
        const promise = runCSSTransition(node1, 'active', cb);
        expect(cb).toBeCalledTimes(1);
        expect(node1.classList).toContain('active');
        await expect(promise).resolves.toBe(node1);
    });

    it('should resolve when the triggered CSS animation have ended', async () => {
        const { node1 } = initBody(`
            <style>
                #node1 {
                    animation-name: anim1;
                }
                #node1.active {
                    animation-name: anim1, anim2;
                }
            </style>
            <div id="node1"></div>
        `);
        setTimeout(() => {
            dispatchAnimationendEvent(node1, 'anim2');
        }, 100);

        const cb = mockFn();
        const promise = runCSSTransition(node1, 'active', cb);
        expect(cb).toBeCalledTimes(0);
        await expect(promise).resolves.toEqual(_);
    });

    it('should resolve when the triggered CSS transition have ended', async () => {
        for (let { property, from, to } of transitionProps) {
            const { node1 } = initBody(`
                <style>
                    #node1 {
                        transition-property: ${property};
                        transition-duration: 0.1s;
                        ${property}: ${from};
                    }
                    #node1.active {
                        ${property}: ${to};
                    }
                </style>
                <div id="node1"></div>
            `);
            setTimeout(() => {
                dispatchTransitionendEvent(node1, property);
            }, 100);

            const cb = mockFn();
            const promise = runCSSTransition(node1, 'active', cb);
            expect(cb).toBeCalledTimes(0);
            await expect(promise).resolves.toEqual(_);
        }
    });

    it('should resolve when all triggered CSS animation or transition have ended', async () => {
        const p1 = transitionProps[0];
        const p2 = transitionProps[1];
        const { node1 } = initBody(`
            <style>
                #node1 {
                    transition-property: ${p1.property}, ${p2.property};
                    transition-duration: 0.1s, 0.2s;
                    ${p1.property}: ${p1.from};
                    ${p2.property}: ${p2.from};
                }
                #node1.active {
                    ${p1.property}: ${p1.to};
                    ${p2.property}: ${p2.to};
                }
            </style>
            <div id="node1"></div>
        `);
        const cb1 = mockFn(() => {
            dispatchTransitionendEvent(node1, p1.property);
        });
        const cb2 = mockFn(() => {
            dispatchTransitionendEvent(node1, p2.property);
        });
        setTimeout(cb1, 100);
        setTimeout(cb2, 200);

        const promise = runCSSTransition(node1, 'active');
        await expect(promise).resolves.toEqual(_);
        expect(cb1).toBeCalledTimes(1);
        expect(cb2).toBeCalledTimes(1);
    });

    it('should determine if initial and final value are animatable', async () => {
        const { node1 } = initBody(`
            <style>
                #node1 {
                    transition-property: width;
                    transition-duration: 0.1s;
                    width: auto;
                }
                #node1.active {
                    width: 100%;
                }
            </style>
            <div id="node1"></div>
        `);
        const cb = mockFn();
        const promise = runCSSTransition(node1, 'active', cb);
        expect(cb).toBeCalledTimes(1);
        expect(node1.classList).toContain('active');
        await expect(promise).resolves.toBe(node1);
    });

    it('should normalize identity matrix in transform', async () => {
        const { node1 } = initBody(`
            <style>
                #node1 {
                    transition-property: transform;
                    transition-duration: 0.1s;
                    transform: none;
                }
                #node1.active {
                    transform: matrix(1, 0, 0, 1, 0, 0);
                }
            </style>
            <div id="node1"></div>
        `);
        const cb = mockFn();
        const promise = runCSSTransition(node1, 'active', cb);
        expect(cb).toBeCalledTimes(1);
        expect(node1.classList).toContain('active');
        await expect(promise).resolves.toBe(node1);
    });

    it('should remove CSS class after resolved when last argument is true', async () => {
        const { property, from, to } = transitionProps[0];
        const { node1 } = initBody(`
            <style>
                #node1 {
                    transition-property: ${property};
                    transition-duration: 0.1s;
                    ${property}: ${from};
                }
                #node1.active {
                    ${property}: ${to};
                }
            </style>
            <div id="node1"></div>
        `);
        setTimeout(() => {
            dispatchTransitionendEvent(node1, property);
        }, 100);

        const promise = runCSSTransition(node1, 'active', true);
        expect(node1.classList).toContain('active');
        await expect(promise).resolves.toEqual(_);
        expect(node1.classList).not.toContain('active');
    });

    it('should reject if the CSS class is removed before animation is completed', async () => {
        const { property, from, to } = transitionProps[0];
        const { node1 } = initBody(`
            <style>
                #node1 {
                    transition-property: ${property};
                    transition-duration: 0.1s;
                    ${property}: ${from};
                }
                #node1.active {
                    ${property}: ${to};
                }
            </style>
            <div id="node1"></div>
        `);
        setTimeout(() => {
            node1.classList.remove('active');
            dispatchTransitionendEvent(node1, property);
        }, 100);

        const promise = runCSSTransition(node1, 'active');
        await expect(promise).rejects.toEqual(_);
    });
});
