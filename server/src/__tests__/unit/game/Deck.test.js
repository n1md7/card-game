import Deck from '../../../game/Deck';

const DECK_SIZE = 52;
describe('Deck', () => {
  it('should test defined methods', function () {
    const deck = new Deck();
    expect(deck.isEmpty).toBeDefined();
    expect(deck.size).toBeDefined();
    expect(deck.distributeCards).toBeDefined();
  });

  it('should test .isEmpty method', function () {
    const deck = new Deck();
    expect(deck.isEmpty()).toBeFalsy();
  });

  it('should test .size getter property', function () {
    const deck = new Deck();
    expect(deck.size).toBe(DECK_SIZE);
  });

  it('should test .takeCards method', function () {
    const deck = new Deck();
    const amountOfCardsToGet = 10;
    const cards = deck.distributeCards(amountOfCardsToGet);
    expect(cards).toHaveLength(amountOfCardsToGet);
  });

  it('should throw error when .takeCards exceeds', function () {
    const deck = new Deck();
    const amountOfCardsToGet = DECK_SIZE + 1;
    expect(() => {
      deck.distributeCards(amountOfCardsToGet);
    }).toThrow('Not enough cards in deck!');
  });

  it('should not throw error when param is max deck size', function () {
    const deck = new Deck();
    const amountOfCardsToGet = DECK_SIZE;
    expect(() => {
      deck.distributeCards(amountOfCardsToGet);
    }).not.toThrow('Not enough cards in deck!');
  });
});
