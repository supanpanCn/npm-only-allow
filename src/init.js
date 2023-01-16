const minimist = require("minimist");
const {
  removeSync,
  copySync,
  writeJsonSync,
  readJsonSync,
} = require("fs-extra");
const {
  existsSync,
  unlinkSync,
  readFileSync
} = require('fs')
const whichPMRuns = require("which-pm-runs");
const { warn, getType, merge, diffPkg , patch ,copyPkg } = require("./utils");
const {
  PMs,
  root,
  types,
  messages,
  resolves,
  useredPkgVestigital,
  sep,
} = require("./install/const");
const { uninstall } = require("./install/uninstall");
const {
  parseExecPM,
  parseLegality,
  parseUserPassedArgv,
  parseInstalledModule,
  parsePkgExist
} = require("./install/parse");
const {
  guessPM
} = require('./start/guess')

function processContext(ctx) {
  const checkType = ctx.utils.checkType;
  for (let key in ctx) {
    if (checkType(ctx[key]) === "O") {
      ctx[key].getContext = function () {
        return ctx;
      };
    }
  }
  require("./install/process").onProcessCallback(ctx);
  return ctx;
}
function createContext() {
  const ctx = {};
  const log = warn(ctx);
  const checkType = getType(ctx);
  ctx.config = {
    PM: "",
    server: "",
    npm: {},
    _npm_postintall_throw_err: false,
  };
  ctx.utils = {
    exit: function () {
      ctx.config._npm_postintall_throw_err = true;
      process.exit(1);
    },
    merge,
    log,
    checkType,
    minimist,
    whichPMRuns,
    diffPkg:diffPkg(ctx),
    patch:patch(ctx)
  };
  ctx.parse = {
    parseExecPM,
    parsePkgExist,
    parseLegality,
    parseUserPassedArgv,
    parseInstalledModule,
    parsePM:guessPM
  };
  ctx.const = {
    PMs,
    sep,
    root,
    types,
    messages,
    resolves,
    useredPkgVestigital,
  };
  ctx.fs = {
    remove: removeSync,
    copy: copySync,
    writeJson: writeJsonSync,
    readJson: readJsonSync,
    exists:existsSync,
    unlink:unlinkSync,
    readFile:readFileSync,
    copyPkg:copyPkg(ctx)
  };
  ctx.npm = {
    uninstall
  };
  return processContext(ctx);
}
module.exports = {
  createContext,
};
