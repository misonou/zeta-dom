import $ from 'jquery';

// @ts-ignore
window.jQuery = $;
window.Promise = Promise;

afterEach(() => {
    $(document.body).empty();
});

expect.extend({
    sameObject(received, actual) {
        if (typeof actual !== 'object' || actual === null) {
            throw new Error('actual must be object');
        }
        const pass = actual === received;
        return { pass, message: () => '' };
    }
});
