import { Card } from '../game/Card';
import { CardRankName, cardRanksByName, CardSuit, cardSuitsByName } from 'shared-types';
import User from '../game/User';
import PlayerModel from '../model/PlayerModel';
import Koa from 'koa';
import { KoaEvent } from '../types';

type CardObject = {
  suit: CardSuit;
  rank: CardRankName;
};

type PlayerMoveObject = {
  playerCard: CardObject;
  tableCards: CardObject[];
};

export default class Events {
  constructor(private readonly koa: Koa) {}

  playerMove(user: User) {
    return (playerMoveObject: PlayerMoveObject) => {
      try {
        const player = PlayerModel.getById(user.id);
        const playerCard = Events.getCardFromCardObject(playerMoveObject.playerCard);
        const tableCards = playerMoveObject.tableCards.map(Events.getCardFromCardObject);
        if (tableCards.length === 0) {
          player.placeCardFromHand(playerCard);
        } else {
          player.takeCardsFromTable(playerCard, tableCards);
        }
      } catch (error) {
        this.koa.emit(KoaEvent.socketError, error.message || JSON.stringify(error));
      }
    };
  }

  private static getCardFromCardObject = (cardObject: CardObject): Card => {
    const cardSuit = cardSuitsByName.get(cardObject.suit);
    const cardRank = cardObject.rank;
    const cardValue = cardRanksByName.get(cardRank);

    return new Card(cardSuit, cardRank, cardValue);
  };
}
