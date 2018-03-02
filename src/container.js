const elements = Symbol();

export default class Container {
  constructor () {
    Object.defineProperty(this, elements, {
      value: [],
    });
  }

  isEmpty () {
    return !this[elements].length;
  }
}
