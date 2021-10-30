import { getRandomInt, isEven, copy } from '../../../helpers/extras';

test('Testing getRandomInt', function () {
  expect(getRandomInt(10)).toEqual(expect.any(Number));
  expect(getRandomInt()).toEqual(expect.any(Number));
  expect(getRandomInt(0)).toEqual(expect.any(Number));
});

test('Testing isEven', function () {
  expect(isEven(3)).toBeFalsy();
  expect(isEven(4)).toBeTruthy();
});

test('Should not keep the reference', function () {
  const ref = { val: 123 };
  const myCopy = copy(ref);
  ref.val = 321;
  expect(ref.val).not.toBe(myCopy.val);
});
