function uninstall(path) {
  const ctx = this.getContext();
  const {
    exists,
    remove
  } = ctx.fs
  const un_install_path = ctx.const.resolves.get(path);
  exists(un_install_path) && remove(un_install_path);
}
module.exports = {
  uninstall
};
