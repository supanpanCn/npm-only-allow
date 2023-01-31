module.exports = function (ctx) {
  const { PMs, resolves } = ctx.const;
  const { readJson, exists } = ctx.fs;
  const { log, exit,resolve } = ctx.utils;
  const { yarn } = ctx.patch;
  const { npm,PM } = ctx.config

  ctx.config.server = "install";

  // clear cache when user switched PM
  const prefix = resolves.get('cache_path')

  const config_path = resolve(prefix,'config.json');
  if (exists(config_path)) {
    const config = readJson(config_path);
    if (config.PM !== PM) ctx.npm.uninstall("cache_path");
  }

  if (npm.name === PM) return

  // whether PM is legal
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
