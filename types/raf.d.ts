export = index;
declare function index(fn: any): any;
declare namespace index {
  function cancel(...args: any[]): void;
  function polyfill(object: any): void;
}