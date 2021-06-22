function int2Binary(num: string) {
  let str = parseInt(num).toString(2);

  while (str.length !== 16) {
    str = '0' + str;
  }

  return str;
}

export { int2Binary };
