import { Card } from '../../../game/Card';
import { CardRank, CardRankName, CardSuit } from '../../../constant/cardConstants';

describe('Card', function () {
  it('should have card methods defined', function () {
    const card = new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE);
    expect(card.canTakeCards).toBeDefined();
    expect(card.equals).toBeDefined();
  });

  it('should test .equals method when different cards', function () {
    const card = new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE);
    const compareCard = new Card(CardSuit.DIAMONDS, CardRankName.SEVEN, CardRank.SEVEN);
    expect(card.equals(compareCard)).toBeFalsy();
  });

  it('should test .equals method when the same cards', function () {
    const card = new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE);
    const compareCard = new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE);
    expect(card.equals(compareCard)).toBeTruthy();
  });

  it('should test .equals method when card is undefined', function () {
    const card = new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE);
    expect(card.equals(undefined)).toBeFalsy();
  });
});

describe('Card.canTakeCards', function () {
  it('should test .canTakeCards method when different cards', function () {
    const card = new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE);
    const compareCard = new Card(CardSuit.DIAMONDS, CardRankName.SEVEN, CardRank.SEVEN);
    expect(card.equals(compareCard)).toBeFalsy();
  });
});

describe.each([
  [new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE), [], false],
  [
    new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
    [new Card(CardSuit.CLUBS, CardRankName.TEN, CardRank.TEN)],
    true,
  ],
  [
    new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
    [
      new Card(CardSuit.CLUBS, CardRankName.TEN, CardRank.TEN),
      new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN),
      new Card(CardSuit.SPADES, CardRankName.TEN, CardRank.TEN),
    ],
    false,
  ],
  [
    new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
    [
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.SPADES, CardRankName.TWO, CardRank.TWO),
    ],
    false,
  ],
  [
    new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
    [
      new Card(CardSuit.DIAMONDS, CardRankName.NINE, CardRank.NINE),
      new Card(CardSuit.SPADES, CardRankName.ACE, CardRank.ACE),
    ],
    true,
  ],
  [
    new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
    [
      new Card(CardSuit.DIAMONDS, CardRankName.EIGHT, CardRank.EIGHT),
      new Card(CardSuit.SPADES, CardRankName.THREE, CardRank.THREE),
    ],
    false,
  ],
  [
    new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
    [
      new Card(CardSuit.DIAMONDS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.CLUBS, CardRankName.FIVE, CardRank.FIVE),
    ],
    true,
  ],
  [
    new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE),
    [
      new Card(CardSuit.DIAMONDS, CardRankName.FIVE, CardRank.FIVE),
      new Card(CardSuit.DIAMONDS, CardRankName.TWO, CardRank.TWO),
      new Card(CardSuit.DIAMONDS, CardRankName.THREE, CardRank.THREE),
    ],
    true,
  ],
])(
  'Testing canTakeCards',
  /**
   * @param {Card} card
   * @param {Card[]} cards
   * @param {boolean} canTake
   * */
  (card, cards, canTake) => {
    test(`Testing whether or not [${card.name}] can take any from [${cards.map(
      (c) => c.name,
    )}]. Should be [${canTake}]`, () => {
      expect(card.canTakeCards(cards)).toBe(canTake);
    });
  },
);
