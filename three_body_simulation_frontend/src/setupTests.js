/* eslint-disable no-undef */
// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';

// JSDOM does not implement ResizeObserver; provide a minimal mock for tests.
if (typeof global.ResizeObserver === "undefined") {
  // PUBLIC_INTERFACE
  class ResizeObserverMock {
    /** Minimal ResizeObserver mock for JSDOM test environment. */
    constructor(callback) {
      this.callback = typeof callback === "function" ? callback : () => {};
    }
    observe() { /* no-op */ }
    unobserve() { /* no-op */ }
    disconnect() { /* no-op */ }
  }
  global.ResizeObserver = ResizeObserverMock;
}
