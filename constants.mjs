export const precedences = {
  _: 0,
  ASSIGNMENT: 1,
  CONDITIONAL: 2,
  SUM: 3,
  PRODUCT: 4,
  EXPONENT: 5,
  PREFIX: 6,
  POSTFIX: 7,
  CALL: 8
};

export const tokenType = {
  _: "_",
  L_BRACE: "L_BRACE",
  R_BRACE: "R_BRACE",
  L_BRACKET: "L_BRACKET",
  R_BRACKET: "R_BRACKET",
  L_PAREN: "L_PAREN",
  R_PAREN: "R_PAREN"
};

const punctuators = {
  "+": "SUM",
  "-": "MINUS",
  "*": "PRODUCT",
  "/": "SLASH",
  "^": "CARET",
  ".": "PERIOD",
  "\\": "BACKSLASH",
  ":": "COLON",
  "%": "PERCENT",
  "|": "PIPE",
  "!": "BANG",
  "~": "TILDE",
  "?": "QUESTION",
  "#": "HASH",
  "&": "AMPERSAND",
  "@": "AT",
  ";": "SEMI",
  ",": "COMMA",
  "(": tokenType.L_PAREN,
  ")": tokenType.R_PAREN,
  "<": "L_ANGLE",
  ">": "R_ANGLE",
  "{": tokenType.L_BRACE,
  "}": tokenType.R_BRACE,
  "[": tokenType.L_BRACKET,
  "]": tokenType.R_BRACKET,
  "=": "EQUALS",
  "==": "DOUBLE_EQUALS"
};

const keywords = ["let", "function"];

export const getPunctuatorName = op => punctuators[op];

export const getType = name =>
  name[0] === "#"
    ? "IDENTIFIER"
    : name[0] === "@"
    ? "REFERENCE"
    : keywords.includes(name)
    ? "KEYWORD"
    : "NAME";
