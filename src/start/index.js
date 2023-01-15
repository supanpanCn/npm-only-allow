function start(ctx) {
  const {
    diffPkg,
    log,
    exit
  } = ctx.utils
  const gus = require('./guess').guessPM(ctx)
  if(gus.length === 0) return
  const puts = diffPkg()
  if(puts.length){
    log('UN_MATCHED_INSTALL',puts)
    exit()
  }
}
module.exports = {
  start,
};
