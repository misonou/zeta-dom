import $ from 'jquery';

// @ts-ignore
window.jQuery = $;
window.Promise = Promise;

const originalError = console.error;
const originalWarn = console.warn;
const originalLog = console.log;
beforeEach(() => {
    console.error = function () { };
    console.warn = function () { };
    console.log = function () { };
});
afterEach(() => {
    console.error = originalError;
    console.warn = originalWarn;
    console.log = originalLog;
});

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
