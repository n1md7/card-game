const { id } = require('../../../helpers/ids');
const { not } = require('../../../helpers/extras');

describe.each([
  ['room', 7, 'R'],
  ['room', 3, 'R'],
  ['room', 4, 'R'],
  ['room', 2, 'R'],
  ['room', 34, 'R'],
  ['player', 7, 'P'],
  ['player', 3, 'P'],
  ['player', 4, 'P'],
  ['player', 2, 'P'],
  ['player', 34, 'P'],
  ['user', 7, 'U'],
  ['user', 3, 'U'],
  ['user', 4, 'U'],
  ['user', 2, 'U'],
  ['user', 34, 'U'],
])('Testing id.%s(%d)', (idFor, len, leadingLetter) => {
  it(`Should return ${leadingLetter}- and with ${len} letters long string`, () => {
    const generate = id[idFor](len);
    expect(generate).toHaveLength(len + 2);
    expect(generate[0]).toBe(leadingLetter);
  });
});

describe.each([
  [true, false],
  [false, true],
  [undefined, true],
  ['', true],
  [null, true],
  [0, true],
  ['Hey', false],
])('Testing not function not(%s)=>%s', (state, value) => {
  it(`Should return ${state}`, () => {
    expect(not(state)).toBe(value);
  });
});
