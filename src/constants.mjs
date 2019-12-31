export const precedences = {
  _: 0,
  CALL: 1,
  CONDITIONAL: 2,
  EQUALS: 2,
  COLON: 2,
  SUM: 3,
  MINUS: 3,
  PRODUCT: 4,
  DIVIDE: 4,
  EXPONENT: 5,
  PREFIX: 6,
  POSTFIX: 7
};

export const tokenType = {
  _: "_",
  ASSIGNMENT: "ASSIGNMENT",
  CALL: "CALL",
  COMMA: "COMMA",
  COLON: "COLON",
  DOCUMENT: "DOCUMENT",
  EQUALS: "EQUALS",
  L_BRACE: "L_BRACE",
  L_BRACKET: "L_BRACKET",
  L_PAREN: "L_PAREN",
  PROPERTY: "PROPERTY",
  R_BRACE: "R_BRACE",
  R_BRACKET: "R_BRACKET",
  R_PAREN: "R_PAREN"
};

export const punctuators = {
  "+": "SUM",
  "-": "MINUS",
  "*": "PRODUCT",
  "/": "DIVIDE",
  "^": "CARET",
  ".": "PERIOD",
  "\\": "BACKSLASH",
  ":": tokenType.COLON,
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
  "=": tokenType.EQUALS,
  "==": "DOUBLE_EQUALS"
};

export const getPunctuatorName = op => punctuators[op];

export const getType = name =>
  name === "document"
    ? "DOCUMENT"
    : name === "let"
    ? "ASSIGNMENT"
    : name[0] === "#"
    ? "IDENTIFIER"
    : name[0] === "@"
    ? "REFERENCE"
    : "NAME";
