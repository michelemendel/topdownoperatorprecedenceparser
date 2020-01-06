import { tokenType } from "./constants.mjs";

// commentExpression :: tokenType -> ast -> expression
export const commentExpression = token => {
  return {
    type: token.type,
    value: token.value
    // children: [right]
    // lineNr: token.lineNr,
    // columnNr: token.columnNr,
  };
};

// documentExpression :: tokenType -> ast -> expression
export const entityExpression = (tokenType, name, right) => {
  return {
    type: tokenType,
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

/**
 * referenceExpression :: token[] -> expression
 * Number, Name, Identifier, String
 */
export const referenceExpression = tokens => {
  return {
    type: tokenType.REFERENCE,
    value: [tokens[0].value.slice(1), ...tokens.slice(1).map(t => t.value)]
    // lineNr: token.lineNr,
    // columnNr: token.columnNr
  };
};

/**
 * nnisExpression :: token -> expression
 * Number, Name, Identifier, String
 */
export const nnisExpression = token => {
  return {
    type: token.type,
    value: token.value
    // lineNr: token.lineNr,
    // columnNr: token.columnNr
  };
};

/**
 * siggyExpression :: token[] -> expression
 * Name, Identifier, Reference
 */
export const siggyExpression = siggyTokens => {
  // console.log("\n--------------\nnirExpression\n", siggyTokens);

  return {
    type: tokenType.SIGNATURE,
    value: siggyTokens.map(st => ({
      type: st.type,
      value: st.value
    }))
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

// assignmentExpression :: token -> expression
export const assignmentExpression = (left, equalsExpression) => {
  return {
    type: tokenType.ASSIGNMENT,
    value: left.value,
    children: equalsExpression
    // lineNr: token.lineNr,
    // columnNr: token.columnNr,
  };
};

// propertyExpression :: token -> expression
export const propertyExpression = (left, equalsExpression) => {
  return {
    type: tokenType.PROPERTY,
    value: left.value,
    children: equalsExpression
    // lineNr: token.lineNr,
    // columnNr: token.columnNr,
  };
};
