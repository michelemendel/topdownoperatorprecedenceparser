export const prefixExpression = (token, right) => {
  //console.log("\n======T\n", token, "\n======\n");
  //console.log("\n======R\n", right, "\n======\n");

  return {
    type: token.type,
    value: token.value,
    // lineNr: token.lineNr,
    // columnNr: token.columnNr,
    children: [right]
  };
};

export const numberExpression = token => {
  return {
    type: token.type,
    value: token.value
    // lineNr: token.lineNr,
    // columnNr: token.columnNr
  };
};

export const nameExpression = token => {
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
    // lineNr: token.lineNr,
    // columnNr: token.columnNr,
    children: [left, right]
  };
};
