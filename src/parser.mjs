import { precedences } from "./constants.mjs";
import { prefixParselets, infixParselets } from "./parseletsLookup.mjs";

// export const result = {
//     ast:{},
//     tokens:[],
//     errors:[]
// }

// parseCode :: tokens -> int -> [ast, token[]]
export const parseCode = (tokens, precedence = 0) => {
  return parsePrefix([...consume(tokens), precedence]);
};

// parsePrefix :: token -> token[] -> int -> [ast, token[]]
export const parsePrefix = ([token, tokens, precedence]) => {
  const prefix = prefixParselets(token);

  if (!prefix) {
    return [
      {},
      tokens,
      SyntaxError(`Could not parse ${token.value} of type ${token.type}.`)
    ];
  }

  return parseInfix([...prefix.parse(token, tokens), precedence]);
};

// parseInfix :: ast -> token[] -> int -> [ast, token[]]
const parseInfix = ([ast, tokens, precedence]) => {
  if (precedence < getPrecedence(tokens)) {
    const parse = ([token, tokens]) =>
      infixParselets(token).parse(ast, token, tokens);

    return parseInfix([...parse(consume(tokens)), precedence]);
  } else {
    return [ast, tokens];
  }
};

// consume :: token[] -> [token, token[]]
export const consume = tokens => {
  return [tokens[0], tokens.slice(1)];
};

// consumeWithExpected :: token -> token[] -> [token, token[]]
export const consumeWithExpected = (expectedTokenType, tokens) => {
  const token = lookAhead(tokens);

  if (token.type !== expectedTokenType) {
    throw new SyntaxError(`[line ${token.lineNr}, column ${token.columnNr}]
        Expected token ${expectedTokenType} and found ${token.type}`);
  }

  return consume(tokens);
};

// lookAhead :: token[] -> int -> token
const lookAhead = (tokens, distance = 0) => {
  return tokens[0] ? tokens[0] : [];
};

// getPrecedence :: tokens[] -> int
const getPrecedence = tokens => {
  const infix = infixParselets(lookAhead(tokens));
  const prec = !infix ? precedences._ : infix.precedence;
  return prec;
};

// match :: token -> token[] -> boolean
const match = (expectedTokenType, tokens) => {
  const token = lookAhead(tokens);

  if (token.type != expectedTokenType) {
    return false;
  }

  consume(tokens);
  return true;
};
