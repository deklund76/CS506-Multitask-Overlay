const _ = require('lodash');
const fs = require('fs');
const Preset = require('./Preset.js');

module.exports = class Model {
  constructor() {
    this._selectedIndex = -1;
    this._filePath = `${process.cwd()}/assets/presetList.json`;
    const parsedPresets = (fs.existsSync(this._filePath)) ? JSON.parse(fs.readFileSync(this._filePath, 'utf8')).presets : [];
    this._presetList = [];
    if (parsedPresets.length > 0) {
      parsedPresets.forEach(p => {
        this._presetList.push(new Preset(p._name, p._widgetList, p._resolution, p._opacity, p._gridHeight, p._gridWidth, p._gameType, p._background));
      });
      this._selectedIndex = 0;
    }
  }

  /* Getters and Setters */

  get presetList() {
    return this._presetList;
  }

  set presetList(presetList) {
    this._presetList = _.clone(presetList);
  }

  get preset() {
    return this._presetList[this._selectedIndex];
  }

  get selectedIndex() {
    return this._selectedIndex;
  }

  set selectedIndex(selectedIndex) {
    this._selectedIndex = selectedIndex;
  }

  get filePath() {
    return this._filePath;
  }

  /* mainly used for testing */
  set filePath(filePath) {
    this._filePath = filePath;
  }

  /* Methods */

  /* Creates a new preset and selects it */
  createPreset() {
    const preset = new Preset('new');
    this._presetList.push(preset);
    this._selectedIndex = this._presetList.length - 1;
  }

  /* Duplicates the current preset and selects it */
  duplicatePreset() {
    this._presetList.splice(this._selectedIndex, 0, new Preset(this.preset.name + '- copy', this.preset.widgetList, this.preset.resolution, this.preset.opacity, this.preset.gridHeight, this.preset.gridWidth, this.preset.gameType, this.preset._background));
  }

  /* Deletes selected preset from local file system */
  deletePreset() {
    this._presetList.splice(this._selectedIndex, 1);
    this.savePreset();
    this._selectedIndex = 0;
  }

  /* Saves selected preset */
  savePreset() {
    fs.writeFileSync(this._filePath, JSON.stringify({ presets: this._presetList }, null, 2));
  }
};
