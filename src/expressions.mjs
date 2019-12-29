import { tokenType } from "./constants.mjs";

// documentExpression :: token -> ast -> expression
export const documentExpression = (token, name, right) => {
  return {
    type: token.type,
    value: name,
    children: right
    // lineNr: token.lineNr,
    // columnNr: token.columnNr,
  };
};

// prefixExpression :: token -> ast -> expression
export const prefixExpression = (token, right) => {
  return {
    type: token.type,
    value: token.value,
    children: [right]
    // lineNr: token.lineNr,
    // columnNr: token.columnNr,
  };
};

// numberExpression :: token -> expression
export const numberExpression = token => {
  return {
    type: token.type,
    value: token.value
    // lineNr: token.lineNr,
    // columnNr: token.columnNr
  };
};

// nameExpression :: token -> expression
export const nameExpression = token => {
  return {
    type: token.type,
    value: token.value
    // lineNr: token.lineNr,
    // columnNr: token.columnNr
  };
};

// stringExpression :: token -> expression
export const stringExpression = token => {
  return {
    type: token.type,
    value: token.value
    // lineNr: token.lineNr,
    // columnNr: token.columnNr
  };
};

// operatorExpression :: expression -> token -> expression -> expression
export const operatorExpression = (left, token, right) => {
  //   console.log("\n======\nLEFT\n", left, "\nRIGHT\n", right, "\n======\n");

  return {
    type: token.type,
    value: token.value,
    children: [left, right]
    // lineNr: token.lineNr,
    // columnNr: token.columnNr,
  };
};

// callExpression :: token -> expression
export const callExpression = (left, args) => {
  return {
    type: tokenType.CALL,
    value: left.value,
    children: args
    // lineNr: token.lineNr,
    // columnNr: token.columnNr,
  };
};
