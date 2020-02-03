export const precedences = {
  _: 0,
  CONDITIONAL: 1,
  ASSIGNMENT: 1,
  ENTITY: 2,
  PROPERTY: 3,
  CALL: 4,
  SUM: 5,
  MINUS: 5,
  PRODUCT: 6,
  DIVIDE: 6,
  EXPONENT: 7,
  PREFIX: 8,
  POSTFIX: 9,
};

export const tokenType = {
  _: "_",
  ASSIGNMENT: "ASSIGNMENT",
  CALL: "CALL",
  COMMA: "COMMA",
  COLON: "COLON",
  DOCUMENT: "DOCUMENT",
  ENTITY: "ENTITY",
  EQUALS: "EQUALS",
  IDENTIFIER: "IDENTIFIER",
  L_BRACE: "L_BRACE",
  L_BRACKET: "L_BRACKET",
  L_PAREN: "L_PAREN",
  NAME: "NAME",
  PERIOD: "PERIOD",
  PROPERTY: "PROPERTY",
  R_BRACE: "R_BRACE",
  R_BRACKET: "R_BRACKET",
  R_PAREN: "R_PAREN",
  REFERENCE: "REFERENCE",
  SIGNATURE: "SIGNATURE",
  STRING: "STRING",
};

export const punctuations = {
  "+": "SUM",
  "-": "MINUS",
  "*": "PRODUCT",
  "/": "DIVIDE",
  "^": "CARET",
  ".": tokenType.PERIOD,
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
  "==": "DOUBLE_EQUALS",
};

export const getPunctuationName = op => punctuations[op];

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
