import { precedences, tokenType } from "./constants.mjs";
import { infixParselets } from "./parseletsLookup.mjs";
import {
  consumeWithExpected,
  match,
  matchAndConsume,
  parseCode
} from "./parser.mjs";
import {
  assignmentExpression,
  documentExpression,
  callExpression,
  nameExpression,
  numberExpression,
  operatorExpression,
  prefixExpression,
  propertyExpression,
  stringExpression
} from "./expressions.mjs";
import { consume } from "./parser.mjs";

const _ = {};

// parseDocument :: token -> token[] -> [ast, token[]]
export const parseDocument = (token, tokens) => {
  const [name, remainingTokens] = consume(tokens);
  const [asts, ts] = parseDocumentRec(remainingTokens, []);
  return [documentExpression(token, name, asts), ts];
};

// parseDocumentRec :: token -> ast[] -> [ast[], token[]]
export const parseDocumentRec = (tokens, asts) => {
  if (tokens.length > 0) {
    const [ast, ts] = parseCode(tokens);
    return parseDocumentRec(ts, [...asts, ast]);
  } else {
    return [asts, tokens];
  }
};

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

/**
 * parseCallRec :: boolean -> token[] -> token[] -> [token[], token[]]
 */
export const parseCallRec = (hasArg, tokens, args) => {
  if (!hasArg) {
    // Consume the right parenthesis
    const [t, remTs] = consume(tokens);

    // todo: Error if t != R_PAREN && tokens != [R_PAREN]

    return [args, remTs];
  } else {
    const [ast, ts] = parseCode(tokens);
    // Consume the comma
    const [hasArgs, t, remTs] = matchAndConsume(tokenType.COMMA, ts);
    return parseCallRec(hasArgs, hasArgs ? remTs : ts, [...args, ast]);
  }
};

/**
 * parseAssignment :: ast -> token -> token[] -> [ast, token[]]
 * ex: let a = 1
 */
export const parseAssignment = (token, tokens) => {
  const [identifier, ts] = consume(tokens);
  const [isEqualChar, equalsChar, tsOnRHS] = matchAndConsume(
    tokenType.EQUALS,
    ts
  );

  if (!isEqualChar) {
    throw new SyntaxError(`[line ${equalsChar.lineNr}, column ${equalsChar.columnNr}]
      Expected token ${tokenType.EQUALS} and found ${equalsChar.type}`);
  }

  const [rhs, remTs] = parseCode(tsOnRHS, precedences.EQUALS);

  return [assignmentExpression(identifier, rhs), remTs];
};

/**
 * parseProperty :: ast -> token -> token[] -> [ast, token[]]
 */
export const parseProperty = (key, colonChar, tokens) => {
  if (colonChar === tokenType.COLON) {
    throw new SyntaxError(`[line ${colonChar.lineNr}, column ${colonChar.columnNr}]
      Expected token ${tokenType.COLON} and found ${colonChar.type}`);
  }

  const [rhs, remTs] = parseCode(tokens, precedences.EQUALS);

  return [propertyExpression(key, rhs), remTs];
};

/**
 *
 */
export const parseConditional = token => {
  console.log("---> parseAssignment");
};
