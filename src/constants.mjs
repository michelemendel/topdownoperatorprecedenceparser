export const precedences = {
  _: 0,
  CALL: 1,
  CONDITIONAL: 1,
  ASSIGNMENT: 1,
  ENTITY: 2,
  PROPERTY: 3,
  SUM: 4,
  MINUS: 4,
  PRODUCT: 5,
  DIVIDE: 5,
  EXPONENT: 6,
  PREFIX: 7,
  POSTFIX: 8
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
  STRING: "STRING"
};

export const punctuators = {
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
