module.exports.codeGen = () => {
  let rand = "";

  const alphabet = [..."ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"];
  [...Array(length)].forEach(() => rand += alphabet[~~(Math.random() * alphabet.length)]);

  return rand;
}