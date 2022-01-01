export function createDebugPoint(parent: Element, x: number, y: number, angle: number = 0) {
  const div = document.createElement('div');
  div.style.position = 'absolute';
  div.style.transform = `rotateZ(${angle}deg)`;
  div.innerText = `(${x.toFixed(0)},${y.toFixed(0)},${angle.toFixed(0)}°)`;
  div.style.color = 'white';
  div.style.fontSize = '8px';
  div.style.left = `${x - 1}px`;
  div.style.top = `${y - 1}px`;
  div.style.width = `${2}px`;
  div.style.height = `${2}px`;
  div.style.border = 'solid 1px green';
  div.style.borderRadius = '50%';
  parent.appendChild(div);
}

type P = { x: number; y: number };
// Calculate the angle between the base and the point by leveraging the pythagoras and the law of cosines
export function calculateAngle(A: P, B: P, C: P): number {
  const a = Math.sqrt((B.x - C.x) ** 2 + (B.y - C.y) ** 2);
  const b = Math.sqrt((A.x - C.x) ** 2 + (A.y - C.y) ** 2);
  const c = Math.sqrt((B.x - A.x) ** 2 + (B.y - A.y) ** 2);
  const cosY = (a ** 2 + b ** 2 - c ** 2) / (2 * b * a);

  return (Math.acos(cosY) * 180) / Math.PI;
}
