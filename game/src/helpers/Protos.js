export const list = function (n) {
  const list = Array(+n);
  for(let i = 0; i < +n; i ++){
    list[i] = i;
  }
  return list;
};