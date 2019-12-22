import { precedences } from "./constants.mjs";
import { prefixParselets, infixParselets } from "./parseletsLookup.mjs";

// export const result = {
//     ast:{},
//     tokens:[],
//     errors:[]
// }

// parseCode :: tokens -> int -> [ast, token[]]
export const parseCode = (tokens, precedence = 0) => {
  return parsePrefix(consume(tokens), precedence);
};

// parsePrefix :: token -> token[] -> int -> [ast, token[]]
export const parsePrefix = ([token, tokens], precedence = 0) => {
  const prefix = prefixParselets(token);

  if (!prefix) {
    return [
      {},
      tokens,
      [SyntaxError(`Could not parse ${token.value} of type ${token.type}.`)]
    ];
  }

  let left = prefix.parse(token, tokens);

  //   while (precedence < getPrecedence(tokens)) {
  //     [left, tokens] = parseInfix(consume(tokens), left);
  //   }
  //   return [left, tokens];

  return parseInfix(left, tokens, precedence);
};

// parseInfix :: ast -> token[] -> int -> [ast, token[]]
const parseInfix = (left, tokens, precedence) => {
  let token;
  if (precedence < getPrecedence(tokens)) {
    [token, tokens] = consume(tokens);
    [left, tokens] = infixParselets(token).parse(token, tokens, left);
    return parseInfix(left, tokens, precedence);
  } else {
    return [left, tokens];
  }
};

// parseInfix :: token[] -> int -> ast -> [ast, token[]]
// const parseInfixX = (left, tokens, precedence) => {
//   let token;
//   while (precedence < getPrecedence(tokens)) {
//     [token, tokens] = consume(tokens);
//     [left, tokens] = infixParselets(token).parse(token, tokens, left);
//   }
//   return [left, tokens];
// };

// parseInfix :: token -> token[] -> [ast, token[]]
// const parseInfix1 = ([token, tokens], left) => {
//   return infixParselets(token).parse(token, tokens, left);
// };

// consume :: token[] -> [token, token[]]
export const consume = tokens => {
  return [tokens[0], tokens.slice(1)];
};

// consumeWithExpected :: token -> token[] -> [token, token[]]
export const consumeWithExpected = (expectedTokenType, tokens) => {
  const token = lookAhead(tokens);

  console.log("---> consumeWithExpected: token", token);
  //   console.log("---> consumeWithExpected: tokens\n", tokens);

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
  const parser = infixParselets(lookAhead(tokens));
  const prec = !parser ? precedences._ : parser.precedence;
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
