require('../../../helpers/index');

describe('Test helper functions', () => {
    it('should remove an element from the list',  () => {
        const list = [1,2,34,5];
        const previousLength = list.length;
        list.remove(2);
        const currentLength = list.length;
        expect(previousLength).not.toBe(currentLength);
    });

    it('should remove an element from the strings list',  () => {
        const list = ['hey', 'you'];
        list.remove('you');
        expect(list.length).toBe(1);
        list.remove('you');
        // still should be one
        expect(list.length).toBe(1);
    });
})