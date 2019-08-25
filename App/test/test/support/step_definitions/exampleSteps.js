const { Given, Then } = require('cucumber');
const { expect } = require('chai');

Given(/^I log a passed message "(.*)"$/, (msg) => {
  console.log(msg);
});

Then(/^I log a passed table$/, (table) => {
  console.log(JSON.stringify(table.hashes()[0]));
});

Then(/^I don't pass anything at all$/, () => {
  console.log('nothing was passed');
});

Then(/^I verify this sum$/, (table) => {
  const newTable = table.hashes()[0];
  const sum = parseInt(newTable.op1) + parseInt(newTable.op2);
  expect(sum).to.equal(parseInt(newTable.sum));
});
