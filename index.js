#!/usr/bin/env node
async function run(){
  try {
    const ctx = require('./src/init').createContext()
    ctx.parse.parsePkgExist()
    ctx.parse.parseUserPassedArgv()
    const { server = 'install' } = ctx.config
    if(server === 'install'){
      ctx.parse.parseExecPM()
      ctx.parse.parseLegality()
    }else if(server === 'start'){
      ctx.parse.parseInstalledModule()
      require('./src/start/index').start(ctx)
    }
  } catch (_) {
    console.error(_)
    process.exit(1)
  }
}
run()
