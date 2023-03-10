function _getType(p) {
  return Object.prototype.toString.call(p);
}

function getType(ctx) {
  return function (p) {
    const ty = _getType(p);
    return ctx.const.types.get(ty);
  };
}

function warn(ctx) {
  const colors = require("picocolors");
  return function (type, ...rest) {
    if (type) {
      let log = "";
      const lang = ctx.config.lang;
      const msg =
        lang === "en"
          ? require("./shared/const").messages_en.get(type)
          : ctx.const.messages.get(type);
      let color = "red";
      if (ctx.utils.checkType(msg) === "F") {
        log = msg(...rest);
      } else {
        log = msg;
        color = rest[0] ? rest[0] : color;
      }
      console.log(colors[color](`[npm-only-allow]:${log}`));
    }
  };
}

function diffPut(olds, news) {
  const O = "[object Object]";
  const puts = [];
  if (_getType(olds) === O && _getType(news) === O) {
    for (let key in news) {
      if (news[key] && !olds[key]) {
        puts.push(key);
      }
    }
  }
  return puts;
}

function diffPkg(ctx) {
  return function () {
    const { readJson, exists } = ctx.fs;
    const resolves = ctx.const.resolves;
    const prefix = resolves.get('cache_path')
    const pre_pkg_path = ctx.utils.resolve(prefix,'pkg.json');
    const pkg_path = resolves.get("pkg_path");
    if (exists(pre_pkg_path) && exists(pkg_path)) {
      const old = readJson(pre_pkg_path);
      const lat = readJson(pkg_path);
      const puts = [
        ...diffPut(old.dependencies, lat.dependencies),
        ...diffPut(old.devDependencies, lat.devDependencies),
      ];
      return puts;
    }
    return [];
  };
}

function setCache(ctx) {
  return function () {
    const { exists, copy ,writeJson } = ctx.fs;
    const { resolves } = ctx.const;
    const { resolve } = ctx.utils
    const pkg_path = resolves.get("pkg_path");
    const lock_path = resolves.get("lock_path")(ctx.config.PM);
    const prefix = resolves.get('cache_path')
    exists(pkg_path) && copy(pkg_path, resolve(prefix,'pkg.json'));
    exists(lock_path) && copy(lock_path, resolve(prefix,'lock.json'));
    writeJson(resolve(prefix,'config.json'), ctx.config, {
      spaces: '\t'
    });
  };
}

function uninstall(ctx) {
  return function (path) {
    const { exists, remove } = ctx.fs;
    const un_install_path = ctx.const.resolves.get(path);
    exists(un_install_path) && remove(un_install_path);
  };
}

function checkInstalledModule(ctx) {
  return function (exit) {
    const installed = ctx.fs.exists(
      ctx.const.resolves.get("node_modules_path")
    );
    if (!installed && !exit) {
      const { PM } = ctx.config;
      const { log, exit } = ctx.utils;
      ctx.npm.uninstall("cache_path");
      log("UN_INSTALLED", PM);
      exit();
    }
    return installed;
  };
}

module.exports = {
  log: warn,
  checkType: getType,
  diffPkg,
  uninstall,
  setCache,
  checkInstalledModule,
  resolve:require('path').resolve
};
