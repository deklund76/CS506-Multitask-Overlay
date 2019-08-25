const { expect } = require('chai');
const fs = require('fs');
const sinon = require('sinon');
const Model = require(`${process.cwd()}/src/js/Model/Model.js`);
const Controller = require(`${process.cwd()}/src/js/Controller/Controller.js`);
const Preset = require(`${process.cwd()}/src/js/Model/Preset.js`);

describe('Integration Testing', () => {
  describe('Controller and Model', () => {
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

    const mainWindowMock = { reload() { return true; } };

    it('Should save the preset list', () => {
      const filePath = `${__dirname}/presetList.json`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const model = new Model();
      const controller = new Controller(model);
      model.presetList = presetList;
      model.filePath = filePath;
      controller.savePreset();

      const presetListObj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(presetListObj).to.deep.equal({ presets: presetList });
    });

    it('Should create a new (empty) preset', () => {
      const model = new Model();
      const controller = new Controller(model);
      const length = model.presetList.length;
      controller.createPreset(mainWindowMock);
      expect(model.presetList.length).to.equal(length + 1);
      expect(model.preset instanceof Preset).to.equal(true);
    });

    it('Should delete the preset', () => {
      const filePath = `${__dirname}/presetList.json`;
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }

      const model = new Model();
      const controller = new Controller(model);
      sinon.stub(controller, 'initialize');

      model.filePath = filePath;
      model.presetList = presetList;
      model.selectedIndex = 0;
      controller.deletePreset();

      const presetListObj = JSON.parse(fs.readFileSync(filePath, 'utf8'));
      expect(model.presetList.length).to.equal(presetList.length - 1);
      expect(presetListObj).to.deep.equal({ presets: [presetMock2, presetMock3] });
    });

    it('Should duplicate the selected preset', () => {
      const model = new Model();
      const controller = new Controller(model);
      model.presetList = [];
      presetList.forEach(p => {
        model.presetList.push(new Preset(p.name, p.widgetList, p.resolution, p.opacity, p.gridHeight, p.gridWidth, p.gameType));
      });

      model.selectedIndex = model.presetList.length - 1;
      const idx = model.selectedIndex;
      controller.duplicatePreset(mainWindowMock);

      expect(model.presetList.length).to.equal(presetList.length + 1);
      expect(model.preset).to.deep.equal(model.presetList[idx]);
      expect(model.selectedIndex).to.equal(idx);
      expect(model.preset === model.presetList[idx + 1]).to.equal(false);
    });

    it('Should select the correct preset', () => {
      const model = new Model();
      const controller = new Controller(model);
      model.presetList = [];
      presetList.forEach(p => {
        model.presetList.push(new Preset(p.name, p.widgetList, p.resolution, p.opacity, p.gridHeight, p.gridWidth, p.gameType));
      });

      controller.selectPreset('preset-1');
      expect(model.selectedIndex).to.equal('1');
      controller.selectPreset('preset-4');
      expect(model.selectedIndex).to.equal('4');
    });
  });
});
