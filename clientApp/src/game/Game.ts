import {
  Defaults,
  EllipseType,
  GameData,
  GameSelectorType,
  PlayerCardType,
  PlayerPlaceOptions,
  SocketType,
  TableCardType,
} from './types';
import BaseGame from './BaseGame';
import { ActionType, Card } from './Card';
import Ellipse, { ellipseFirstRange, isInRange, random } from '../libs/Formulas';
import { calculateAngle } from '../helpers/html-utils';
import Lo from 'lodash';
import { GameEvents } from 'shared-types';

type GameState = 'waiting' | 'playing' | 'finished';
type PlayerState = 'waiting' | 'playing' | 'finished';

export default class Game extends BaseGame {
  private borderWidth = 4;
  private readonly defaults: Defaults;
  private tableCards: { [x: string]: Card } = {};
  private playerTurn: PlayerPlaceOptions | null = PlayerPlaceOptions.down;
  private processGameDataCallback: ((data: GameData) => void) | null = null;
  private processOffcanvasRoundResults: ((data: any) => void) | null = null;
  private processOffcanvasGameResults: ((data: any) => void) | null = null;
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

  private static calculatedAnimationPoint(left: number, top: number, rotate = 0) {
    return {
      for: (playerTurn: PlayerPlaceOptions | null) => {
        console.log('playerTurn', playerTurn);
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

        return [left, top, rotate];
      },
    };
  }

  public run(): void {
    this.attachEvents();
  }

  public onProcessGameData(callback: (data: GameData) => void): void {
    this.processGameDataCallback = callback;
  }

  public onOffcanvasGameResults(callback1: (data: any) => void, callback2: (data: any) => void): void {
    this.processOffcanvasRoundResults = callback1;
    this.processOffcanvasGameResults = callback2;
  }

  private on(event: GameEvents, callback: (data: any) => void) {
    this.socketIO.on(event, callback);
  }

  private attachEvents(): void {
    this.on('player:turn', this['process:player-turn'].bind(this));
    this.on('game:players-data', this['process: individual players in the game room'].bind(this));
    this.on('take-card-from-table', this['process:take-card-from-table'].bind(this));
    this.on('one-game-finished', this['process:game-finish-one'].bind(this));
    this.on('game:round-results', this['process:game-round-results'].bind(this));
    this.on('full-game-finished', this['process:game-finish-full'].bind(this));
    this.on('game:results', this['process:game-results'].bind(this));
    this.on('add-card-on-table', this['process: add single/multiple card(s) on the table'].bind(this));
    this.on('player-cards', this['process:player-cards'].bind(this));
    this.on('game:start', this['process:game-start'].bind(this));

    this.calculateTableDims();
    this.activateMouseMoveEvents();
  }

  private 'process:game-start'() {
    console.log('game:started');
  }

  private 'process:player-cards'(cards: TableCardType[]): void {
    this.selector.actions.innerHTML = '';

    const fragment = new DocumentFragment();
    const createCardFragment = (card: TableCardType) => {
      const div = document.createElement('div');
      const cardObject = new Card(card.rank, card.suit);
      cardObject.htmlElement.removeAttribute('style');
      cardObject.appendDOM(div, 'actions');
      const actions = document.createElement('div');
      actions.className = 'x-card-actions';
      const placeBtn = document.createElement('button');
      placeBtn.className = 'btn btn-sm btn-outline-dark';
      placeBtn.innerText = 'Place';
      const takeBtn = document.createElement('button');
      takeBtn.className = 'btn btn-sm btn-outline-dark';
      takeBtn.innerText = 'Take';
      actions.appendChild(placeBtn);
      actions.appendChild(takeBtn);
      div.appendChild(actions);

      return {
        cardObject,
        cardContainer: div,
        takeBtn,
        placeBtn,
      };
    };
    console.log('process:player-cards', cards);
    cards.forEach((card) => {
      const { cardContainer, cardObject, takeBtn, placeBtn } = createCardFragment(card);
      cardObject.htmlElement.setAttribute('height', '128');
      takeBtn.onclick = () => {
        console.log('take card', card);
        this.socketIO.emit('player:move', {
          playerCard: card,
          // TODO implement selected cards here
          tableCards: [],
        });
      };
      placeBtn.onclick = () => {
        console.log('placeBtn', card);
        this.socketIO.emit('player:move', {
          playerCard: card,
          tableCards: [],
        });
      };
      fragment.appendChild(cardContainer);
    });

    this.selector.actions.appendChild(fragment);
  }

