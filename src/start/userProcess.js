module.exports = function(ctx){
  const { userScript } = ctx.config
  if(userScript.length){
    require('concurrently')(userScript,{
      cwd:process.cwd()
    })
  }
}