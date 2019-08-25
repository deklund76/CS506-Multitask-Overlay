const { expect } = require('chai');
const fs = require('fs');
const Model = require(`${process.cwd()}/src/js/Model/Model.js`);
const Preset = require(`${process.cwd()}/src/js/Model/Preset.js`);

describe('Model Unit Testing', () => {
  const presetMock1 = {
    name: 'CSGO',
    widgetList: [],
    resolution: '1920x1080',
    opacity: '0',
    gridHeight: '5',
    gridWidth: '4',
    gameType: 'CSGO'
  };

  const presetMock2 = {
    name: 'LoL',
    resolution: '1920x1080',
    opacity: '0',
    gridHeight: '5',
    gridWidth: '4',
    gameType: 'LoL'
  };

  const presetMock3 = {
    name: 'RainbowSix',
    resolution: '1920x1080',
    opacity: '0',
    gridHeight: '5',
    gridWidth: '4',
    gameType: 'RainbowSix'
  };

  const presetList = [presetMock1, presetMock2, presetMock3];

  describe('Preset Testing', () => {
    it('Should save the preset list', () => {
      const filePath = `${__dirname}/presetList.json`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const model = new Model();
      model.presetList = presetList;
      model.filePath = filePath;
      model.savePreset();

      const presetListObj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(presetListObj).to.deep.equal({ presets: presetList });
    });

    it('Should create a new (empty) preset', () => {
      const model = new Model();
      model.presetList = [];
      model.createPreset();
      expect(model.presetList.length).to.equal(1);
      expect(model.presetList[0] instanceof Preset).to.equal(true);
    });

    it('Should delete the preset', () => {
      const filePath = `${__dirname}/presetList.json`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const model = new Model();
      model.filePath = filePath;
      model.presetList = presetList;
      model.selectedIndex = 0;
      model.deletePreset();

      const presetListObj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(model.presetList.length).to.equal(presetList.length - 1);
      expect(presetListObj).to.deep.equal({ presets: [presetMock2, presetMock3] });
    });

    it('Should duplicate the selected preset', () => {
      const model = new Model();
      model.presetList = [];
      presetList.forEach(p => {
        model.presetList.push(new Preset(p.name, p.widgetList, p.resolution, p.opacity, p.gridHeight, p.gridWidth, p.gameType));
      });

      model.selectedIndex = model.presetList.length - 1;
      const idx = model.selectedIndex;
      model.duplicatePreset();

      expect(model.presetList.length).to.equal(presetList.length + 1);
      expect(model.preset).to.deep.equal(model.presetList[idx]);
      expect(model.selectedIndex).to.equal(idx);
      expect(model.preset === model.presetList[idx + 1]).to.equal(false);
    });
  });
});