  private 'process:player-turn'(position: PlayerPlaceOptions): void {
    this.playerTurn = position;
  }

  private 'process: individual players in the game room'(data: GameData): void {
    console.log(`data:`, data);
    if (this.processGameDataCallback) {
      this.processGameDataCallback(data);
    }
  }

  private 'process:take-card-from-table'(data: GameData): void {}

  private 'process:game-finish-one'(data: any): void {
    console.log(`game:finish`, data);
    if (this.processOffcanvasRoundResults) {
      this.processOffcanvasRoundResults(data);
    }
  }

  private 'process:game-round-results'(data: any): void {
    console.log(`game:round-results`, data);
    if (this.processOffcanvasRoundResults) {
      this.processOffcanvasRoundResults(data);
    }
  }

  private 'process:game-finish-full'(data: any): void {
    console.log(`game:finish`, data);
    if (this.processOffcanvasGameResults) {
      this.processOffcanvasGameResults(data);
    }
  }

  private 'process:game-results'(data: any): void {
    console.log(`game:results`, data);
    if (this.processOffcanvasGameResults) {
      this.processOffcanvasGameResults(data);
    }
  }

  private 'process: add a single card on the table'(card: Card) {
    const { translatedX, translatedY, angle } = this.calculatedEllipsePointsAgainstCard(card);
    if (!this.tableCards.hasOwnProperty(card.id)) {
      this.tableCards[card.id] = card;
      const calculatedAnimatedPoint = Game.calculatedAnimationPoint(translatedX, translatedY, angle);
      const [$left, $top, $rotate] = calculatedAnimatedPoint.for(this.playerTurn);
      card.setPosition($left, $top);
      card.setRotation($rotate);
      card.appendDOM(this.selector.table);
      card.attachEvent('click', (event) => {
        event.preventDefault();
      });
      card.attachEvent('mousedown', (event) => {
        event.preventDefault();
        this.cardIsDragging = true;
        this.cardIsDraggingRef = event;
        this.cardIsDraggingObj = card;
        this.mouseInCard = {
          x: event.clientX - event.target.offsetLeft,
          y: event.clientY - event.target.offsetTop,
        };
        card.zIndex = ++this.zIndex;
      });
      card.animate({ translatedX, translatedY, angle });
    }
  }

  private 'process: add single/multiple card(s) on the table'(cards: PlayerCardType | PlayerCardType[]): void {
    if (!Array.isArray(cards)) {
      cards = [cards];
    }
    cards.forEach(({ name, suit }) => {
      const card = new Card(name, suit);
      this['process: add a single card on the table'](card);
    });
  }

  private calculatedEllipsePoints() {
    const table = {
      top: this.selector.table.offsetTop + this.xActionsHeight,
      left: this.selector.table.offsetLeft,
      width: this.selector.table.offsetWidth,
      height: this.selector.table.offsetHeight,
    };

    const widthPadding = 0;
    const heightPadding = widthPadding * (table.height / table.width);
    const height = table.height - this.borderWidth * 2 - 2 * heightPadding;
    const width = table.width - this.borderWidth * 2 - 2 * widthPadding;
    const ellipse = new Ellipse(width, height);

    return {
      table,
      width,
      height,
      ellipse,
      widthPadding,
      heightPadding,
    };
  }

