function parseArg() {
  const ctx = this.getContext();
  const {
    minimist,
    log,
    exit,
    merge
  } = ctx.utils;
  const {
    PMs,
    resolves
  } = ctx.const;
  const {
    readJson,
    writeJson,
    exists
  } = ctx.fs;
  const {
    PM,
    server = "install",
    lang = 'zh'
  } = minimist(process.argv.slice(2));
  
  ctx.config.lang = lang
  ctx.config._npm_postintall_throw_err = false
  let currentPM = PM;
  if (server === "install") {
    if (!currentPM) {
      log("NO_PM_PROVIDER");
      exit();
    }
    if (!PMs.includes(currentPM)) {
      log("NONLICET_PM", currentPM);
      exit();
    }
  }
  ctx.config.PM = currentPM;
  ctx.config.server = server;
  
  
  const config_path = resolves.get("config_path")
  if(exists(config_path)){
    const config = readJson(config_path);
    if(server === 'install' && config.PM !== currentPM){
      ctx.npm.uninstall('cache_path')
    }
    if (server === "start") {
      ctx.config = merge(config, ctx.config);
      writeJson(resolves.get("config_path"), ctx.config,{
        spaces:'\t'
      });
    }
  }

}

function parseExecPM() {
  const ctx = this.getContext();
  const usedPM = ctx.utils.whichPMRuns();
  ctx.config.npm = usedPM;
}

function parseLegality() {
  const ctx = this.getContext();
  const {
    npm,
    PM
  } = ctx.config;
  const {
    log,
    exit,
    patch
  } = ctx.utils
  if (npm.name === PM) return;
  log("MIS_MATCH", npm.name, PM);
  const installed =  patch()
  if(installed){
    const gus = ctx.parse.parsePM(true)
    if(gus.length){
      ctx.npm.uninstall('node_modules_path');
    }
  }
  
  if(npm.name === 'pnpm'){
    log('GUIDE_MIS_MATCH_PNPM','yellow')
  }
  setTimeout(() => {
    exit();
  }, 500);
}

function parseInstalledModule(exit) {
  const ctx = this.getContext();
  const installed = ctx.fs.exists(ctx.const.resolves.get("node_modules_path"))
  if (!installed && !exit) {
    const {
      PM
    } = ctx.config;
    const {
      log,
      exit
    } = ctx.utils
    ctx.npm.uninstall('cache_path')
    log("UN_INSTALLED", PM);
    exit();
  }
  return installed
}

function parsePkgExist(){
  const ctx = this.getContext();
  const {
    log,
    exit
  } = ctx.utils

  if(!ctx.fs.exists(ctx.const.resolves.get('pkg_path'))){
    log('NO_PKG')
    exit()
  }
}

module.exports = {
  parseExecPM,
  parseLegality,
  parseUserPassedArgv: parseArg,
  parseInstalledModule,
  parsePkgExist
};