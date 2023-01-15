function _getType(p) {
  return Object.prototype.toString.call(p)
}

function getType(ctx) {
  return function (p) {
    const ty = _getType(p)
    return ctx.const.types.get(ty)
  }
}

function warn(ctx) {
  const colors = require('picocolors')
  return function (type, ...rest) {
    if (type) {
      let log = ''
      const msg = ctx.const.messages.get(type)
      let color = 'red'
      if (ctx.utils.checkType(msg) === 'F') {
        log = msg(...rest)
      } else {
        log = msg
        color = rest[0] ? rest[0] : color
      }
      console.log(colors[color](`[npm-postinstall]:${log}`))
    }
  }
}

function merge(a, b, isCover) {
  const O = '[object Object]'
  if (_getType(a) === O && _getType(b) === O) {
    if (isCover) {
      return {
        ...a,
        ...b
      }
    }
    const obj = {}
    for (let key in a) {
      if (b.hasOwnProperty(key)) {
        if (b[key]) {
          if (_getType(b[key]) === O) {
            obj[key] = merge(a[key], b[key])
          } else {
            obj[key] = b[key]
          }
          delete b[key]
        } else {
          obj[key] = a[key]
        }
      }
    }
    return {
      ...a,
      ...b,
      ...obj
    }
  }
  if (_getType(a) === O && _getType(b) !== O) {
    return {
      ...a,
      _merged: b
    }
  }
}

function diffPut(olds, news) {
  const O = '[object Object]'
  const puts = []
  if (_getType(olds) === O && _getType(news) === O) {
    for (let key in news) {
      if (news[key] && !olds[key]) {
        puts.push(key)
      }
    }
  }
  return puts
}

function diffPkg(ctx) {
  return function () {
    const {
      readJson,
      exists
    } = ctx.fs
    const resolves = ctx.const.resolves
    const pre_pkg_path = resolves.get('copy_path')
    const pkg_path = resolves.get('pkg_path')
    if(exists(pre_pkg_path) && exists(pkg_path)){
      const old = readJson(pre_pkg_path)
      const lat = readJson(pkg_path)
      const puts = [...diffPut(old.dependencies,lat.dependencies),...diffPut(old.devDependencies,lat.devDependencies)]
      return puts
    } 
    return []
  }
}

function patch(ctx) {
  return function () {
    const {
      server,
      npm
    } = ctx.config
    const {
      parseInstalledModule
    } = ctx.parse
    const {
      diffPkg,
      exit,
      log
    } = ctx.utils
    const {
      copy,
      exists,
      readJson,
      writeJson
    } = ctx.fs
    const {
      resolves
    } = ctx.const
    const installed = parseInstalledModule.call(ctx.parse,true)
    // yarn add pkg
    if (server === 'install') {
      if (npm.name === 'yarn') {
        if (installed) {
          const puts = diffPkg()
          if(puts.length){
            log('UN_MATCHED_INSTALL',puts)
            const pkg_path = resolves.get("pkg_path");
            const copy_pkg_path = resolves.get("copy_path")
            if(exists(copy_pkg_path) && exists(pkg_path)){
              const o = readJson(copy_pkg_path)
              const l = readJson(pkg_path)
              writeJson(copy_pkg_path,{
                ...o,
                ...l,
                dependencies:o.dependencies || {},
                devDependencies:o.devDependencies || {}
              },{
                spaces:'\t'
              })
              copy(copy_pkg_path,pkg_path)
            }
            exit()
          }
        }
      }
    }
    return installed
  }
}

module.exports = {
  warn,
  getType,
  merge,
  diffPkg,
  patch
}