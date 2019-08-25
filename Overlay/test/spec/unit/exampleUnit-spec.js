const { expect } = require('chai');

describe('This is how you group unit tests', () => {
  it('Should be true', () => {
    expect(true).to.equal(true);
  });

  it('Should add two numbers', () => {
    expect(2 + 2).to.equal(4);
  });
});
