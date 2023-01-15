function guessPM(ctx) {
  const { exists, readFile ,readJson } = ctx.fs;
  const { resolves, PMs } = ctx.const;
  const { PM } = ctx.config;
  const {
    log,
    exit
  } = ctx.utils
  const checks = PMs.filter((v) => v !== 'cnpm');
  let gus = []
  for (let i = 0; i < checks.length; i++) {
    const path = resolves.get("lock_path")(checks[i]);
    if (exists(path)) {
      gus.push(checks[i])
    }
  }
  // cnpm或正常情况下为[]
  gus = gus.filter(v=>v!==PM)
  if(gus.length) return gus
  if(PM !== 'cnpm'){
    const lock_path = resolves.get('lock_path')(PM)
    if(!exists(lock_path)){
      log('GUIDE_NO_LOCK','yellow')
      exit()
    }
    const lock_file = readFile(lock_path,'utf-8')
    const {
      dependencies,
      devDependencies
    } = readJson(resolves.get('pkg_path')) || {}
    const deps = [...Object.keys(devDependencies || {}),...Object.keys(dependencies || {})]
    let matchs = []
    for(let i=0;i<deps.length;i++){
      if(lock_file.includes(deps[i])){
        matchs.push(deps[i])
      }
    }
    if(matchs.length === deps.length){
      return []
    }

  }
  return ['cnpm']
}
module.exports = {
  guessPM,
};
