#!/usr/bin/env node
async function run() {
  try {
    // create contenxt
    const ctx = require("./src/init")();
    
    // check package.json
    const { minimist, log, exit } = ctx.utils;
    if (!ctx.fs.exists(ctx.const.resolves.get("pkg_path"))) {
      log("NO_PKG");
      exit();
    }

    // which script running
    const script = process.env.npm_lifecycle_event;
    const server =
      script === "preinstall" || script === undefined ? "install" : "start";

    // analysis argv
    ctx.analysis.analyseArgv(ctx)

    // do : start or install
    const argvs = minimist(process.argv.slice(2));
    const actualServer = argvs.server || server;

    if (actualServer === "install") {
      require("./src/install")(ctx);
    } else {
      require("./src/start")(ctx);
    }
  } catch (_) {
    console.error(_);
    process.exit(1);
  }
}
run();
