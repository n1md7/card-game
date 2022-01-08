import {
  AddCardType,
  Defaults,
  EllipseType,
  GameData,
  GameSelectorType,
  PlayerPlaceOptions,
  PlayerScoresCardDto,
  SocketType,
  TableCardType,
} from './types';
import BaseGame from './BaseGame';
import { Card } from './Card';
import { random } from '../libs/Formulas';
import { GameEvents } from 'shared-types';
// @ts-ignore
import Draggable from 'draggable';

export default class Game extends BaseGame {
  private readonly defaults: Defaults;
  private tableCards: { [x: string]: Card } = {};
  private selectedTableCards: { [x: string]: Card } = {};
  private playerTurn: PlayerPlaceOptions | null = PlayerPlaceOptions.down;
  private processGameDataCallback: ((data: GameData) => void) | null = null;
  private processOffcanvasRoundResults: ((data: any) => void) | null = null;
  private processOffcanvasGameResults: ((data: any) => void) | null = null;
  private xActionsHeight = 40;
  private zIndex = 0;
  private table = {
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  };
  private gameIsStarted = false;

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
  }

  private 'process:game-start'() {
    this.gameIsStarted = true;
    console.log('game:started');
  }

  private 'process:player-cards'(cards: TableCardType[]): void {
    console.log('player-cards', cards);
    if (!cards?.length && !this.gameIsStarted) {
      return;
    }

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
      placeBtn.className = 'btn btn-sm btn-dark';
      placeBtn.innerText = 'Place';
      const takeBtn = document.createElement('button');
      takeBtn.className = 'btn btn-sm btn-dark';
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
        const serializeTableCards = [];
        for (const sci in this.selectedTableCards) {
          const sciCard = this.selectedTableCards[sci];
          if (sciCard) {
            serializeTableCards.push({
              rank: sciCard.rank,
              suit: sciCard.suit,
            });
          }
        }
        console.log('take card', card);

        this.socketIO.emit('player:move', {
          playerCard: card,
          tableCards: serializeTableCards,
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
    this.clearSelectedTableCardSelection();
    console.log(`data:`, data);
    if (this.processGameDataCallback) {
      this.processGameDataCallback(data);
    }
  }

  private 'process:take-card-from-table'(dto: PlayerScoresCardDto): void {
    const cardWidth = 60;
    const cardHeight = 90;
    const playerCard = new Card(dto.playerCard.name, dto.playerCard.suit);
    const centerPosition = {
      x: this.table.width / 2 - cardWidth / 2,
      y: this.table.height / 2 - cardHeight / 2,
    };
    playerCard.setPosition(centerPosition.x, centerPosition.y);
    playerCard.htmlElement.classList.add('x-card-selected');
    playerCard.zIndex = this.zIndex + 1;
    playerCard.appendDOM(this.selector.table, 'table');
    const [translatedX, translatedY] = Game.calculatedAnimationPoint(
      centerPosition.x,
      centerPosition.y,
      random(-30, 30),
    ).for(dto.position);

    setTimeout(() => {
      playerCard.animate({ translatedX, translatedY }, () => {
        playerCard.remove();
      });
    }, 1500);

    dto.tableCards.forEach((dtoTableCard) => {
      const cardId = Card.generateCardId(dtoTableCard.name, dtoTableCard.suit);
      const tableCard = this.tableCards[cardId];
      if (tableCard) {
        tableCard.htmlElement.classList.add('x-card-selected');
        tableCard.zIndex = this.zIndex + 1;
        setTimeout(() => {
          tableCard.remove();
        }, 1500);
      }
    });
  }

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
    if (!this.tableCards.hasOwnProperty(card.id)) {
      this.calculateTableDims();
      const { left, top } = this.calculateCardPlacePosition(this.playerTurn);
      this.tableCards[card.id] = card;
      const angle = random(-30, 30);
      const calculatedAnimatedPoint = Game.calculatedAnimationPoint(left, top, angle);
      const [$left, $top, $rotate] = calculatedAnimatedPoint.for(this.playerTurn);
      card.setPosition($left, $top);
      card.setRotation($rotate);
      card.appendDOM(this.selector.table);
      card.attachEvent('click', (event) => {
        event.preventDefault();
        if (!this.selectedTableCards.hasOwnProperty(card.id)) {
          this.selectedTableCards[card.id] = card;
        } else {
          delete this.selectedTableCards[card.id];
        }
        card.zIndex = ++this.zIndex;
        card.htmlElement.classList.toggle('x-card-selected');
      });
      const draggable = new Draggable(card.htmlElement, {
        limit: {
          x: [this.table.left, this.table.left + this.table.width - card.width],
          y: [
            this.table.top - this.xActionsHeight,
            this.table.top + this.table.height - card.height - this.xActionsHeight,
          ],
        },
      });
      card.animate({ translatedX: left, translatedY: top, angle });
    }
  }

  private 'process: add single/multiple card(s) on the table'(dto: AddCardType): void {
    if (!Array.isArray(dto.cards)) {
      dto.cards = [dto.cards];
    }
    this.playerTurn = dto.position;
    dto.cards.forEach(({ name, suit }) => {
      const card = new Card(name, suit);
      this['process: add a single card on the table'](card);
    });
  }

  private calculateCardPlacePosition(position?: PlayerPlaceOptions | null) {
    const table = {
      top: this.selector.table.offsetTop + this.xActionsHeight,
      left: this.selector.table.offsetLeft,
      width: this.selector.table.offsetWidth,
      height: this.selector.table.offsetHeight,
    };

    const cardHeight = 90;

    switch (position) {
      case PlayerPlaceOptions.up:
        return {
          left: random(table.width * 0.25, table.width * 0.75),
          top: random(0, table.height * 0.5),
        };
      case PlayerPlaceOptions.right:
        return {
          left: random(table.width * 0.5, table.width - cardHeight),
          top: random(0, table.height - cardHeight),
        };
      case PlayerPlaceOptions.left:
        return {
          left: random(0, table.width * 0.5),
          top: random(0, table.height - cardHeight),
        };
      case PlayerPlaceOptions.down:
      default:
        return {
          left: random(table.width * 0.25, table.width * 0.75),
          top: random(table.height * 0.5, table.height - cardHeight),
        };
    }
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

  private clearSelectedTableCardSelection(): void {
    Object.values(this.selectedTableCards).forEach((card) => {
      card.htmlElement.classList.remove('x-card-selected');
    });
    this.selectedTableCards = {};
  }
}
