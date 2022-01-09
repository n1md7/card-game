import { Card } from '../../../game/Card';
import { Rank, Suit } from '../../../game/types';
import { CardCombination, FullyQualifiedUrlParser } from '../../../libs/Formulas';

describe.each([
  [Rank.ACE, [Rank.ACE], []],
  [Rank.ACE, [Rank.TWO], []],
  [Rank.ACE, [Rank.THREE], []],
  [Rank.ACE, [Rank.FOUR], []],
  [Rank.ACE, [Rank.FIVE], []],
  [Rank.ACE, [Rank.SIX], []],
  [Rank.ACE, [Rank.SEVEN], []],
  [Rank.ACE, [Rank.EIGHT], []],
  [Rank.ACE, [Rank.NINE], []],
  [Rank.ACE, [Rank.TEN], [[0]]],
  [Rank.ACE, [Rank.JACK], []],
  [Rank.ACE, [Rank.QUEEN], []],
  [Rank.ACE, [Rank.KING], []],
  [Rank.TWO, [Rank.ACE], []],
  [Rank.TWO, [Rank.TWO], []],
  [Rank.TWO, [Rank.THREE], []],
  [Rank.TWO, [Rank.FOUR], []],
  [Rank.TWO, [Rank.FIVE], []],
  [Rank.TWO, [Rank.SIX], []],
  [Rank.TWO, [Rank.SEVEN], []],
  [Rank.TWO, [Rank.EIGHT], []],
  [Rank.TWO, [Rank.NINE], [[0]]],
  [Rank.TWO, [Rank.TEN], []],
  [Rank.TWO, [Rank.JACK], []],
  [Rank.TWO, [Rank.QUEEN], []],
  [Rank.TWO, [Rank.KING], []],
  [Rank.THREE, [Rank.ACE], []],
  [Rank.THREE, [Rank.TWO], []],
  [Rank.THREE, [Rank.THREE], []],
  [Rank.THREE, [Rank.FOUR], []],
  [Rank.THREE, [Rank.FIVE], []],
  [Rank.THREE, [Rank.SIX], []],
  [Rank.THREE, [Rank.SEVEN], []],
  [Rank.THREE, [Rank.EIGHT], [[0]]],
  [Rank.THREE, [Rank.NINE], []],
  [Rank.THREE, [Rank.TEN], []],
  [Rank.THREE, [Rank.JACK], []],
  [Rank.THREE, [Rank.QUEEN], []],
  [Rank.THREE, [Rank.KING], []],
  [Rank.FOUR, [Rank.ACE], []],
  [Rank.FOUR, [Rank.TWO], []],
  [Rank.FOUR, [Rank.THREE], []],
  [Rank.FOUR, [Rank.FOUR], []],
  [Rank.FOUR, [Rank.FIVE], []],
  [Rank.FOUR, [Rank.SIX], []],
  [Rank.FOUR, [Rank.SEVEN], [[0]]],
  [Rank.FOUR, [Rank.EIGHT], []],
  [Rank.FOUR, [Rank.NINE], []],
  [Rank.FOUR, [Rank.TEN], []],
  [Rank.FOUR, [Rank.JACK], []],
  [Rank.FOUR, [Rank.QUEEN], []],
  [Rank.FOUR, [Rank.KING], []],
  [Rank.FIVE, [Rank.ACE], []],
  [Rank.FIVE, [Rank.TWO], []],
  [Rank.FIVE, [Rank.THREE], []],
  [Rank.FIVE, [Rank.FOUR], []],
  [Rank.FIVE, [Rank.FIVE], []],
  [Rank.FIVE, [Rank.SIX], [[0]]],
  [Rank.FIVE, [Rank.SEVEN], []],
  [Rank.FIVE, [Rank.EIGHT], []],
  [Rank.FIVE, [Rank.NINE], []],
  [Rank.FIVE, [Rank.TEN], []],
  [Rank.FIVE, [Rank.JACK], []],
  [Rank.FIVE, [Rank.QUEEN], []],
  [Rank.FIVE, [Rank.KING], []],
  [Rank.SIX, [Rank.ACE], []],
  [Rank.SIX, [Rank.TWO], []],
  [Rank.SIX, [Rank.THREE], []],
  [Rank.SIX, [Rank.FOUR], []],
  [Rank.SIX, [Rank.FIVE], [[0]]],
  [Rank.SIX, [Rank.SIX], []],
  [Rank.SIX, [Rank.SEVEN], []],
  [Rank.SIX, [Rank.EIGHT], []],
  [Rank.SIX, [Rank.NINE], []],
  [Rank.SIX, [Rank.TEN], []],
  [Rank.SIX, [Rank.JACK], []],
  [Rank.SIX, [Rank.QUEEN], []],
  [Rank.SIX, [Rank.KING], []],
  [Rank.SEVEN, [Rank.ACE], []],
  [Rank.SEVEN, [Rank.TWO], []],
  [Rank.SEVEN, [Rank.THREE], []],
  [Rank.SEVEN, [Rank.FOUR], [[0]]],
  [Rank.SEVEN, [Rank.FIVE], []],
  [Rank.SEVEN, [Rank.SIX], []],
  [Rank.SEVEN, [Rank.SEVEN], []],
  [Rank.SEVEN, [Rank.EIGHT], []],
  [Rank.SEVEN, [Rank.NINE], []],
  [Rank.SEVEN, [Rank.TEN], []],
  [Rank.SEVEN, [Rank.JACK], []],
  [Rank.SEVEN, [Rank.QUEEN], []],
  [Rank.SEVEN, [Rank.KING], []],
  [Rank.EIGHT, [Rank.ACE], []],
  [Rank.EIGHT, [Rank.TWO], []],
  [Rank.EIGHT, [Rank.THREE], [[0]]],
  [Rank.EIGHT, [Rank.FOUR], []],
  [Rank.EIGHT, [Rank.FIVE], []],
  [Rank.EIGHT, [Rank.SIX], []],
  [Rank.EIGHT, [Rank.SEVEN], []],
  [Rank.EIGHT, [Rank.EIGHT], []],
  [Rank.EIGHT, [Rank.NINE], []],
  [Rank.EIGHT, [Rank.TEN], []],
  [Rank.EIGHT, [Rank.JACK], []],
  [Rank.EIGHT, [Rank.QUEEN], []],
  [Rank.EIGHT, [Rank.KING], []],
  [Rank.NINE, [Rank.ACE], []],
  [Rank.NINE, [Rank.TWO], [[0]]],
  [Rank.NINE, [Rank.THREE], []],
  [Rank.NINE, [Rank.FOUR], []],
  [Rank.NINE, [Rank.FIVE], []],
  [Rank.NINE, [Rank.SIX], []],
  [Rank.NINE, [Rank.SEVEN], []],
  [Rank.NINE, [Rank.EIGHT], []],
  [Rank.NINE, [Rank.NINE], []],
  [Rank.NINE, [Rank.TEN], []],
  [Rank.NINE, [Rank.JACK], []],
  [Rank.NINE, [Rank.QUEEN], []],
  [Rank.NINE, [Rank.KING], []],
  [Rank.TEN, [Rank.ACE], [[0]]],
  [Rank.TEN, [Rank.TWO], []],
  [Rank.TEN, [Rank.THREE], []],
  [Rank.TEN, [Rank.FOUR], []],
  [Rank.TEN, [Rank.FIVE], []],
  [Rank.TEN, [Rank.SIX], []],
  [Rank.TEN, [Rank.SEVEN], []],
  [Rank.TEN, [Rank.EIGHT], []],
  [Rank.TEN, [Rank.NINE], []],
  [Rank.TEN, [Rank.TEN], []],
  [Rank.TEN, [Rank.JACK], []],
  [Rank.TEN, [Rank.QUEEN], []],
  [Rank.TEN, [Rank.KING], []],
])(
  'Should verify combinations for single [%s]=>%s',
  /**
   * @param {Rank} playerCardRank
   * @param {Rank[]} tableCardRanks
   * @param {number[][]} expectedCombinations
   */
  (playerCardRank, tableCardRanks, expectedCombinations) => {
    test(`And result has to be ${JSON.stringify(expectedCombinations)}`, () => {
      const availableCombinations = new CardCombination(
        new Card(playerCardRank, Suit.SPADES),
        tableCardRanks.map((rank) => new Card(rank, Suit.SPADES)),
      ).calculate();
      expect(availableCombinations).toEqual(expectedCombinations);
    });
  },
);

