import {
  AddCardType,
  Defaults,
  EllipseType,
  GameData,
  GameSelectorType,
  PlayerPlaceOptions,
  PlayerScoresCardDto,
  Rank,
  SocketType,
  Suit,
  TableCardType,
} from './types';
import BaseGame from './BaseGame';
import { Card } from './Card';
import { CardCombination, clone, random } from '../libs/Formulas';
import { GameEvents } from 'shared-types';
// @ts-ignore
import Draggable from 'draggable';

export default class Game extends BaseGame {
  private readonly defaults: Defaults;
  private tableCards: Card[] = [];
  private selectedTableCards: Card[] = [];
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
  private tableCardIsDragging = false;
  private selectedPlayerCard: Card | null = null;
  private cardCombination: number[] | number[][] = [];

  constructor(selector: GameSelectorType, socketIO: SocketType, outerEllipse: EllipseType, defaults: Defaults) {
    super(selector, socketIO);
    this.defaults = defaults;
  }

  private static calculatedAnimationPoint(left: number, top: number, rotate = 0) {
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
  }

  private 'process:player-cards'(playerCards: TableCardType[]): void {
    if (!playerCards?.length && !this.gameIsStarted) return;
    this.clearSelectedPlayerCardSelection();

    this.selector.actions.innerHTML = '';

    const fragment = new DocumentFragment();
    const createCardFragment = (card: TableCardType) => {
      const size = window.innerWidth > 4 * 90 ? 90 : window.innerWidth / 4;
      const cardContainer = document.createElement('div');
      cardContainer.style.width = `${size}px`;
      const cardObject = new Card(card.rank, card.suit);
      cardObject.htmlElement.removeAttribute('style');
      cardObject.appendDOM(cardContainer, 'actions');

      return {
        cardObject,
        cardContainer,
      };
    };

    playerCards.forEach((playerCard) => {
      const { cardContainer, cardObject } = createCardFragment(playerCard);
      cardContainer.onclick = (event) => {
        event.preventDefault();
        this.clearSelectedPlayerCardSelection();
        this.selectedPlayerCard = cardObject;
        cardObject.htmlElement.classList.add('x-card-selected');

        this.cardCombination = new CardCombination(this.selectedPlayerCard, this.tableCards).calculate();

        if (this.cardCombination.length === 0) {
          // Just place a card on the table since there is on combination
          this.socketIO.emit('player:move', {
            playerCard: {
              rank: this.selectedPlayerCard.rank,
              suit: this.selectedPlayerCard.suit,
            },
            tableCards: [],
          });
        } else if (this.cardCombination.length === 1) {
          // When only one option just do it immediately
          const combination = this.cardCombination[0] as number[];
          if (combination.length) {
            const serializeTableCards: { rank: Rank; suit: Suit }[] = [];
            combination.forEach((cardIndex$) => {
              const cardFromTable = this.tableCards[cardIndex$];
              serializeTableCards.push({
                rank: cardFromTable.rank,
                suit: cardFromTable.suit,
              });
            });
            this.socketIO.emit('player:move', {
              playerCard: {
                rank: this.selectedPlayerCard.rank,
                suit: this.selectedPlayerCard.suit,
              },
              tableCards: serializeTableCards,
            });
          }
        } else {
          if (this.selectedTableCards.length) {
            console.log('Table cards are selected');
            this.cardCombination = new CardCombination(this.selectedPlayerCard, this.selectedTableCards).calculate();
            if (this.cardCombination.length === 1) {
              console.log(this.selectedPlayerCard, this.selectedTableCards, this.cardCombination);
              // When only one option it means that player selected correct card combination
              const serializeTableCards: { rank: Rank; suit: Suit }[] = [];
              (this.cardCombination[0] as number[]).forEach((cardIndex$) => {
                const cardFromTable = this.selectedTableCards[cardIndex$];
                serializeTableCards.push({
                  rank: cardFromTable.rank,
                  suit: cardFromTable.suit,
                });
              });
              console.log('sending serialized', {
                serializeTableCards,
                playerCard: clone({
                  rank: this.selectedPlayerCard.rank,
                  suit: this.selectedPlayerCard.suit,
                }),
              });
              this.socketIO.emit('player:move', {
                playerCard: {
                  rank: this.selectedPlayerCard.rank,
                  suit: this.selectedPlayerCard.suit,
                },
                tableCards: serializeTableCards,
              });
            }
          }
        }
      };
      fragment.appendChild(cardContainer);
    });

    this.selector.actions.appendChild(fragment);
  }

  private 'process:player-turn'(position: PlayerPlaceOptions): void {
    this.clearSelectedPlayerCardSelection();
    this.playerTurn = position;
  }

  private 'process: individual players in the game room'(data: GameData): void {
    this.clearSelectedTableCardSelection();
    if (this.processGameDataCallback) {
      this.processGameDataCallback(data);
    }
  }

