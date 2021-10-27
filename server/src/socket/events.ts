import { Card } from '../game/Card';
import { CardRankName, cardRanksByName, CardSuit, cardSuitsByName } from '../constant/cardConstants';
import User from '../game/User';
import PlayerModel from '../model/PlayerModel';
import Koa from 'koa';

type CardObject = {
  suit: CardSuit;
  rank: CardRankName;
};

type PlayerMoveObject = {
  playerCard: CardObject;
  tableCards: CardObject[];
};

const getCardFromCardObject = (cardObject: CardObject): Card => {
  const cardSuit = cardSuitsByName.get(cardObject.suit);
  const cardRank = cardObject.rank;
  const cardValue = cardRanksByName.get(cardRank);

  return new Card(cardSuit, cardRank, cardValue);
};

export const playerMove = (user: User, koa: Koa) => (playerMoveObject: PlayerMoveObject) => {
  try {
    const player = PlayerModel.getById(user.id);
    const playerCard = getCardFromCardObject(playerMoveObject.playerCard);
    const tableCards = playerMoveObject.tableCards.map(getCardFromCardObject);
    if (tableCards.length === 0) {
      player.placeCard(playerCard);
    } else {
      player.takeCardsFromTable(playerCard, tableCards);
    }
  } catch (error) {
    koa.emit('error:socket', error.toString());
  }
};
