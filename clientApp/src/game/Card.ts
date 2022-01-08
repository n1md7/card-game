import cover from '../img/card-cover.svg';
import { Rank, Suit } from './types';

export enum ActionType {
  create = 1,
  update,
}

type CreateFor = 'table' | 'actions';
type GeneratedCardID = string;

export class Card {
  public readonly rank: Rank;
  public readonly suit: Suit;
  public readonly key: string;
  public readonly id: string;
  public htmlElement: HTMLImageElement;
  public parent: HTMLElement | null;
  public height: number = 86;
  public width: number = 60;
  public left: number = 32;
  public top: number = 32;
  public rotate: number = 0;
  private event: { [eventType: string]: (event: any) => void } = {};

  public constructor(rank: Rank, suit: Suit) {
    this.rank = rank;
    this.suit = suit;
    this.key = suit + rank;
    this.id = Card.generateCardId(rank, suit);
    this.htmlElement = new Image();
    this.parent = null;
  }

  public static generateCardId(rank: Rank, suit: Suit): GeneratedCardID {
    return `${rank}_of_${suit}`;
  }

  public toValue(): number {
    const map = {
      ['ace' as keyof typeof Rank]: 1,
      ['jack' as keyof typeof Rank]: 11,
      ['queen' as keyof typeof Rank]: 12,
      ['king' as keyof typeof Rank]: 13,
    };
    const [rank] = this.id.split('_of_');
    return map[rank as keyof typeof Rank] ? map[rank as keyof typeof Rank] : +rank;
  }

  public setDimensions(width: number, height: number): void {
    this.width = width;
    this.height = height;
  }

  public setPosition(left: number, top: number): void {
    this.left = left;
    this.top = top;
  }

  public setRotation(rotate: number): void {
    this.rotate = rotate;
  }

  public appendDOM(parent: Element, $for: CreateFor = 'table'): Card {
    parent.appendChild(this.action(ActionType.create, $for));

    return this;
  }

  public remove(): void {
    this.htmlElement?.parentNode?.removeChild(this.htmlElement);
  }

  public alreadyInDOM(): boolean {
    if (this.parent) {
      if (this.parent.querySelector(`.${this.id}`)) {
        return true;
      }
    }
    return false;
  }

  public action(type: ActionType, $for: CreateFor = 'table'): HTMLImageElement {
    const card = type === ActionType.create ? new Image() : this.htmlElement;
    card.setAttribute('data-id', this.id);
    card.setAttribute('data-key', this.key);
    card.setAttribute('data-rank', this.rank);
    card.setAttribute('data-suit', this.suit);
    card.className = `x-card js_${this.id}`;
    if ($for === 'table') {
      card.style.position = 'absolute';
      card.style.left = this.left + 'px';
      card.style.top = this.top + 'px';
      card.style.width = this.width + 'px';
      card.style.height = this.height + 'px';
      card.style.transform = `rotateZ(${this.rotate}deg)`;
    }
    try {
      card.src = require(`../img/cards/${this.id}.svg`);
    } catch ({ message }) {
      card.src = cover;
    } finally {
      this.htmlElement = card;
    }

    return card;
  }

  public attachEvent(event: string, callback: (event: any) => void): void {
    this.event[event] = callback;
    this.htmlElement.addEventListener(event, callback, false);
  }

  public removeEvent(event: string): void {
    if (this.event.hasOwnProperty(event)) {
      this.htmlElement.removeEventListener(event, this.event[event]);
    }
  }

  public set zIndex(index: number) {
    this.htmlElement.style.zIndex = String(index);
  }

  public setZIndex(index: number): void {
    this.htmlElement.style.zIndex = String(index);
  }

  public setTransition(property: string, duration: string): void {
    this.htmlElement.style.transition = `${property} ${duration}`;
  }

  public removeTransition(): void {
    this.htmlElement.style.removeProperty('transition');
  }

  public animate(
    props: { translatedX: number; translatedY: number; angle?: number },
    cb?: () => void,
    duration: number = 100,
  ): void {
    setTimeout(() => {
      this.setPosition(props.translatedX, props.translatedY);
      this.setRotation(props.angle || 0);
      this.action(ActionType.update);
      cb && cb();
    }, duration);
  }
}
