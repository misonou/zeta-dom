import { combineNodeFilters, is } from "../src/domUtil";

describe('is', () => {
    xit('[need fix] should check DOM node with node type enum', () => {
        // fix @ 19d1d38
        const cases = [
            document.createElement('div'),
            document.createTextNode(''),
            document.createDocumentFragment(),
            document.createComment('')
        ];
        cases.forEach((node) => {
            for (var i = 1; i <= 11; i++) {
                expect(`(${node.nodeType}, ${i}) = ${!!is(node, i)}`).toBe(`(${node.nodeType}, ${i}) = ${i === node.nodeType}`);
            }
        });
    });
});

describe('combineNodeFilters', () => {
    const return1 = () => 1;
    const return2 = () => 2;
    const return3 = () => 3;

    it('should return 2 if any callback return 2', () => {
        expect(combineNodeFilters(return1, return2, return3)()).toBe(2);
    });

    it('should return 3 if any callback return 3 and no callback return 2', () => {
        expect(combineNodeFilters(return1, return1, return3)()).toBe(3);
    });

    it('should return 1 if all callback return 1', () => {
        expect(combineNodeFilters(return1, return1, return1)()).toBe(1);
    });

    it('should return 1 if there is no callback', () => {
        expect(combineNodeFilters()()).toBe(1);
    });

    it('does not throw when argument is not function', () => {
        expect(() => combineNodeFilters(1, 2, 3)()).not.toThrow();
    });
});
