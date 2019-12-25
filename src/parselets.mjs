import { precedences, tokenType } from "./constants.mjs";
import { infixParselets } from "./parseletsLookup.mjs";
import { consume, parseCode, consumeWithExpected } from "./parser.mjs";
import {
  numberExpression,
  nameExpression,
  operatorExpression,
  prefixExpression
} from "./expressions.mjs";

const _ = {};

// parsePrefixOperator :: token -> token[] -> [ast, token[]]
export const parsePrefixOperator = (token, tokens) => {
  const [ast, remainingTokens] = parseCode(tokens, precedences[token.type]);
  return [prefixExpression(token, ast), remainingTokens];
};

// parseNumber :: token -> token[] -> [ast, token[]]
export const parseNumber = (token, tokens) => {
  return [numberExpression(token), tokens];
};

// parseName :: token -> token[] -> ast
export const parseName = (token, tokens) => {
  //   console.log("---> parseName", token);
  return nameExpression(token);
};

/**
 * parseInfixOperator ::  token -> token[] -> ast -> [ast, token[]]
 */
export const parseInfixOperator = (left, token, tokens) => {
  const [ast, remainingTokens] = parseCode(
    tokens,
    precedences[token.type] -
      (infixParselets(token) && infixParselets(token).rightAssoc ? 1 : 0)
  );

  return [operatorExpression(left, token, ast), remainingTokens];
};

/**
 * parseGroup :: token -> token[] -> [ast, token[]]
 * ex: (1 + 2)
 */
export const parseGroup = (token, tokens) => {
  const [ast, ts] = parseCode(tokens);
  const [_, remainingTokens] = consumeWithExpected(tokenType.R_PAREN, ts);

  return [ast, remainingTokens];
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

// ex: fn(1, 2)
export const parseCall = (token, tokens, left) => {
  console.log("---> parseCall");
  //   const expression = parseCode(token);
  //   consume(tokens, tokenType.R_PAREN);
  //   return expression;
};
