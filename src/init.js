const minimist = require("minimist");
const {
  removeSync,
  copySync,
  writeJsonSync,
  readJsonSync,
} = require("fs-extra");
const { existsSync, unlinkSync, readFileSync , appendFileSync } = require("fs");
const whichPMRuns = require("which-pm-runs");
const chokidar = require("chokidar");
const funcs = require("./shared/function");
const consts = require("./shared/const");
const patchs = require("./shared/patch");
const analysis = require("./shared/analysis")

function processContext(ctx,obj,arr){
  const ls = Array.isArray(arr) ? arr : Object.keys(obj)
  for(let i = 0 ; i<ls.length;i++){
    const v = ls[i]
    if(typeof obj[v] === 'function'){
      obj[v] = obj[v](ctx)
    }
  }
}

function createContext() {
  const ctx = {};

  ctx.config = {
    PM: "",
    server: "",
    npm: {},
    lang: "zh",
    userScript:[],
    _npm_postintall_throw_err: false,
  };

  ctx.const = consts;
  ctx.analysis = analysis
  ctx.patch = patchs
  
  processContext(ctx,ctx.patch)

  ctx.utils = {
    ...funcs,
    minimist,
    chokidar,
    whichPMRuns,
    exit: function () {
      ctx.config._npm_postintall_throw_err = true;
      process.exit(1);
    }
  };

  processContext(ctx,ctx.utils,['log','checkType','checkInstalledModule','diffPkg'])

  ctx.fs = {
    remove: removeSync,
    copy: copySync,
    writeJson: writeJsonSync,
    readJson: readJsonSync,
    exists: existsSync,
    appendFile:appendFileSync,
    unlink: unlinkSync,
    readFile: readFileSync,
    setCache:funcs.setCache
  };

  processContext(ctx,ctx.fs,['setCache'])

  ctx.npm = {
    uninstall:funcs.uninstall(ctx),
  };

  require("./install/process").onProcessCallback(ctx);
  return ctx;
}
module.exports = createContext;
