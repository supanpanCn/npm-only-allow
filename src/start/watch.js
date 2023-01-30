module.exports = function(ctx){
  const { chokidar ,diffPkg } = ctx.utils
  const {resolves} = ctx.const
  let timer = null
  function _change(){
    if(timer){
      clearTimeout(timer)
    }
    timer = setTimeout(()=>{
      const puts = diffPkg()
      if(puts.length){
        require('./index')(ctx,true)
      }
    },300)
  }
  chokidar.watch(resolves.get('pkg_path')).on('change',_change)
}
