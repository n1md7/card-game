import {
  Defaults,
  EllipseType,
  Event,
  GameData,
  GameSelectorType,
  PlayerPlaceOptions,
  SocketType,
  TableCardType,
} from './types';
import BaseGame from './BaseGame';
import { ActionType, Card } from './Card';
import Ellipse, { isInRange, random } from '../libs/Formulas';

type GameState = 'waiting' | 'playing' | 'finished';
type PlayerState = 'waiting' | 'playing' | 'finished';

export default class Game extends BaseGame {
  private borderWidth = 4;
  private readonly defaults: Defaults;
  private ellipse: EllipseType = new Ellipse(0, 0);
  private tableCards: { [x: string]: Card } = {};
  private playerTurn: PlayerPlaceOptions | null = PlayerPlaceOptions.down;
  private processGameDataCallback: ((data: GameData) => void) | null = null;
  private mouseX: number = 0;
  private mouseY: number = 0;
  private cardIsDragging = false;
  private cardIsDraggingRef: any | null = null;
  private cardIsDraggingObj: Card | null = null;
  private xActionsHeight = 0;
  private zIndex = 0;
  private table = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
  private mouseInCard = {
    x: 0,
    y: 0,
  };

  constructor(selector: GameSelectorType, socketIO: SocketType, outerEllipse: EllipseType, defaults: Defaults) {
    super(selector, socketIO);
    this.defaults = defaults;
  }

  private static calculatedAnimationPoint(left: number, top: number) {
    return {
      for: (playerTurn: PlayerPlaceOptions | null) => {
        const ANIMATION_COEFFICIENT = 100;
        switch (playerTurn) {
          case PlayerPlaceOptions.down:
            top += ANIMATION_COEFFICIENT;
            break;
          case PlayerPlaceOptions.up:
            top -= ANIMATION_COEFFICIENT;
            break;
          case PlayerPlaceOptions.left:
            left -= ANIMATION_COEFFICIENT;
            break;
          case PlayerPlaceOptions.right:
            left += ANIMATION_COEFFICIENT;
            break;
        }

        return [left, top, random(0, 180)];
      },
    };
  }

  public run(): void {
    //const card01 = new Card(Rank.TWO, Suit.CLUBS).appendDOM(this.selector.table);
    const initGameCards = [
      { rank: '9', suit: 'hearts', key: 'hearts9' },
      { rank: 'queen', suit: 'clubs', key: 'clubsqueen' },
      { rank: 'ace', suit: 'diamonds', key: 'diamondsace' },
      { rank: '5', suit: 'hearts', key: 'hearts5' },
    ] as Array<TableCardType>;
    this.processTableCardsAdd(initGameCards);

    this.attachEvents();
  }

  public onProcessGameData(callback: (data: GameData) => void): void {
    this.processGameDataCallback = callback;
  }

  private attachEvents(): void {
    this.socketIO.on(Event.playerTurn, this.processPlayerTurn.bind(this));
    this.socketIO.on(Event.gameData, this.processGameData.bind(this));
    this.socketIO.on(Event.gameTakeCards, this.processGameTakeCards.bind(this));
    this.socketIO.on(Event.gameFinish, this.processGameFinish.bind(this));
    this.socketIO.on(Event.tableCardsAdd, this.processTableCardsAdd.bind(this));
    this.socketIO.on(Event.playerCards, this.processPlayerCards.bind(this));

    this.tableDims();
    this.mouseMoveEvents();
  }

  private processPlayerCards(cards: Array<TableCardType>): void {
    // console.log('processPlayerCards', cards);
    cards.forEach((card) => {
      const cardObj = new Card(card.rank, card.suit);
      console.log('cardObj', cardObj.htmlElement);
      cardObj.htmlElement.removeAttribute('style');
      cardObj.appendDOM(this.selector.actions, 'actions');
      // this.tableCards[card.key] = cardObj;
    });
  }

  private processPlayerTurn(position: PlayerPlaceOptions): void {
    this.playerTurn = position;
  }

  private processGameData(data: GameData): void {
    if (this.processGameDataCallback) {
      this.processGameDataCallback(data);
    }
  }

  private processGameTakeCards(data: GameData): void {}

  private processGameFinish(data: any): void {
    console.log(`game:finish`, data);
  }