describe.each([
  [Rank.ACE, [Rank.ACE, Rank.TWO], []],
  [Rank.ACE, [Rank.ACE, Rank.THREE], []],
  [Rank.ACE, [Rank.ACE, Rank.FOUR], []],
  [Rank.ACE, [Rank.ACE, Rank.FIVE], []],
  [Rank.ACE, [Rank.ACE, Rank.SIX], []],
  [Rank.ACE, [Rank.ACE, Rank.SEVEN], []],
  [Rank.ACE, [Rank.ACE, Rank.EIGHT], []],
  [Rank.ACE, [Rank.ACE, Rank.NINE], [[0, 1]]],
  [Rank.ACE, [Rank.ACE, Rank.TEN], [[1]]],

  [Rank.ACE, [Rank.TWO, Rank.THREE], []],
  [Rank.ACE, [Rank.TWO, Rank.FOUR], []],
  [Rank.ACE, [Rank.TWO, Rank.FIVE], []],
  [Rank.ACE, [Rank.TWO, Rank.SIX], []],
  [Rank.ACE, [Rank.TWO, Rank.SEVEN], []],
  [Rank.ACE, [Rank.TWO, Rank.EIGHT], [[0, 1]]],
  [Rank.ACE, [Rank.TWO, Rank.NINE], []],
  [Rank.ACE, [Rank.TWO, Rank.TEN], [[1]]],

  [Rank.ACE, [Rank.THREE, Rank.FOUR], []],
  [Rank.ACE, [Rank.THREE, Rank.FIVE], []],
  [Rank.ACE, [Rank.THREE, Rank.SIX], []],
  [Rank.ACE, [Rank.THREE, Rank.SEVEN], [[0, 1]]],
  [Rank.ACE, [Rank.THREE, Rank.EIGHT], []],
  [Rank.ACE, [Rank.THREE, Rank.NINE], []],
  [Rank.ACE, [Rank.THREE, Rank.TEN], [[1]]],

  [Rank.ACE, [Rank.FOUR, Rank.FIVE], []],
  [Rank.ACE, [Rank.FOUR, Rank.SIX], [[0, 1]]],
  [Rank.ACE, [Rank.FOUR, Rank.SEVEN], []],
  [Rank.ACE, [Rank.FOUR, Rank.EIGHT], []],
  [Rank.ACE, [Rank.FOUR, Rank.NINE], []],
  [Rank.ACE, [Rank.FOUR, Rank.TEN], [[1]]],

  [Rank.ACE, [Rank.FIVE, Rank.SIX], []],
  [Rank.ACE, [Rank.FIVE, Rank.SEVEN], []],
  [Rank.ACE, [Rank.FIVE, Rank.EIGHT], []],
  [Rank.ACE, [Rank.FIVE, Rank.NINE], []],
  [Rank.ACE, [Rank.FIVE, Rank.TEN], [[1]]],

  [Rank.ACE, [Rank.SIX, Rank.SEVEN], []],
  [Rank.ACE, [Rank.SIX, Rank.EIGHT], []],
  [Rank.ACE, [Rank.SIX, Rank.NINE], []],
  [Rank.ACE, [Rank.SIX, Rank.TEN], [[1]]],

  [Rank.ACE, [Rank.SEVEN, Rank.SEVEN], []],
  [Rank.ACE, [Rank.SEVEN, Rank.EIGHT], []],
  [Rank.ACE, [Rank.SEVEN, Rank.NINE], []],
  [Rank.ACE, [Rank.SEVEN, Rank.TEN], [[1]]],

  [Rank.ACE, [Rank.EIGHT, Rank.EIGHT], []],
  [Rank.ACE, [Rank.EIGHT, Rank.NINE], []],
  [Rank.ACE, [Rank.EIGHT, Rank.TEN], [[1]]],

  [Rank.ACE, [Rank.NINE, Rank.NINE], []],
  [Rank.ACE, [Rank.NINE, Rank.TEN], [[1]]],

  [Rank.ACE, [Rank.TEN, Rank.TEN], [[0], [1]]],
])(
  'Should verify combinations for two [%s]=>%s',
  /**
   * @param {Rank} playerCardRank
   * @param {Rank[]} tableCardRanks
   * @param {number[][]} expectedCombinations
   */
  (playerCardRank, tableCardRanks, expectedCombinations) => {
    test(`And the result is expected to be ${JSON.stringify(expectedCombinations)}`, () => {
      const availableCombinations = new CardCombination(
        new Card(playerCardRank, Suit.SPADES),
        tableCardRanks.map((rank) => new Card(rank, Suit.SPADES)),
      ).calculate();
      expect(availableCombinations).toEqual(expectedCombinations);
    });
  },
);

