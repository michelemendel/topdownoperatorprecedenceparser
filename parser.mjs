import { precedences } from "./constants.mjs";
import { prefixParselets, infixParselets } from "./parseletsLookup.mjs";

export const parseCode = (tokens, precedence = 0) => {
  return parsePrefix(consume(tokens), precedence);
};

// parseCode :: tokens -> int -> expression
export const parsePrefix = ([token, tokens], precedence = 0) => {
  if (!token) {
    throw new SyntaxError(`Invalid token - ${token}.`);
  }

  const prefix = prefixParselets(token);

  if (!prefix) {
    throw new SyntaxError(
      `Could not parse ${token.value} of type ${token.type}.`
    );
  }

  let left = prefix.parse(token, tokens);

  while (precedence < getPrecedence(tokens)) {
    [left, tokens] = parseInfix(consume(tokens), left);
  }

  return [left, tokens];
};

const parseInfix = ([token, tokens], left) => {
  return infixParselets(token).parse(token, tokens, left);
};

// consume :: token -> [token, tokens]
export const consume = tokens => {
  return [tokens[0], tokens.slice(1)];
};

// consumeWithExpected :: token -> token -> [token, tokens]
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

// lookAhead :: tokens -> token
const lookAhead = (tokens, distance = 0) => {
  return tokens[0] ? tokens[0] : [];
};

// getPrecedence :: tokens -> int
const getPrecedence = tokens => {
  const parser = infixParselets(lookAhead(tokens));
  const prec = !parser ? precedences._ : parser.precedence;
  return prec;
};

// match :: token -> boolean
const match = (expectedTokenType, tokens) => {
  const token = lookAhead(tokens);

  if (token.type != expectedTokenType) {
    return false;
  }

  consume(tokens);
  return true;
};
