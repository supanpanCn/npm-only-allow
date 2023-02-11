function analyseArgv(ctx) {
  const { resolves } = ctx.const;
  const { readJson, exists } = ctx.fs;
  const { log, exit, minimist ,whichPMRuns } = ctx.utils;
  const { npmName } = ctx.const
  const pkg_path = resolves.get("pkg_path");
  if (exists(pkg_path)) {
    const package = readJson(pkg_path) || {};
    const scripts = package.scripts || {};
    const keys = Object.values(scripts).filter((v) =>
      v.includes(npmName)
    );
    const t = {};
    for (let key in scripts) {
      if (keys.includes(scripts[key])) {
        t[key] = scripts[key];
      }
    }
    if (!t["preinstall"]) {
      log("NO_PRE_HOOK");
      exit();
    }
    const ins = t.preinstall;
    const insArgv = minimist(ins.split(' ').filter(v=>v))
    ctx.config.PM = insArgv.PM
    ctx.config.lang = insArgv.lang || 'en'
    ctx.config.npm = whichPMRuns()

    delete t.preinstall
    const restLen = Object.keys(t).length
    if(restLen > 1){
      log("MORE_USED");
      exit();
    }

    if(restLen === 0) return

    const star = t[Object.keys(t)[0]]
    const starArgv = star.split('&&')
    const userScript = starArgv.filter(v=>!v.includes(npmName)).map(v=>v.trim())
    ctx.config.userScript = userScript
  }
}

module.exports = {
  analyseArgv,
};
