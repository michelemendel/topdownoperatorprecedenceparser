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

// parseInfixOperator :: expression -> token -> token[]-> [expression, expression]
export const parseInfixOperator = (left, token, tokens) => {
  const right = parseCode(
    tokens,
    precedences[token.type] -
      (infixParselets(token) && infixParselets(token).rightAssoc ? 1 : 0)
  );

  //right[0], since we only want the token, not the tokens
  return [operatorExpression(left, token, right[0]), right[1]];
};

//
export const parseNumber = token => {
  //   console.log("---> parseNumber");
  return numberExpression(token);
};

//
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
  const [expression, tokensB] = parseCode(tokens);
  consumeWithExpected(tokenType.R_PAREN, tokensB);
  return expression;
};

// ex: fn(1, 2)
export const parseCall = (token, tokens) => {
  console.log("---> parseCall");
  //   const expression = parseCode(token);
  //   consume(tokens, tokenType.R_PAREN);
  //   return expression;
};