describe.each([
  [Rank.ACE, [Rank.ACE, Rank.TWO, Rank.THREE, Rank.FOUR], [[0, 1, 2, 3]]],
  [Rank.ACE, [Rank.ACE, Rank.TWO, Rank.THREE, Rank.TEN, Rank.FOUR], [[0, 1, 2, 4], [3]]],
  [Rank.ACE, [Rank.ACE, Rank.TWO, Rank.THREE, Rank.TEN, Rank.FOUR, Rank.TEN, Rank.TEN], [[0, 1, 2, 4], [3], [5], [6]]],
  [Rank.ACE, [Rank.TEN, Rank.TEN, Rank.THREE, Rank.KING, Rank.TEN, Rank.TEN], [[0], [1], [4], [5]]],
  [
    Rank.FOUR,
    [Rank.TEN, Rank.FOUR, Rank.FIVE, Rank.TWO, Rank.ACE, Rank.FOUR],
    [
      [1, 3, 4],
      [2, 3],
      [3, 4, 5],
    ],
  ],
  [Rank.JACK, [], []],
  [Rank.JACK, [Rank.ACE, Rank.QUEEN, Rank.QUEEN, Rank.KING, Rank.TEN], [[0, 1, 2, 4]]],
  [Rank.JACK, [Rank.JACK, Rank.QUEEN, Rank.QUEEN, Rank.QUEEN, Rank.TEN], [[0, 2, 3, 4]]],
  [Rank.JACK, [Rank.JACK, Rank.QUEEN, Rank.QUEEN, Rank.QUEEN, Rank.QUEEN], [[0, 1, 2, 3, 4]]],
  [Rank.JACK, [Rank.TWO, Rank.SIX, Rank.KING, Rank.KING, Rank.TEN], [[0, 1, 2, 3, 4]]],
  [
    Rank.JACK,
    [
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
    ],
    // Odd amount of Queens and Kings so leaving on the table
    [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10]],
  ],
  [
    Rank.JACK,
    [
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
    ],
    // Even amount of Queens and Kings so taking em all
    [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25]],
  ],
  [
    Rank.JACK,
    [
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
    ],
    [
      [
        // Odd amount of Queens and Kings
        // If you are wondering why??? => Kings and Queens are removed from the beginning unless it has suit Clubs
        // So in this case we have to take all the Kings and Queens from the indexes 11, 12.
        // This test case makes sure the cards are having suit Spades which means Clubs priority does not apply
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
        32, 33, 34, 35, 36, 37, 38,
      ],
    ],
  ],
  [
    Rank.JACK,
    [
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.JACK,
      Rank.QUEEN,
      Rank.KING,
      Rank.ACE,
      Rank.TWO,
      Rank.THREE,
      Rank.FIVE,
      Rank.FOUR,
      Rank.SIX,
      Rank.SEVEN,
      Rank.EIGHT,
      Rank.NINE,
      Rank.TEN,
      Rank.QUEEN,
      Rank.KING,
    ],
    [
      [
        // Even amount, take em all. One Jack is missing since player is holding it. Total cards 52
        0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29,
        30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 47, 48, 49, 50,
      ],
    ],
  ],
  [Rank.QUEEN, [Rank.TWO, Rank.SIX, Rank.KING, Rank.KING, Rank.TEN], []],
  [Rank.QUEEN, [Rank.TWO, Rank.QUEEN, Rank.KING, Rank.KING, Rank.TEN], [[1]]],
  [Rank.QUEEN, [Rank.QUEEN, Rank.QUEEN, Rank.QUEEN, Rank.KING, Rank.TEN], [[0], [1], [2]]],
  [Rank.KING, [Rank.TWO, Rank.SIX, Rank.KING, Rank.KING, Rank.TEN], [[2], [3]]],
  [Rank.KING, [Rank.TWO, Rank.QUEEN, Rank.KING, Rank.TEN, Rank.TEN], [[2]]],
  [Rank.KING, [Rank.QUEEN, Rank.QUEEN, Rank.QUEEN, Rank.KING], [[3]]],
])(
  'Should verify combinations for multiple [%s]=>%s',
  /**
   * @param {Rank} playerCardRank
   * @param {Rank[]} tableCardRanks
   * @param {number[][]} expectedCombinations
   */
  (playerCardRank, tableCardRanks, expectedCombinations) => {
    test(`And the result is expected to be ${JSON.stringify(expectedCombinations)}`, () => {
      const availableCombinations = new CardCombination(
        new Card(playerCardRank, Suit.SPADES),
        tableCardRanks.map((rank) => new Card(rank, Suit.SPADES)),
      ).calculate();
      expect(availableCombinations).toEqual(expectedCombinations);
    });
  },
);

