import Deck from "./deck";
import Player from "./player";
import { ActionType } from "./constants";
import { Card } from "./card";

class Game {
  private deck: Deck;
  private players: Player[];
  private activePlayer: Player;
  constructor() {
    this.deck = new Deck();
    this.players = [];
  }

  joinPlayer(player: Player) {
    player.setGameActionCallBack(this.playerAction)
    this.players.push(player);
  }

  playerAction(player: Player, type: ActionType, playerCard: Card, tableCards: Card[]) {
    this.validateAction(player, type, playerCard, tableCards);
    if(type === ActionType.TAKE_CARDS) {
      this.deck.removeCards(tableCards);
      player.takeCards([...tableCards, playerCard]);
      player.removeCardFromHand(playerCard);
    }
  }

  validateAction(player: Player, type: ActionType, playerCard: Card, tableCards: Card[]) {
    if(!player.equals(this.activePlayer))
      throw Error("incorrect player");
    if(type === ActionType.TAKE_CARDS && (tableCards.length === 0 || !this.deck.containsCards(tableCards)))
      throw Error("incorrect cards");
    if(type === ActionType.TAKE_CARDS && !playerCard.canTakeCards(tableCards))
      throw Error("incorrect move");
  }

}

export default Game;