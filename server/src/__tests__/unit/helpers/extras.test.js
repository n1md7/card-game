import { getRandomInt, isEven } from '../../../helpers/extras';

test('Testing getRandomInt', function () {
  expect(getRandomInt(10)).toEqual(expect.any(Number));
  expect(getRandomInt()).toEqual(expect.any(Number));
  expect(getRandomInt(0)).toEqual(expect.any(Number));
});

test('Testing isEven', function () {
  expect(isEven(3)).toBeFalsy();
  expect(isEven(4)).toBeTruthy();
});
