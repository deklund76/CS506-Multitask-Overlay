module.exports = class Widget {
  constructor(type, left, top, height, width, src) {
    this._type = type;
    this._left = left;
    this._top = top;
    this._height = height;
    this._width = width;
    this._src = src;
  }

  /* Getters and Setters */

  get type() {
    return this._type;
  }

  set type(type) {
    this._type = type;
  }

  get left() {
    return this._left;
  }

  set left(left) {
    this._left = left;
  }

  get top() {
    return this._top;
  }

  set top(top) {
    this._top = top;
  }

  get height() {
    return this._height;
  }

  set height(height) {
    this._height = height;
  }

  get width() {
    return this._width;
  }

  set width(width) {
    this._width = width;
  }

  get src() {
    return this._src;
  }

  set src(src) {
    this._src = src;
  }
};
