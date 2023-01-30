module.exports = function (ctx) {
  const { PMs, resolves } = ctx.const;
  const { readJson, exists } = ctx.fs;
  const { log, exit } = ctx.utils;
  const { yarn } = ctx.patch;
  const { npm,PM } = ctx.config
  let correctTimes = 0

  ctx.config.server = "install";

  // clear cache when user switched PM
  const config_path = resolves.get("config_path");
  if (exists(config_path)) {
    const config = readJson(config_path);
    correctTimes = config.correctTimes
    if (config.PM !== PM) ctx.npm.uninstall("cache_path");
  }

  if (npm.name === PM){
    ctx.config.correctTimes = correctTimes + 1
    return
  }

  // whether PM is legal
  if (!PM) {
    log("NO_PM_PROVIDER");
    exit();
  }
  if (!PMs.includes(PM)) {
    log("NONLICET_PM", PM);
    exit();
  }

  log("MIS_MATCH", npm.name, PM);

  if (yarn()) ctx.npm.uninstall("node_modules_path");

  if (npm.name === "pnpm") {
    log("GUIDE_MIS_MATCH_PNPM", "yellow");
  }
  setTimeout(() => {
    exit();
  }, 500);
};