  private processTableCardsAdd(cards: Array<TableCardType>): void {
    const table = {
      top: (this.selector.table as HTMLDivElement).offsetTop + this.xActionsHeight,
      left: (this.selector.table as HTMLDivElement).offsetLeft,
      width: (this.selector.table as HTMLDivElement).offsetWidth,
      height: (this.selector.table as HTMLDivElement).offsetHeight,
    };
    cards.forEach((card) => {
      const { rank, suit } = card;
      const tableRange = {
        x: {
          min: table.left + 128,
          max: table.left + table.width - 128,
        },
      };
      const left = random(tableRange.x.min, tableRange.x.max);
      const ellipse = new Ellipse(table.width - 256, table.height - 256);
      const [yMin, yMax] = ellipse.y(left - table.left - table.width / 2);
      const yAxisMin = yMin + table.height / 2 + table.top + this.borderWidth;
      const yAxisMax = yMax + table.height / 2 + table.top;
      const top = random(yAxisMin, yAxisMax) - 64;
      const rotate = random(0, 180);
      const $card = new Card(rank, suit);
      if (!this.tableCards.hasOwnProperty($card.id)) {
        this.tableCards[$card.id] = $card;
        const [$left, $top, $rotate] = Game.calculatedAnimationPoint(left, top).for(this.playerTurn);
        $card.setPosition($left, $top);
        $card.setRotation($rotate);
        $card.appendDOM(this.selector.table);
        $card.attachEvent('click', (event) => {
          event.preventDefault();
        });
        $card.attachEvent('mousedown', (event) => {
          event.preventDefault();
          this.cardIsDragging = true;
          this.cardIsDraggingRef = event;
          this.cardIsDraggingObj = $card;
          this.mouseInCard = {
            x: event.clientX - event.target.offsetLeft,
            y: event.clientY - event.target.offsetTop,
          };
          $card.zIndex = this.zIndex++;
        });
        setTimeout(() => {
          $card.setPosition(left, top);
          $card.setRotation(rotate);
          $card.action(ActionType.update);
        }, 100);
      }
    });
  }

  private tableDims() {
    this.xActionsHeight = (this.selector.nav as HTMLDivElement).offsetHeight;
    this.table = {
      top: (this.selector.table as HTMLDivElement).offsetTop + this.xActionsHeight,
      left: (this.selector.table as HTMLDivElement).offsetLeft,
      width: (this.selector.table as HTMLDivElement).offsetWidth,
      height: (this.selector.table as HTMLDivElement).offsetHeight,
    };

    return {
      xActionsHeight: this.xActionsHeight,
      table: this.table,
    };
  }

  private mouseMoveEvents(): void {
    document.addEventListener('mousemove', (event: any) => {
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      const tableRange = {
        x: {
          min: this.table.left + 32,
          max: this.table.left + this.table.width - 32,
        },
      };
      this.ellipse = new Ellipse(this.table.width - 64, this.table.height - 32);
      const [yMin, yMax] = this.ellipse.y(this.mouseX - this.table.left - this.table.width / 2);
      const yAxisMin = yMin + this.table.height / 2 + this.table.top + this.borderWidth;
      const yAxisMax = yMax + this.table.height / 2 + this.table.top;

      if (this.cardIsDragging) {
        if (this.cardIsDraggingObj && this.cardIsDraggingRef) {
          const left = this.mouseX - this.mouseInCard.x;
          const top = this.mouseY - this.mouseInCard.y;
          const xInRange = isInRange([tableRange.x.min, tableRange.x.max], this.mouseX);
          const yInRange = isInRange([yAxisMin, yAxisMax], this.mouseY);
          if (!xInRange || !yInRange) return;

          //const doIt = (top: number, left: number) => {
          //  const div = document.createElement('div');
          //  div.style.width = '10px';
          //  div.style.height = '10px';
          //  div.style.position = 'absolute';
          //  div.style.border = '1px solid';
          //  div.style.borderRadius = '50%';
          //  div.style.top = top + 'px';
          //  div.style.left = left + 'px';
          //  document.body.appendChild(div);
          //};
          //[yAxisMin, yAxisMax].forEach(h => doIt(h, this.mouseX))
          this.cardIsDraggingObj.setPosition(left, top);
          this.cardIsDraggingObj.htmlElement.style.setProperty('transition', '300ms all');
          this.cardIsDraggingObj.action(ActionType.update);
          this.cardIsDraggingObj.htmlElement.style.removeProperty('transition');
        }
      }
    });

    document.addEventListener('mouseup', (event) => {
      event.preventDefault();
      this.cardIsDragging = false;
      this.cardIsDraggingRef = null;
      this.cardIsDraggingObj = null;
      this.mouseInCard = {
        x: 0,
        y: 0,
      };
    });
  }
}