  private 'process:take-card-from-table'(dto: PlayerScoresCardDto): void {
    const cardWidth = 60;
    const cardHeight = 90;
    console.log('take-card-from-table', dto);
    const centerPosition = {
      x: this.table.width / 2 - cardWidth / 2,
      y: this.table.height / 2 - cardHeight / 2,
    };
    const [translatedX, translatedY] = Game.calculatedAnimationPoint(
      centerPosition.x,
      centerPosition.y,
      random(-30, 30),
    ).for(dto.position);

    if (dto.playerCard) {
      const playerCard = new Card(dto.playerCard.name, dto.playerCard.suit);
      playerCard.setPosition(centerPosition.x, centerPosition.y);
      playerCard.htmlElement.classList.add('x-card-selected');
      playerCard.setZIndex(this.incrementZIndex());
      playerCard.appendDOM(this.selector.table, 'table');
      playerCard.animate(
        {
          translatedX,
          translatedY,
        },
        () => setTimeout(() => playerCard.remove(), 500),
        2500,
      );
    }

    dto.tableCards.forEach((dtoTableCard) => {
      const card = new Card(dtoTableCard.name, dtoTableCard.suit);
      const tableCardIndex = this.tableCards.findIndex(($tableCard) => $tableCard.id === card.id);
      if (tableCardIndex !== -1) {
        // card is on the table
        const tableCard = this.tableCards[tableCardIndex];
        this.tableCards.splice(tableCardIndex, 1);
        tableCard.htmlElement.classList.add('x-card-selected');
        tableCard.setZIndex(this.incrementZIndex());
        tableCard.animate(
          {
            translatedX,
            translatedY,
          },
          () => setTimeout(() => tableCard.remove(), 500),
          2500,
        );
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
    this.clearSelectedPlayerCardSelection();
    this.tableCardIsDragging = false;
    const cardIsOnTable = this.tableCards.find((tableCard) => tableCard.id === card.id);
    if (cardIsOnTable) return;

    // Card is not on the table so add it
    this.calculateTableDims();
    const { left, top } = this.calculateCardPlacePosition(this.playerTurn);
    this.tableCards.push(card);
    const angle = random(-30, 30);
    const calculatedAnimatedPoint = Game.calculatedAnimationPoint(left, top, angle);
    const [$left, $top, $rotate] = calculatedAnimatedPoint.for(this.playerTurn);
    card.setPosition($left, $top);
    card.setRotation($rotate);
    card.appendDOM(this.selector.table);
    card.attachEvent('mousedown', (event) => {
      event.preventDefault();
      card.setZIndex(this.incrementZIndex());
    });
    // Card player action click event
    card.attachEvent('mouseup', (event) => {
      event.preventDefault();
      if (this.tableCardIsDragging) {
        this.tableCardIsDragging = false;
        return;
      }
      const cardIndex = this.selectedTableCards.findIndex((selectedCard) => selectedCard.id === card.id);
      // toggle selection
      if (cardIndex === -1) {
        // card is not selected so select it
        this.selectedTableCards.push(card);
        if (this.selectedPlayerCard) {
          // when player card is selected check if there is a combination to score
          const cardCombinations = new CardCombination(this.selectedPlayerCard, this.selectedTableCards).calculate();
          if (cardCombinations.length === 1) {
            // When only one option it means that player selected correct card combination
            const serializeTableCards: { rank: Rank; suit: Suit }[] = [];
            (cardCombinations[0] as number[]).forEach((cardIndex$) => {
              const cardFromTable = this.selectedTableCards[cardIndex$];
              serializeTableCards.push({
                rank: cardFromTable.rank,
                suit: cardFromTable.suit,
              });
            });
            this.socketIO.emit('player:move', {
              playerCard: {
                rank: this.selectedPlayerCard.rank,
                suit: this.selectedPlayerCard.suit,
              },
              tableCards: serializeTableCards,
            });
          }
        }
      } else {
        // card is selected so deselect it
        this.selectedTableCards.splice(cardIndex, 1);
      }
      card.setZIndex(this.incrementZIndex());
      card.htmlElement.classList.toggle('x-card-selected');
    });

    new Draggable(card.htmlElement, {
      limit: {
        x: [this.table.left, this.table.left + this.table.width - card.width],
        y: [
          this.table.top - this.xActionsHeight,
          this.table.top + this.table.height - card.height - this.xActionsHeight,
        ],
      },
      onDragStart: () => {
        card.setZIndex(this.incrementZIndex());
        this.tableCardIsDragging = true;
        card.htmlElement.classList.add('x-card-dragging');
      },
      onDragEnd: () => {
        card.htmlElement.classList.remove('x-card-dragging');
      },
    });
    card.animate({ translatedX: left, translatedY: top, angle });
  }

  private 'process: add single/multiple card(s) on the table'(dto: AddCardType): void {
    if (!Array.isArray(dto.cards)) {
      dto.cards = [dto.cards];
    }
    this.playerTurn = dto.position;
    dto.cards.forEach((card) => {
      console.assert(card.name && card.suit, 'Card name and suit are required');
      this['process: add a single card on the table'](new Card(card.name, card.suit));
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
    this.selectedTableCards.forEach((card) => {
      card.htmlElement.classList.remove('x-card-selected');
    });
    this.selectedTableCards = [];
  }

  private clearSelectedPlayerCardSelection(): void {
    this.selector.actions.querySelectorAll('div>img.x-card').forEach((cardContainer) => {
      cardContainer.classList.remove('x-card-selected');
    });
    this.selectedPlayerCard = null;
  }

  private incrementZIndex(): number {
    return ++this.zIndex;
  }
}
