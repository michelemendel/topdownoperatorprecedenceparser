import { precedences } from "./constants.mjs";
import {
  parseAssignment,
  parseCall,
  parseComment,
  parseConditional,
  parseDocument,
  parseEntity,
  parseEntityPrefix,
  parseGroup,
  parseProperty,
  parseInfixOperator,
  parseNIR,
  parseNumber,
  parsePrefixOperator,
  parseString
} from "./parselets.mjs";

export const prefixParselets = token => {
  return {
    COMMENT: { parse: parseComment, precedence: precedences._ },
    COMMENT_INLINE: { parse: parseComment, precedence: precedences._ },
    DOCUMENT: { parse: parseDocument, precedence: precedences._ },
    NUMBER: { parse: parseNumber, precedence: precedences._ },
    STRING: { parse: parseString, precedence: precedences._ },
    NAME: { parse: parseNIR, precedence: precedences._ },
    IDENTIFIER: { parse: parseNIR, precedence: precedences._ },
    REFERENCE: { parse: parseNIR, precedence: precedences._ },
    ASSIGNMENT: { parse: parseAssignment, precedence: precedences._ },
    QUESTION: { parse: parseConditional, precedence: precedences._ },
    L_PAREN: { parse: parseGroup, precedence: precedences._ },
    L_BRACE: { parse: parseEntityPrefix, precedence: precedences._ },

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
    L_BRACE: { parse: parseEntity, precedence: precedences.ENTITY },
    EQUALS: { parse: parseInfixOperator, precedence: precedences.ASSIGNMENT },
    COLON: { parse: parseProperty, precedence: precedences.PROPERTY }
  }[token.type];
};
