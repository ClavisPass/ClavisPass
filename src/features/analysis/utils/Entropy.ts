const calcEntropy = (charset: any, length: number) =>
  Math.round((length * Math.log(charset)) / Math.LN2);

const stdCharsets = [
  {
    name: "lowercase",
    re: /[a-z]/, // abcdefghijklmnopqrstuvwxyz
    length: 26,
  },
  {
    name: "uppercase",
    re: /[A-Z]/, // ABCDEFGHIJKLMNOPQRSTUVWXYZ
    length: 26,
  },
  {
    name: "numbers",
    re: /[0-9]/, // 1234567890
    length: 10,
  },
  {
    name: "symbols",
    re: /[^a-zA-Z0-9]/, //  !"#$%&'()*+,-./:;<=>?@[\]^_`{|}~ (and any other)
    length: 33,
  },
];

const calcCharsetLengthWith = (charsets: any) => (string: string) =>
  charsets.reduce(
    (length: number, charset: any) =>
      length + (charset.re.test(string) ? charset.length : 0),
    0
  );

const calcCharsetLength = calcCharsetLengthWith(stdCharsets);

const passwordEntropy = (password: string) =>
  password ? calcEntropy(calcCharsetLength(password), password.length) : 0;

export default passwordEntropy;
