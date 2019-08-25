const Widget = require('./Widget.js');

module.exports = class Preset {
  constructor(name = '', widgetList = [], resolution = '', opacity = 1.0, gridHeight = '', gridWidth = '', gameType = '', background = '') {
    this._name = name;
    this._resolution = resolution;
    this._opacity = opacity;
    this._gridHeight = gridHeight;
    this._gridWidth = gridWidth;
    this._gameType = gameType;
    this._background = background;
    this._widgetList = [];
    if (widgetList.length > 0) {
      widgetList.forEach(w => {
        this._widgetList.push(new Widget(w._type, w._left, w._top, w._height, w._width, w._src));
      });
    }
  }

  /* Getters and Setters */

  get widgetList() {
    return this._widgetList;
  }

  set widgetList(widgetList) {
    this._widgetList = widgetList;
  }

  get resolution() {
    return this._resolution;
  }

  set resolution(resolution) {
    this._resolution = resolution;
  }

  get opacity() {
    return this._opacity;
  }

  set opacity(opacity) {
    this._opacity = opacity;
  }

  get name() {
    return this._name;
  }

  set name(name) {
    this._name = name;
  }

  get gridHeight() {
    return this._gridHeight;
  }

  set gridHeight(gridHeight) {
    this._gridHeight = gridHeight;
  }

  get gridWidth() {
    return this._gridWidth;
  }

  set gridWidth(gridWidth) {
    this._gridWidth = gridWidth;
  }

  get gameType() {
    return this._gameType;
  }

  set gameType(gameType) {
    this._gameType = gameType;
  }

  get background() {
    return `${process.cwd()}/assets/images/${this._background}`;
  }

  set background(bg) {
    this._background = bg;
  }
};
