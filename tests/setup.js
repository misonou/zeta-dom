import { mockFn } from '@misonou/test-utils';
import $ from 'jquery';

document.elementsFromPoint = mockFn();

window.reportError = mockFn((error) => {
    console.error(error);
    window.dispatchEvent(new ErrorEvent('error', { error }));
});
// avoid unwanted failure
window.addEventListener('error', () => { });

afterEach(() => {
    $(document.body).empty();
});
