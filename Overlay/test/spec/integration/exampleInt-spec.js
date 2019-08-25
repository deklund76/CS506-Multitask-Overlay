const { expect } = require('chai');

describe('This is how you group integration tests', () => {
  it('The remainder should be 2', () => {
    const result = Math.floor(9 / 4);
    expect(result).to.equal(2);
  });
});
