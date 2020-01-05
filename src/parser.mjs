import { precedences } from "./constants.mjs";
import { prefixParselets, infixParselets } from "./parseletsLookup.mjs";

// Adds a root document to code
// rootify :: string -> string
export const rootify = code => {
  return `document #Root ${code}`;
};

// parseCode :: tokens -> int -> [ast, token[]]
export const parseCode = (tokens, precedence = 0) => {
  return parsePrefix([...consume(tokens), precedence]);
};

/**
 * parsePrefix :: token -> token[] -> int -> [ast, token[]]
 */
export const parsePrefix = ([token, tokens, precedence]) => {
  const prefix = prefixParselets(token);

  if (!prefix) {
    return [
      {},
      tokens,
      SyntaxError(`Could not parse ${token.value} of type ${token.type}.`)
    ];
  }

  console.log("\n------\nPREFIX\n------\n", prefix);

  return parseInfix([...prefix.parse(token, tokens), precedence]);
};

/**
 * parseInfix :: ast -> token[] -> int -> [ast, token[]]
 */
const parseInfix = ([ast, tokens, precedence]) => {
  // console.log(
  //   "\n-----------\nPARSE INFIX\n-----------",
  //   "\n\tPREC/NEXT",
  //   precedence,
  //   "/",
  //   getPrecedence(tokens),
  //   "\n\tTOKENS\n\t",
  //   tokens.map(t => `${t.type}, ${t.value}`),
  //   "\n\tAST\n",
  //   JSON.stringify(ast, null, 2)
  // );

  if (precedence < getPrecedence(tokens)) {
    const parse = ([token, tokens]) => {
      console.log("\n------\nINFIX\n", infixParselets(token));
      return infixParselets(token).parse(ast, token, tokens);
    };

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
export const lookAhead = (tokens, distance = 0) => {
  return tokens[0] ? tokens[0] : [];
};

// match :: token -> token[] -> boolean
export const match = (expectedTokenType, tokens) => {
  return lookAhead(tokens).type === expectedTokenType;
};

// matchAndConsume :: token -> token[] -> [boolean, token, token[]]
export const matchAndConsume = (expectedTokenType, tokens) => {
  return [lookAhead(tokens).type === expectedTokenType, ...consume(tokens)];
};

// getPrecedence :: tokens[] -> int
const getPrecedence = tokens => {
  const infix = infixParselets(lookAhead(tokens));
  const prec = !infix ? precedences._ : infix.precedence;
  return prec;
};

export const listTokens = tokens => {
  return Array.isArray(tokens)
    ? tokens.map(t => `${t.type}, ${t.value}`)
    : "no tokens";
};
