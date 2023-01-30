#!/usr/bin/env node
async function run() {
  try {
    // create contenxt
    const ctx = require("./src/init")();

    // check package.json
    const { log, exit } = ctx.utils;
    if (!ctx.fs.exists(ctx.const.resolves.get("pkg_path"))) {
      log("NO_PKG");
      exit();
    }

    // which script running
    const script = process.env.npm_lifecycle_event;
    const pre = script === "preinstall" || script === undefined;
    const server = pre ? "install" : "start";
    // analysis argv
    ctx.analysis.analyseArgv(ctx);

    // do : start or install
    if (server === "install") {
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
