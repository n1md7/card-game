import { PlayerResult } from '../../../game/PlayerResult';
import Card from '../../../game/Card';
import { CardRank, CardRankName, CardSuit } from 'shared-types';

describe('PlayerResult', function () {
  it('should verify properties', function () {
    const aceDiamond = new Card(CardSuit.DIAMONDS, CardRankName.ACE, CardRank.ACE);
    const tenClubs = new Card(CardSuit.CLUBS, CardRankName.TEN, CardRank.TEN);
    const sevenHearts = new Card(CardSuit.HEARTS, CardRankName.SEVEN, CardRank.SEVEN);
    const fiveSpades = new Card(CardSuit.SPADES, CardRankName.FIVE, CardRank.FIVE);
    const deck = [fiveSpades, sevenHearts, aceDiamond, tenClubs];
    const playerResult = new PlayerResult(deck);

    expect(playerResult).toEqual({
      numberOfClubs: 1,
      numberOfCards: 4,
      hasTwoOfClubs: false,
      hasTenOfDiamonds: false,
    });
  });

  it('should verify properties with TwoOfClubs, TenOfDiamonds', function () {
    const tenDiamond = new Card(CardSuit.DIAMONDS, CardRankName.TEN, CardRank.TEN);
    const tenClubs = new Card(CardSuit.CLUBS, CardRankName.TEN, CardRank.TEN);
    const twoClubs = new Card(CardSuit.CLUBS, CardRankName.TWO, CardRank.TWO);
    const fiveSpades = new Card(CardSuit.SPADES, CardRankName.FIVE, CardRank.FIVE);
    const deck = [fiveSpades, twoClubs, tenDiamond, tenClubs];
    const playerResult = new PlayerResult(deck);
    playerResult.score = 2;

    expect(playerResult).toEqual({
      numberOfClubs: 2,
      numberOfCards: 4,
      hasTwoOfClubs: true,
      hasTenOfDiamonds: true,
      score: 2,
    });
  });

  it('should verify when empty', function () {
    const deck = [];
    const playerResult = new PlayerResult(deck);
    expect(playerResult).toEqual({
      numberOfClubs: 0,
      numberOfCards: 0,
      hasTwoOfClubs: false,
      hasTenOfDiamonds: false,
    });
  });
});
