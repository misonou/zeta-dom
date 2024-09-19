import { mockFn } from "@misonou/test-utils";
import { ZetaEventContainer } from "../src/events";

describe('ZetaEventContainer', () => {
    it('should allow target to be garbage collected when target is deleted', async () => {
        const cb1 = mockFn();
        const cb2 = mockFn();
        const registry1 = new FinalizationRegistry(cb1);
        const registry2 = new FinalizationRegistry(cb2);
        const container = new ZetaEventContainer();
        class A { }
        const arr = [];

        for (let i = 10000; i > 0; i--) {
            (() => {
                let target1 = new A;
                registry1.register(target1, 0);

                let target2 = new A;
                arr.push(container.add(target2, { test: () => { } }));
                registry2.register(target2, 0);
                container.delete(target2);
            })();
        }
        await new Promise(r => setTimeout(r, 9000));
        eval("%CollectGarbage('all')");
        expect(cb1).toBeCalled();
        expect(cb2).toBeCalled();
    });
});
