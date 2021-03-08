import {Defaults, EllipseType, Event, GameData, GameSelectorType, Rank, SocketType, Suit, TableCardType} from './types';
import BaseGame from './BaseGame';
import {Card} from './Card';
import {random} from '../libs/Formulas';

export default class Game extends BaseGame {
  private readonly defaults: Defaults;
  private outerEllipse: EllipseType;
  private borderWidth = 4;
  private tableCards: TableCardType[] = [];

  constructor(selector: GameSelectorType, socketIO: SocketType, outerEllipse: EllipseType, defaults: Defaults) {
    super(selector, socketIO);
    this.defaults = defaults;
    this.outerEllipse = outerEllipse;
  }

  public run(): void {
    //const card01 = new Card(Rank.TWO, Suit.CLUBS).appendDOM(this.selector.table);
    const card02 = new Card(Rank.TEN, Suit.CLUBS).appendDOM(this.selector.table);
    //const card03 = new Card(Rank.ACE, Suit.CLUBS).appendDOM(this.selector.table);

    setTimeout(() => {
      //card01.remove();
      card02.left = 130;
      card02.action('update');
    }, 3000);
    this.attachEvents();
  }

  private attachEvents(): void {
    this.socketIO.on(Event.gameData, this.processGameData.bind(this));
    this.socketIO.on(Event.gameTakeCards, this.processGameTakeCards.bind(this));
    this.socketIO.on(Event.gameFinish, this.processGameFinish.bind(this));
    this.socketIO.on(Event.tableCardsAdd, this.processTableCardsAdd.bind(this));
  }

  private processGameData(data: GameData): void {}

  private processGameTakeCards(data: GameData): void {}

  private processGameFinish(data: any): void {
    console.log(`game:finish`, data);
  }

  private processTableCardsAdd(cards: TableCardType[]): void {
    this.tableCards = cards
      .map(card => {
        const xMax = this.defaults.tableWidth / 2;
        const x = random(
          -xMax + this.defaults.cardDiagonal / 2,
          +xMax - this.defaults.cardDiagonal,
        );
        const [yMin, yMax] = this.outerEllipse.y(x);
        const y = random(yMin, yMax - this.defaults.cardDiagonal);
        const top = (this.defaults.tableHeight / 2) - this.borderWidth + y;
        const left = (this.defaults.tableWidth / 2) - this.borderWidth + x;
        const rotate = random(0, 180);

        const $card = new Card(card.rank, card.suit);
        const cardInDom = this.selector.table.querySelector(`.js_${$card.id}`);
        if (!cardInDom) {
          $card.setPosition(left - 100, top - 100);
          $card.setRotation(rotate - 180);
          $card.appendDOM(this.selector.table);
          setTimeout(() => {
            $card.setPosition(left, top);
            $card.setRotation(rotate);
            $card.action('update');
          }, 100);
        }

        return {
          key: card.key,
          rank: card.rank,
          suit: card.suit,
          top,
          left,
          rotate,
        };
      });
  }
}