  private calculatedEllipsePointsAgainstCard(card: Card, x$?: number) {
    const cWidth = card?.width ? card.width / 2 : 0;
    const cHeight = card?.height ? card.height / 2 : 0;
    const { table, ellipse, width, widthPadding, heightPadding, height } = this.calculatedEllipsePoints();
    // Translate xRanges from negative axis to positive
    const [startPointX, endPointX] = ellipseFirstRange(width);
    const startPointY = Math.abs(ellipse.y(startPointX)[0]);
    // Center of the ellipse(r is rotation)
    const base = {
      x: startPointX + width / 2 + widthPadding,
      y: startPointY + height / 2 + heightPadding,
      r: 0,
    };
    const x = x$ || random(startPointX, endPointX);
    const [yMin, yMax] = ellipse.y(x);
    const y = Lo.sample([yMin, yMax - cHeight]) as number;
    const translatedY = y + height / 2 + heightPadding;
    const translatedX = x + width / 2 + widthPadding;
    const A = { x: translatedX + cWidth, y: translatedY + cHeight };
    const B = { x: base.x, y: base.y };
    const C = { x: table.width / 2, y: table.height / 2 };
    const angle = 90 + calculateAngle(A, B, C) * (y > 0 ? -1 : 1);

    return {
      translatedX,
      translatedY,
      angle,
      card,
      table,
      ellipse,
    };
  }

  private calculateTableDims() {
    this.xActionsHeight = this.selector.nav.offsetHeight;
    this.table = {
      top: this.selector.table.offsetTop + this.xActionsHeight,
      left: this.selector.table.offsetLeft,
      width: this.selector.table.offsetWidth,
      height: this.selector.table.offsetHeight,
    };

    return {
      xActionsHeight: this.xActionsHeight,
      table: this.table,
    };
  }

  private getXYAxisValues() {
    const { width, widthPadding } = this.calculatedEllipsePoints();
    const translatedMouseX = -this.mouseX + width / 2 + widthPadding;
    const { table, ellipse, angle } = this.calculatedEllipsePointsAgainstCard(
      this.cardIsDraggingObj as Card,
      translatedMouseX,
    );
    const [yMin, yMax] = ellipse.y(this.mouseX - this.table.left - this.table.width / 2);
    const yAxisMin = yMin + table.height / 2 + table.top + this.borderWidth;
    const yAxisMax = yMax + table.height / 2 + table.top;

    return {
      yAxisMin,
      yAxisMax,
      angle,
    };
  }

  private activateMouseMoveEvents(): void {
    document.addEventListener('mousemove', (event) => {
      this.zIndex++;
      this.mouseX = event.clientX;
      this.mouseY = event.clientY;
      const tableRange = {
        x: {
          min: this.table.left,
          max: this.table.left + this.table.width,
        },
      };

      const { yAxisMin, yAxisMax } = this.getXYAxisValues();

      if (this.cardIsDragging) {
        if (this.cardIsDraggingObj && this.cardIsDraggingRef) {
          const left = this.mouseX - this.mouseInCard.x;
          const top = this.mouseY - this.mouseInCard.y;
          const xInRange = isInRange([tableRange.x.min, tableRange.x.max], this.mouseX);
          const yInRange = isInRange([yAxisMin, yAxisMax], this.mouseY);
          if (!xInRange || !yInRange) return;
          this.cardIsDraggingObj.setZIndex(this.zIndex);
          this.cardIsDraggingObj.setPosition(left, top);
          this.cardIsDraggingObj.setTransition('300ms', 'all');
          this.cardIsDraggingObj.action(ActionType.update);
          this.cardIsDraggingObj.removeTransition();
        }
      }
    });

    document.addEventListener('mouseup', (event) => {
      event.preventDefault();
      // FIXME: the angle calculation is obviously incorrect
      // const { angle } = this.getXYAxisValues();
      // this.cardIsDraggingObj?.setRotation(angle);
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
