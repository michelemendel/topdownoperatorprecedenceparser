import { precedences } from "./constants.mjs";
import {
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
    NUMBER: { parse: parseNumber, precedence: precedences._ },
    NAME: { parse: parseName, precedence: precedences._ },
    STRING: { parse: parseString, precedence: precedences._ },
    IDENTIFIER: { parse: parseIdentifier, precedence: precedences._ },
    ASSIGN: { parse: parseAssignment, precedence: precedences._ },
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
    L_PAREN: { parse: parseCall, precedence: precedences._ },
    SUM: { parse: parseInfixOperator, precedence: precedences.SUM },
    MINUS: { parse: parseInfixOperator, precedence: precedences.SUM },
    PRODUCT: { parse: parseInfixOperator, precedence: precedences.PRODUCT },
    SLASH: { parse: parseInfixOperator, precedence: precedences.PRODUCT },
    CARET: {
      parse: parseInfixOperator,
      precedence: precedences.EXPONENT,
      rightAssoc: true
    }
  }[token.type];
};
