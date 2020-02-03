import { tokenizeCode } from "./lexer.mjs";
import { parseCode, rootify } from "./parser.mjs";
import { performance, PerformanceObserver } from "perf_hooks";
import util from "util";
import { codeWithFunctions as code } from "../data/simple1.mjs";
import { code as x } from "../data/empower.mjs";

const debug = util.debuglog("performance");
const log = console.log;
const VERBOSE = {
  ON: true,
  OFF: false,
};

const splash = () => {
  log("\n=========================================");
  log("================= START =================");
  log("=========================================\n");
};

const initPerformance = (verbose = VERBOSE.ON) => {
  if (verbose) {
    const obs = new PerformanceObserver(measure => {
      const m = measure.getEntries()[0];
      log(
        util.format(
          "\x1b[31mPERFORMANCE:\x1b[0m %s\t%s ms",
          m.name,
          m.duration,
        ),
      );
      performance.clearMarks();
    });
    obs.observe({ entryTypes: ["function"] });
  }
};

const tokenize = (code, verbose = VERBOSE.ON) => {
  const tokens = tokenizeCode(rootify(code));

  if (verbose) {
    console.log("\n========== TOKENS\n");
    console.log(
      "tokens",
      tokens,
      //   tokens.map(t => `${t.type}, ${t.value}`)
    );
    // console.log(JSON.stringify(tokens, null, "\t"));
  }

  return tokens;
};

const parse = (tokens, verbose = VERBOSE.ON) => {
  const [ast, remainingTokens, errors] = parseCode(tokens);

  if (verbose) {
    log("\n========== AST\n");
    log(JSON.stringify(ast, null, "  "));
    log("\n========== REMAINING TOKENS (should be empty)\n");
    log(JSON.stringify(remainingTokens, null, "  "));
    log("\n========== ERRORS\n");
    log(
      errors ? `\nERROR\n ${errors.message} "\nSTACK\n" ${errors.stack}` : "",
    );
  }
};

splash();

initPerformance(VERBOSE.OFF);
const timedTokenize = performance.timerify(tokenize);
const timedParse = performance.timerify(parse);

const tokens = timedTokenize(code, VERBOSE.ON);
timedParse(tokens, VERBOSE.ON);