describe.each([
  [Rank.JACK, [], []],
  [
    Rank.JACK,
    [
      { rank: Rank.QUEEN, suit: Suit.CLUBS },
      { rank: Rank.QUEEN, suit: Suit.SPADES },
      { rank: Rank.QUEEN, suit: Suit.DIAMONDS },
      { rank: Rank.KING, suit: Suit.SPADES },
      { rank: Rank.KING, suit: Suit.CLUBS },
      { rank: Rank.KING, suit: Suit.DIAMONDS },
      { rank: Rank.TWO, suit: Suit.DIAMONDS },
    ],
    // The first Queen has suit Clubs (high priority) skipping and the next Queen gets removed => index 1
    // The first King has suit Spades (low priority) getting removed => index 3; keeping 4 and 5
    [[0, 2, 4, 5, 6]],
  ],
  [
    Rank.JACK,
    [
      { rank: Rank.QUEEN, suit: Suit.CLUBS },
      { rank: Rank.QUEEN, suit: Suit.DIAMONDS },
      { rank: Rank.KING, suit: Suit.SPADES },
      { rank: Rank.KING, suit: Suit.CLUBS },
      { rank: Rank.FIVE, suit: Suit.DIAMONDS },
      { rank: Rank.TWO, suit: Suit.DIAMONDS },
    ],
    [[0, 1, 2, 3, 4, 5]],
  ],
  [
    Rank.JACK,
    [
      { rank: Rank.QUEEN, suit: Suit.CLUBS },
      { rank: Rank.KING, suit: Suit.SPADES },
      { rank: Rank.KING, suit: Suit.CLUBS },
      { rank: Rank.FIVE, suit: Suit.DIAMONDS },
      { rank: Rank.TWO, suit: Suit.DIAMONDS },
    ],
    [[1, 2, 3, 4]],
  ],
])(
  'Should verify combinations for multiple(mixed suit) [%s]=>%o',
  /**
   * @param {Rank} playerCardRank
   * @param {{suit:Suit, rank:Rank}[]} tableCards
   * @param {number[][]} expectedCombinations
   */
  (playerCardRank, tableCards, expectedCombinations) => {
    test(`And the result is expected to be ${JSON.stringify(expectedCombinations)}`, () => {
      const availableCombinations = new CardCombination(
        new Card(playerCardRank, Suit.SPADES),
        tableCards.map((card) => new Card(card.rank, card.suit)),
      ).calculate();
      expect(availableCombinations).toEqual(expectedCombinations);
    });
  },
);
