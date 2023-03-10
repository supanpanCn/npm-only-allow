module.exports = function (ctx, changing) {
  ctx.config.server = "start";
  const { checkInstalledModule, diffPkg, log, exit } = ctx.utils;
  const { setCache , exists, readFile } = ctx.fs;
  const { PM } = ctx.config;
  const { resolves } = ctx.const;
  const { cnpm } = ctx.patch;
  checkInstalledModule();
  const puts = diffPkg();
  if (puts.length) {
    if (PM === "cnpm") cnpm(puts);
    let misDep = 0;
    const lockPath = resolves.get("lock_path")(PM);
    if (exists(lockPath)) {
      const lockFile = readFile(lockPath);
      for (let i = 0; i < puts.length; i++) {
        if (lockFile.indexOf(puts[i]) === -1) {
          misDep++;
        }
      }
    }

    if (misDep === 0) {
      setCache()
      return
    }

    log("UN_MATCHED_INSTALL", puts);
    exit();
  }
  if (changing) return;
  setCache()
  require("./watch")(ctx);
  require("./userProcess")(ctx);
};
