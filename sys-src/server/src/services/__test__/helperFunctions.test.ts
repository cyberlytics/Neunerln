import { getRandomElementFromArray, shuffle } from "../helperFunctions";

describe('shuffle', () => {
    it('changes order of elements', async () => {
        const originalArray = [1, 2, 3, 4];
        const shuffledArray = [...originalArray];

        shuffle(shuffledArray);
    
        expect(shuffledArray.length).toBe(originalArray.length);
        expect(shuffledArray.some((value, i) => value != originalArray[i]));
    });
});

describe('getRandomElementFromArray', () => {
    it('returns element from array', async () => {
        const array = [1, 2, 3, 4];

        for (let i = 0; i < 50; i++) {
            const randomElement = getRandomElementFromArray(array);
            
            expect(array).toContain(randomElement);
        }
    });
});  