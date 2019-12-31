import { tokenize } from "./lexer.mjs";
import { parseCode, rootify } from "./parser.mjs";

const splash = () => {
  console.log("\n=========================================");
  console.log("================= START =================");
  console.log("=========================================\n");
};

/**
 *
 */
const showTokens = tokens => {
  console.log("\n========== TOKENS\n");
  console.log(
    "tokens",
    tokens
    //   tokens.map(t => `${t.type}, ${t.value}`)
  );
  // console.log(JSON.stringify(tokens, null, "\t"));
};

/**
 *
 */
const parse = tokens => {
  const [ast, remainingTokens, errors] = parseCode(tokens);

  console.log("\n========== AST\n");
  console.log(JSON.stringify(ast, null, "  "));
  console.log("\n========== REMAINING TOKENS (should be empty)\n");
  console.log(JSON.stringify(remainingTokens, null, "  "));
  console.log("\n========== ERRORS\n");
  console.log(
    errors ? `\nERROR\n ${errors.message} "\nSTACK\n" ${errors.stack}` : ""
  );
};

const code = `
a : 33 / 3 = 999
b : "hello"
`;

const tokens = tokenize(rootify(code));
splash();
showTokens(tokens);
parse(tokens);

// -----------------------------------------------------------
// const code1 = `
// 2 * 1440 - 909 % 888
// // ( HELLO BYE )
// //Johnny B
// //"hello"
// //let qwe = (-2+-7)
// //widget arne #jonhson @nr1 {
// //  abx: 123 / 999
// //}
// //let fn = function() {};
// // This is a comment
// // (2 + 4) * (8 + 9)
// `;
