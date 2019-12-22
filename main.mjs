import { tokenize } from "./lexer.mjs";
import { parseCode } from "./parser.mjs";

const code = `
2 * 1440 - 909
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

const tokens = tokenize(code);

console.log("\n===========================================");
console.log("===========================================");
console.log(
  "tokens",
  tokens
  //   tokens.map(t => `${t.type}, ${t.value}`)
);
// console.log(JSON.stringify(tokens, null, "\t"));

const [result, _] = parseCode(tokens);

console.log(
  "\n---------------------\nRESULT\n---------------------\n",
  JSON.stringify(result, null, "  ")
);
