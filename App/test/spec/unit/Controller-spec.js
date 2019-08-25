const sinon = require('sinon');
const _ = require('lodash');
const { expect } = require('chai');
const Controller = require(`${process.cwd()}/src/js/Controller/Controller.js`);

describe('Controller Unit Testing', () => {
  const modelMock = {
    selectedIndex: 0,
    createPreset() { return true; },
    savePreset() { return true; },
    deletePreset() { return true; },
    duplicatePreset() { return true; }
  };

  const mainWindowMock = { reload() { return true; } };

  describe('Preset Testing', () => {
    it('Should call Model\'s duplicatePreset', () => {
      const controller = new Controller(modelMock);
      controller.duplicatePreset(mainWindowMock);
    });

    it('Should call Model\'s createPreset', () => {
      const controller = new Controller(modelMock);
      controller.createPreset(mainWindowMock);
    });

    it('Should call Model\'s savePreset', () => {
      const controller = new Controller(modelMock);
      controller.savePreset();
    });

    it('Should call Model\'s deletePreset', () => {
      const controller = new Controller(modelMock);
      sinon.stub(controller, 'initialize');
      controller.deletePreset();
    });

    it('Should select the correct preset', () => {
      const modelCopy = _.cloneDeep(modelMock);
      const controller = new Controller(modelCopy);
      controller.selectPreset('preset-4');
      expect(modelCopy.selectedIndex).to.equal('4');
      controller.selectPreset('preset-13');
      expect(modelCopy.selectedIndex).to.equal('13');
      controller.selectPreset('preset-9000800167543');
      expect(modelCopy.selectedIndex).to.equal('9000800167543');
    });
  });
});
