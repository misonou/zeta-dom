import { mockFn } from '@misonou/test-utils';
import $ from 'jquery';

document.elementsFromPoint = mockFn();

afterEach(() => {
    $(document.body).empty();
});
