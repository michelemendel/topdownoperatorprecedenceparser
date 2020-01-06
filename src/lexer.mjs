import { getPunctuatorName, getType } from "./constants.mjs";

/**
 * tokens.js
 * 2011-01-04

 * (c) 2006 Douglas Crockford

 * http://crockford.com/javascript/tdop/tokens.js
 * http://crockford.com/javascript/tdop/tdop.html
 * http://crockford.com/javascript/tdop/index.html

 * Produce an array of simple token objects from a string.
 * A simple token object contains these members:
 *      type: name, string, number, punctuator
 *      value: string or number value of the token
 *      from: index of first character of the token
 *      to: index of the last character + 1
 *
 * Comments of the // type are ignored.
 *
 * Note: Minor changes by Michele Mendel (12.2019)
 *
 */

const rx_crlf = /\n|\r\n?/;

export function tokenize(source) {
  // tokenize takes a source and produces from it an array of token objects.
  // If the source is not an array, then it is split into lines at the
  // carriage return/linefeed.

  const lines = Array.isArray(source) ? source : source.split(rx_crlf);
  const result = [];

  lines.forEach(function(line, lineNr) {
    const rx_token = /(\u0020+)|(\/\/.*)|((?:@|#)?[a-zA-Z][a-zA-Z_0-9]*)|(\d+(?:\.\d+)?(?:[eE][+\-]?\d+)?)|("(?:[^"\\]|\\(?:[nr"\\]|u[0-9a-fA-F]{4}))*")|([(){}\[\]?.,:;~*%\/]|&&?|\|\|?|[+\-<>]=?|[!=](?:==)?)/y;

    // Capture Group
    // [1]  Whitespace
    // [2]  Comment
    // [3]  Name including identifier (@) and reference (#)
    // [4]  Number
    // [5]  String
    // [6]  Punctuator

    let columnNr = 0;

    // Make a token object and append it to the result.
    let makeToken = function(type, value) {
      // Is comment inline?
      if (type === "COMMENT" && lineNr === result[result.length - 1].lineNr) {
        type = "COMMENT_INLINE";
      }

      result.push({
        type,
        value,
        lineNr,
        columnNr
      });
    };

    while (columnNr < line.length) {
      let captives = rx_token.exec(line);

      //   console.log("--C->", captives);

      if (!captives) {
        throw new SyntaxError("line " + lineNr + " column " + columnNr);
      } else if (captives[1]) {
        //Intentionally ignore whitespace
      } else if (captives[2]) {
        makeToken("COMMENT", captives[2]);
      } else if (captives[3]) {
        makeToken(getType(captives[3]), captives[3]);
      } else if (captives[4]) {
        let number = Number(captives[4]);
        if (Number.isFinite(number)) {
          makeToken("NUMBER", number);
        } else {
          throw new TypeError("line " + lineNr + " column " + columnNr);
        }
      } else if (captives[5]) {
        makeToken("STRING", JSON.parse(captives[5]));
      } else if (captives[6]) {
        makeToken(getPunctuatorName(captives[6]), captives[0]);
      }
      columnNr = rx_token.lastIndex;
    }
  });
  return result;
}
