import { precedences, tokenType } from "./constants.mjs";
import { infixParselets } from "./parseletsLookup.mjs";
import { consume, parseCode, consumeWithExpected } from "./parser.mjs";
import {
  numberExpression,
  nameExpression,
  operatorExpression
} from "./expressions.mjs";

//
export const parsePrefixOperator = (token, tokens) => {};

// parseInfixOperator ::  token -> token[] -> ast -> [ast, token[]]
export const parseInfixOperator = (token, tokens, left) => {
  const right = parseCode(
    tokens,
    precedences[token.type] -
      (infixParselets(token) && infixParselets(token).rightAssoc ? 1 : 0)
  );

  /**
   * right[0]: The ast - we don't want the tokens
   * right[1]: The changed tokens
   */
  return [operatorExpression(left, token, right[0]), right[1]];
};

// parseNumber :: token -> token[] -> ast
export const parseNumber = (token, tokens) => {
  //   console.log("---> parseNumber");
  return numberExpression(token);
};

// parseName :: token -> token[] -> ast
export const parseName = (token, tokens) => {
  console.log("---> parseName", token);
  return nameExpression(token);
};

//
export const parseIdentifier = token => {
  console.log("---> parseIdentifier");
};

//
export const parseString = token => {
  console.log("---> parseString");
};

//
export const parseAssignment = token => {
  console.log("---> parseAssignment");
};

//
export const parseConditional = token => {
  console.log("---> parseAssignment");
};

// ex: (1 + 2)
export const parseGroup = (token, tokens) => {
  console.log("---> parseGroup", token);
  const [ast, tokensB] = parseCode(tokens);
  consumeWithExpected(tokenType.R_PAREN, tokensB);
  return ast;
};

// ex: fn(1, 2)
export const parseCall = (token, tokens, left) => {
  console.log("---> parseCall");
  //   const expression = parseCode(token);
  //   consume(tokens, tokenType.R_PAREN);
  //   return expression;
};
