const glob = require('glob');
const Widget = require(`${process.cwd()}/src/js/Model/Widget.js`);

module.exports = class Controller {
  constructor(model) {
    this._model = model;
  }

  get model() {
    return this._model;
  }

  set model(model) {
    this._model = model;
  }

  /* initializes the View */
  initialize(event) {
    this.loadPresets(event);
    this.loadPreview(event);

    // add event listeners to preset items
    let idx = 0;
    const presetIds = this._model.presetList.map(p => `preset-${idx++}`); // eslint-disable-line
    event.sender.send('presetSelector', presetIds);

    // set opacity
    event.sender.send('setOpacitySlider', this._model.preset.opacity);

    // set name
    event.sender.send('render', ['displayName', 'innerHTML', `<h3>${this._model.preset.name}</h3>`]);
  }

  /* sets the preview */
  loadPreview(event) {
    const background = this._model.preset.background;
    event.sender.send('render', ['BGpreview', 'src', background]);
  }

  /* selects preset */
  selectPreset(id) {
    this._model.selectedIndex = id.match(/\d+/)[0];
  }

  /* takes preset list and renders it */
  loadPresets(event) {
    const presetList = this._model.presetList;
    const presets = [];
    presetList.forEach((p, idx) => {
      presets.push(`<li><a href="" class="preset" id="preset-${idx}">${p.name}</a></li>`);
    });
    event.sender.send('render', ['presetListItems', 'innerHTML', presets.join('')]);
  }

  /* Duplicates the current preset and selects it */
  duplicatePreset(mainWindow) {
    this._model.duplicatePreset();
    mainWindow.reload();
  }

  /* Deletes selected preset from local file system */
  deletePreset(event) {
    this._model.deletePreset();
    this.initialize(event);
  }

  /* Creates new preset */
  createPreset(mainWindow) {
    this._model.createPreset();
    mainWindow.reload();
  }

  /* Saves current preset */
  savePreset() {
    this._model.savePreset();
  }

  /* Renames current preset */
  renamePreset(newName, mainWindow) {
    this._model.preset.name = newName;
    this.savePreset();
    mainWindow.reload();
  }

  /* Updates background */
  selectBackground(mainWindow, id) {
    glob(`${process.cwd()}/assets/images/*`, (err, files) => {
      files.forEach(f => {
        if (f.includes(id)) {
          this._model.preset.background = f.split('images/')[1];
        }
      });
    });
    mainWindow.reload();
  }

  /* Updates preset widget info */
  updateWidgets(args) {
    const noteWidgets = args[0];
    const browserWidgets = args[1];
    const preview = args[2];

    // build widget list
    this._model.preset.widgetList = [];

    noteWidgets.forEach(n => {
      const dLeft = (n.left / preview.width).toFixed(3);
      const dTop = (n.top / preview.height).toFixed(3);
      const height = (n.height / preview.height).toFixed(3);
      const width = (n.width / preview.width).toFixed(3);
      this._model.preset.widgetList.push(new Widget('noteWidget', dLeft, dTop, height, width, n.src));
    });

    browserWidgets.forEach(b => {
      const dLeft = (b.left / preview.width).toFixed(3);
      const dTop = (b.top / preview.height).toFixed(3);
      const height = (b.height / preview.height).toFixed(3);
      const width = (b.width / preview.width).toFixed(3);
      this._model.preset.widgetList.push(new Widget('browserWidget', dLeft, dTop, height, width, b.src));
    });
  }

  /* Renders widget objects */
  loadWidgets(event, preview) {
    // construct img elements
    const widgetList = this._model.preset.widgetList;
    const widgets = [];
    widgetList.forEach(w => {
      const left = (w.left * preview.width).toFixed(2).toString();
      const top = (w.top * preview.height).toFixed(2).toString();
      const width = (w.width * preview.width).toFixed(2).toString();
      const height = (w.height * preview.height).toFixed(2).toString();
      widgets.push(`<div class="widgetIcon ${w.type}" style="position: absolute; left: ${left}px; top: ${top}px; width: ${width}px; height: ${height}px"><img src="${w.src}" /></div>`);
    });

    // render, make draggable, add event handler for right clicks
    event.sender.send('render', ['BGwrapper', 'innerHTML', widgets.join(''), true]);
    event.sender.send('makeWidgetsDraggable');
    event.sender.send('addWidgetRightClick');
    event.sender.send('setOpacity', this._model.preset.opacity);
  }

  /* updates opacity in preset */
  updateOpacity(opacity) {
    this._model.preset.opacity = opacity / 100;
  }
};
