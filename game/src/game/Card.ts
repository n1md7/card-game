import {Rank, Suit} from './types';
import cover from '../img/card-cover.svg';

export enum ActionType {
  create = 1,
  update
}

export class Card {
  public readonly rank: Rank;
  public readonly suit: Suit;
  public readonly key: string;
  public readonly id: string;
  public htmlElement: HTMLImageElement;
  public parent: HTMLElement|null;
  public height: number = 90;
  public width: number = 60;
  public left: number = 32;
  public top: number = 32;
  public rotate: number = 0;
  private event: {[eventType: string]: (event: any) => void} = {};

  public constructor(rank: Rank, suit: Suit) {
    this.rank = rank;
    this.suit = suit;
    this.key = suit + rank;
    this.id = `${this.rank}_of_${this.suit}`;
    this.htmlElement = new Image();
    this.parent = null;
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

  public appendDOM(parent: Element): Card {
    parent.appendChild(this.action(ActionType.create));

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

  public action(type: ActionType): HTMLImageElement {
    const card = type === ActionType.create ? new Image() : this.htmlElement;
    card.setAttribute('data-id', this.id);
    card.className = `x-card js_${this.id}`;
    card.style.position = 'absolute';
    card.style.left = this.left + 'px';
    card.style.top = this.top + 'px';
    card.style.width = this.width + 'px';
    card.style.height = this.height + 'px';
    card.style.transform = `rotate(${this.rotate}deg)`;
    try {
      card.src = require(`../img/cards/${this.id}.svg`);
    } catch ({message}) {
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

  public set zIndex(index: number){
    this.htmlElement.style.zIndex = String(index);
  }

}