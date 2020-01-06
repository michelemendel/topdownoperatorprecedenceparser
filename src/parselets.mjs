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
  commentExpression,
  entityExpression,
  callExpression,
  nnisExpression,
  operatorExpression,
  prefixExpression,
  propertyExpression,
  referenceExpression,
  siggyExpression
} from "./expressions.mjs";
import { consume } from "./parser.mjs";

const _ = {};

// parseComment :: token -> token[] -> [ast, token[]]
export const parseComment = (token, tokens) => {
  console.log("\n-------\nCOMMENT", token, tokens);
  // const [ast, remainingTokens] = parseCode(tokens);
  return [commentExpression(token), tokens];
};

// parseDocument :: token -> token[] -> [ast, token[]]
export const parseDocument = (token, tokens) => {
  const [name, remainingTokens] = consume(tokens);
  const [asts, ts] = parseDocumentRec(remainingTokens, []);
  return [entityExpression(tokenType.DOCUMENT, name, asts), ts];
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

/**
 * parseEntity :: token -> token -> token[] -> [ast, token[]]
 * ex1: myEnt {1 + 2}
 */
export const parseEntity = (signature, token, tokens) => {
  const [asts, ts] = parseEntityRec(tokens, []);
  return [entityExpression(tokenType.ENTITY, signature, asts), ts];
};

/**
 * parseEntityPrefix :: token -> token[] -> [ast, token[]]
 * ex1: let m = {1 + 2}
 * ex2: {1 + 2}
 */
export const parseEntityPrefix = (token, tokens) => {
  const [asts, ts] = parseEntityRec(tokens, []);
  return [entityExpression(tokenType.ENTITY, "", asts), ts];
};

// parseEntityRec :: token -> ast[] -> [ast[], token[]]
export const parseEntityRec = (tokens, asts) => {
  if (match(tokenType.R_BRACE, tokens)) {
    const [_, ts] = consumeWithExpected(tokenType.R_BRACE, tokens);
    return [asts, ts];
  } else {
    const [ast, ts] = parseCode(tokens, precedences.ENTITY);
    return parseEntityRec(ts, [...asts, ast]);
  }
};

// parsePrefixOperator :: token -> token[] -> [ast, token[]]
export const parsePrefixOperator = (token, tokens) => {
  const [ast, remainingTokens] = parseCode(tokens, precedences[token.type]);
  return [prefixExpression(token, ast), remainingTokens];
};

// parseNumber :: token -> token[] -> [ast, token[]]
export const parseNumber = (token, tokens) => {
  return [nnisExpression(token), tokens];
};

// parseString :: token -> token[] -> [ast, token[]]
export const parseString = (token, tokens) => {
  return [nnisExpression(token), tokens];
};

/**
 * parseNIR :: token -> token[] -> [ast, token[]]
 * Name, Identifier, Reference
 */
export const parseNIR = (token, tokens) => {
  const [isSiggy, maybeSiggyTokens, remainingTokens] = areSiggyTokens([
    token,
    ...tokens
  ]);

  // A reference that is not part of an entity signature
  if (!isSiggy && token.type === tokenType.REFERENCE) {
    const [referenceTokens, remainingTokens] = expandReference([
      token,
      ...tokens
    ]);

    return [referenceExpression(referenceTokens), remainingTokens];
  }

  return isSiggy
    ? [siggyExpression(maybeSiggyTokens), remainingTokens]
    : [nnisExpression(maybeSiggyTokens[0]), remainingTokens];
};

/**
 * expandReference :: tokens -> [token[], token[]]
 */
const expandReference = tokens => {
  let idx = 0;
  let referenceTokens = [tokens[idx]];

  while (tokens[idx + 1].type === tokenType.PERIOD) {
    idx += 2;
    referenceTokens = referenceTokens.concat(tokens[idx]);
  }

  return [referenceTokens, tokens.slice(idx + 1)];
};

/**
 * isSiggy :: token[] -> [boolean, token[], token[]]
 * Checks if the next set of tokens makes an entity signature
 */
const areSiggyTokens = tokens => {
  let idx = 0;

  while (isNir(tokens[idx])) {
    idx++;
  }

  return tokens[idx] && tokens[idx].type === tokenType.L_BRACE
    ? [true, tokens.slice(0, idx), tokens.slice(idx)]
    : [false, [tokens[0]], tokens.slice(1)];
};

// isNir :: token -> boolean
const isNir = token =>
  !token
    ? false
    : [tokenType.NAME, tokenType.IDENTIFIER, tokenType.REFERENCE].includes(
        token.type
      );

/**
 * parseInfixOperator :: token -> token -> token[] -> [ast, token[]]
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
 * parseCall :: token -> token -> token[] -> [ast, token[]]
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
 * parseAssignment :: token -> token[] -> [ast, token[]]
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

  const [rhs, remTs] = parseCode(tsOnRHS, precedences.ASSIGNMENT);

  return [assignmentExpression(identifier, rhs), remTs];
};

/**
 * parseProperty :: token -> token -> token[] -> [ast, token[]]
 * myKey : myValue
 */
export const parseProperty = (key, colonChar, tokens) => {
  if (colonChar === tokenType.COLON) {
    throw new SyntaxError(`[line ${colonChar.lineNr}, column ${colonChar.columnNr}]
      Expected token ${tokenType.COLON} and found ${colonChar.type}`);
  }

  const [rhs, remTs] = parseCode(tokens, precedences.PROPERTY);

  return [propertyExpression(key, rhs), remTs];
};

/**
 *
 */
export const parseConditional = token => {
  console.log("\n---> parseAssignment");
};
