export default class CardDom {
  private card: HTMLElement;

  constructor( card: {
    current: HTMLElement,
  } ) {
    this.card = card.current;
  }

  move( { x, y }: {
    x: number;
    y: number;
  } ) {
    this.card.style.left = x + 'px'
    this.card.style.top = y + 'px'
  }
}
