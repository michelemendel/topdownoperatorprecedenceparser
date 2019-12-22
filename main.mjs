import { tokenize } from "./lexer.mjs";
import { parseCode } from "./parser.mjs";

const code1 = `
2 * 1440 - 909 % 888
// ( HELLO BYE )
//Johnny B
//"hello"
//let qwe = (-2+-7)
//widget arne #jonhson @nr1 {
//  abx: 123 / 999
//}
//let fn = function() {};
// This is a comment
`;

const code = `2 + 10 * 8`;

const tokens = tokenize(code);

console.log("\n===========================================");
console.log("===========================================");
console.log(
  "tokens",
  tokens
  //   tokens.map(t => `${t.type}, ${t.value}`)
);
// console.log(JSON.stringify(tokens, null, "\t"));

// return: [ast, token[]]
// Tokens (res[1]) should be empty
const res = parseCode(tokens);

console.log(
  "\n---------------------\nRESULT\n---------------------\n",
  JSON.stringify(res[0], null, "  "),
  JSON.stringify(res[1], null, "  "),
  res[2] && res[2][0].message,
  res[2] && res[2][0].stack
);
