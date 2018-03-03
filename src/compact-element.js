import {elements} from './element';

export const makeCompactElement = Element => {
  const {adapt, clone, shift, diff} = Element.adaptors;

  class CompactElement extends Element {
    constructor (...args) {
      super(args[0], args[args.length - 1]);
    }
  }

  CompactElement.adaptors = Element.adaptors;

  return CompactElement;
};
