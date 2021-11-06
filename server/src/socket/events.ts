import Card from '../game/Card';
import { CardRankName, cardRanksByName, CardSuit, cardSuitsByName } from 'shared-types';
import PlayerModel from '../model/PlayerModel';

type CardObject = {
  suit: CardSuit;
  rank: CardRankName;
};

type PlayerMoveObject = {
  playerCard: CardObject;
  tableCards: CardObject[];
};

export default class Events {
  private static getCardFromCardObject = (cardObject: CardObject): Card => {
    const cardSuit = cardSuitsByName.get(cardObject.suit);
    const cardRank = cardObject.rank;
    const cardValue = cardRanksByName.get(cardRank);

    return new Card(cardSuit, cardRank, cardValue);
  };

  public playerMove(playerId: string) {
    // {playerMoveObject} is client passed data
    return (playerMoveObject: PlayerMoveObject) => {
      const player = PlayerModel.getById(playerId);
      const playerCard = Events.getCardFromCardObject(playerMoveObject.playerCard);
      const tableCards = playerMoveObject.tableCards.map(Events.getCardFromCardObject);
      // When table is not empty than process the request otherwise place target card from hand
      tableCards.length ? player.takeCardsFromTable(playerCard, tableCards) : player.placeCardFromHand(playerCard);
    };
  }
}
