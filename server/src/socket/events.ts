import { Card } from "../game/Card";
import { cardRanksByName, cardSuitsByName } from "../constant/cardConstants";
import User from "../game/User";
import PlayerModel from "../model/PlayerModel";

type Seat = {
  seat: "up" | "down" | "left" | "right"
};

type CardObject = {
  suit: string;
  rank: string;
}

type PlayerMoveObject = {
  playerCard: CardObject,
  tableCards: CardObject[]
}


const getCardFromCardObject = ( cardObject: CardObject ): Card => {
  const cardSuit = cardSuitsByName.get( cardObject.suit );
  const cardRank = cardObject.rank;
  const cardValue = cardRanksByName.get( cardRank );
  return new Card( cardSuit, cardRank, cardValue );
}

export const playerMove = ( user: User ) => ( playerMoveObject: PlayerMoveObject ) => {
  try {
    const player = PlayerModel.getById( user.id );
    const playerCard = getCardFromCardObject( playerMoveObject.playerCard );
    const tableCards = playerMoveObject.tableCards.map( getCardFromCardObject );
    if ( tableCards.length === 0 ) {
      player.placeCard( playerCard );
    } else {
      player.takeCardsFromTable( playerCard, tableCards );
    }
  } catch ( ex ) {
    console.log( ex );
  }

};