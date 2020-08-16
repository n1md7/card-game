const sum = (a, b) => a + b;
const sumAsync = (a, b) => Promise.resolve(a + b);
describe(' Here are async tests', () => {
   it('should do async sum of 1 + 3', async () => {
       const answer = await sumAsync(1, 3);
       expect(answer).toBe(4);
   })
});


test('Calculates sum of 1 + 2', async () => {
    expect(sum(1, 2)).toBe(3);
}, 1000 /* optional timeout */);