import { precedences, tokenType } from "./constants.mjs";
import { infixParselets } from "./parseletsLookup.mjs";
import {
  consumeWithExpected,
  match,
  matchAndConsume,
  parseCode
} from "./parser.mjs";
import {
  callExpression,
  nameExpression,
  numberExpression,
  operatorExpression,
  prefixExpression,
  stringExpression
} from "./expressions.mjs";
import { consume } from "./parser.mjs";

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
  return [nameExpression(token), tokens];
};

// parseString :: token -> token[] -> ast
export const parseString = (token, tokens) => {
  return [stringExpression(token), tokens];
};

/**
 * parseInfixOperator :: ast -> token -> token[] -> [ast, token[]]
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

/**
 * parseCall :: ast -> token -> token[] -> [ast, token[]]
 * ex: fn(1, 2)
 */
export const parseCall = (left, token, tokens) => {
  const [args, remTs] = parseCallRec(
    !match(tokenType.R_PAREN, tokens),
    tokens,
    []
  );

  return [callExpression(left, args), remTs];
};

// parseCallRec ::
export const parseCallRec = (hasArg, tokens, args) => {
  if (!hasArg) {
    // Consume the right parenthesis
    const [t, remTs] = consume(tokens);
    return [args, remTs];
  } else {
    const [ast, ts] = parseCode(tokens);
    // Consume the comma
    const [hasArgs, t, remTs] = matchAndConsume(tokenType.COMMA, ts);
    return parseCallRec(hasArgs, remTs, [...args, ast]);
  }
};

//
export const parseIdentifier = token => {
  console.log("---> parseIdentifier");
};

//
export const parseAssignment = token => {
  console.log("---> parseAssignment");
};

//
export const parseConditional = token => {
  console.log("---> parseAssignment");
};
