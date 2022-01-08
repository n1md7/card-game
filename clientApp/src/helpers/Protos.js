export const list = function (n) {
  const l = Array(+n);
  for (let i = 0; i < +n; i++) {
    l[i] = i;
  }
  return l;
};
