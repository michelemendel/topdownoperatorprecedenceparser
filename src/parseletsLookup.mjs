import { precedences } from "./constants.mjs";
import {
  parseDocument,
  parseNumber,
  parseName,
  parseString,
  parseIdentifier,
  parseAssignment,
  parseConditional,
  parseGroup,
  parsePrefixOperator,
  parseCall,
  parseInfixOperator
} from "./parselets.mjs";

export const prefixParselets = token => {
  return {
    DOCUMENT: { parse: parseDocument, precedence: precedences._ },
    NUMBER: { parse: parseNumber, precedence: precedences._ },
    NAME: { parse: parseName, precedence: precedences._ },
    STRING: { parse: parseString, precedence: precedences._ },
    IDENTIFIER: { parse: parseIdentifier, precedence: precedences._ },
    QUESTION: { parse: parseConditional, precedence: precedences._ },
    L_PAREN: { parse: parseGroup, precedence: precedences._ },

    SUM: { parse: parsePrefixOperator, precedence: precedences.PREFIX },
    MINUS: {
      parse: parsePrefixOperator,
      precedence: precedences.PREFIX
    },
    TILDE: { parse: parsePrefixOperator, precedence: precedences.PREFIX },
    BANG: { parse: parsePrefixOperator, precedence: precedences.PREFIX }
  }[token.type];
};

export const infixParselets = token => {
  return {
    SUM: { parse: parseInfixOperator, precedence: precedences.SUM },
    MINUS: { parse: parseInfixOperator, precedence: precedences.SUM },
    PRODUCT: { parse: parseInfixOperator, precedence: precedences.PRODUCT },
    DIVIDE: { parse: parseInfixOperator, precedence: precedences.PRODUCT },
    CARET: {
      parse: parseInfixOperator,
      precedence: precedences.EXPONENT,
      rightAssoc: true
    },
    L_PAREN: { parse: parseCall, precedence: precedences.CALL },
    ASSIGN: { parse: parseAssignment, precedence: precedences._ }
  }[token.type];
};
