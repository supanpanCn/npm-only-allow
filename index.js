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
    
    // analysis argv
    ctx.analysis.analyseArgv(ctx);

    // whether PM is exist
    if(!ctx.config.PM){
      log("NO_PM_PROVIDER");
      exit();
    }

    // set ignore
    const ignore_path = ctx.const.resolves.get('ignore_path')
    ctx.fs.appendFile(ignore_path,`\r\n/.npm-only-allow`)

    // which script running
    const script = process.env.npm_lifecycle_script;
    const server = script.includes(ctx.config.PM) ? "install" : "start";

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
