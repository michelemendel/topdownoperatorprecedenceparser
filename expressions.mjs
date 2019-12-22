export const numberExpression = token => {
  return {
    type: token.type,
    value: token.value
  };
};

export const nameExpression = token => {
  return {
    type: token.type,
    value: token.value
  };
};

// operatorExpression :: expression -> token -> expression -> expression
export const operatorExpression = (left, token, right) => {
  return {
    type: token.type,
    value: token.value,
    children: [left, right]
  };
};
