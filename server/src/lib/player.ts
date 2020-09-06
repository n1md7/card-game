import { Card } from "./card";
import { ActionType } from "./constants";

class Player {
  private readonly name: string;
  private cards: Card[];
  private takenCards: Card[];
  private actionCallBack: (player: Player, type: ActionType, playerCard: Card, tableCards: Card[]) => void;
  constructor(name:string) {
    this.name = name;
    this.cards = [];
    this.takenCards = [];
  }

  equals(player: Player) {
    // TODO change equality check
    return this.name === player.name;
  }

  takeCards(cards: Card[]) {
    this.takenCards = [...this.takenCards, ...cards];
  }

  removeCardFromHand(card: Card) {
    if(this.cards.find(c => c.equals(card)) !== undefined)
      this.cards.remove(card);
  }

  setGameActionCallBack(callBack: (player: Player, type: ActionType, playerCard: Card, tableCards: Card[]) => void) {
    this.actionCallBack = callBack;
  }


  placeCard(card: Card) {
    if(this.cards.find(c => c.equals(card)) === undefined)
      throw Error("incorrect card");
    if(this.actionCallBack === undefined)
      throw Error("Ups error");
    this.actionCallBack(this, ActionType.PLACE_CARD, card, [])
  }

  takeCardsFromTable(card: Card, tableCards: Card[]) {
    if(this.cards.find(c => c.equals(card)) === undefined)
      throw Error("incorrect card");
    if(this.actionCallBack === undefined)
      throw Error("Ups error");
    if(tableCards.length === 0)
      throw Error("Ups error");
    this.actionCallBack(this, ActionType.PLACE_CARD, card, tableCards)
  }

}


export default Player;