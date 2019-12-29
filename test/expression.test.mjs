import t from "tap";
import { tokenize } from "../src/lexer.mjs";
import { parseCode } from "../src/parser.mjs";
import { punctuators } from "../src/constants.mjs";

/**
 * Three parts
 * 1. input
 * 2. wanted - the AST
 * 3. wantedRemains - the rest of the tokens (should be empty if everything is ok)
 */

const standardSuccess = (input, wanted, wantedRemains, errorMsg) => {
  errorMsg = errorMsg || "the remains should be empty";

  t.test(input, t => {
    const tokens = tokenize(input);
    const [found, foundRemains] = parseCode(tokens);
    t.same(found, wanted);
    t.same(foundRemains, wantedRemains, errorMsg);
    t.end();
  });
};

/************************************************************
 * Testing a simple expression.
 * result: success
 */

const input1 = op => `2 ${op} 10 * 8`;

const wanted1 = op => ({
  type: punctuators[op],
  value: op,
  children: [
    {
      type: "NUMBER",
      value: 2
    },
    {
      type: "PRODUCT",
      value: "*",
      children: [
        {
          type: "NUMBER",
          value: 10
        },
        {
          type: "NUMBER",
          value: 8
        }
      ]
    }
  ]
});

const wantedRemains1 = [];

standardSuccess(input1("+"), wanted1("+"), wantedRemains1);
standardSuccess(input1("-"), wanted1("-"), wantedRemains1);

/************************************************************
 * Testing an expression with a wrong infix (%).
 * result: failure with non-empty remains
 */

const input2 = `2 % 10 * 8`;

const wanted2 = {
  type: "NUMBER",
  value: 2
};

const wantedRemains2 = [
  {
    type: "PERCENT",
    value: "%",
    lineNr: 0,
    columnNr: 2
  },
  {
    type: "NUMBER",
    value: 10,
    lineNr: 0,
    columnNr: 4
  },
  {
    type: "PRODUCT",
    value: "*",
    lineNr: 0,
    columnNr: 7
  },
  {
    type: "NUMBER",
    value: 8,
    lineNr: 0,
    columnNr: 9
  }
];

const errorMsg = "the remains should not be empty";

standardSuccess(input2, wanted2, wantedRemains2, errorMsg);

/************************************************************
 * Testing an expression with a negated value.
 * result: success
 */

const input3 = `-2 + 4 * -8`;

const wanted3 = {
  type: "SUM",
  value: "+",
  children: [
    {
      type: "MINUS",
      value: "-",
      children: [
        {
          type: "NUMBER",
          value: 2
        }
      ]
    },
    {
      type: "PRODUCT",
      value: "*",
      children: [
        {
          type: "NUMBER",
          value: 4
        },
        {
          type: "MINUS",
          value: "-",
          children: [
            {
              type: "NUMBER",
              value: 8
            }
          ]
        }
      ]
    }
  ]
};

const wantedRemains3 = [];

standardSuccess(input3, wanted3, wantedRemains3);

/************************************************************
 * Testing groupings
 * result: success
 */

const input4 = `(2 + 4) * 8`;

const wanted4 = {
  type: "PRODUCT",
  value: "*",
  children: [
    {
      type: "SUM",
      value: "+",
      children: [
        {
          type: "NUMBER",
          value: 2
        },
        {
          type: "NUMBER",
          value: 4
        }
      ]
    },
    {
      type: "NUMBER",
      value: 8
    }
  ]
};

const wantedRemains4 = [];

standardSuccess(input4, wanted4, wantedRemains4);

/************************************************************
 * Testing a function call
 * result: success
 */

const input5 = `myfn()`;

const wanted5 = {
  type: "CALL",
  value: "myfn",
  children: []
};

const wantedRemains5 = [];

standardSuccess(input5, wanted5, wantedRemains5);

const input6 = `myfn(a)`;

const wanted6 = {
  type: "CALL",
  value: "myfn",
  children: [
    {
      type: "NAME",
      value: "a"
    }
  ]
};

const wantedRemains6 = [];

standardSuccess(input6, wanted6, wantedRemains6);

const input7 = `myfn(a, b)`;

const wanted7 = {
  type: "CALL",
  value: "myfn",
  children: [
    {
      type: "NAME",
      value: "a"
    },
    {
      type: "NAME",
      value: "b"
    }
  ]
};

const wantedRemains7 = [];

standardSuccess(input7, wanted7, wantedRemains7);
