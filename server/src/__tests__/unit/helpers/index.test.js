require('../../../helpers/index');

describe('Test helper functions', () => {
  it('should remove an element from the list', () => {
    const list = [1, 2, 34, 5];
    const previousLength = list.length;
    list.remove(2);
    const currentLength = list.length;
    expect(previousLength).not.toBe(currentLength);
  });

  it('should remove an element from the strings list', () => {
    const list = ['hey', 'you'];
    list.remove('you');
    expect(list.length).toBe(1);
    list.remove('you');
    // still should be one
    expect(list.length).toBe(1);
  });
});

describe.each([
  [[1, 2, 3, 4], 1, 3],
  [[1, 2, 3], 1, 2],
  [[1, 2], 1, 1],
  [[1, 2], 3, 2],
  [[1], 1, 0],
  [[], 1, 0],
])('Array.remove(%p, %i)', (list, remove, expected) => {
  it(`returns list len after remove operation which is: ${expected}`, () => {
    list.remove(remove);
    expect(list.length).toBe(expected);
  });
});
