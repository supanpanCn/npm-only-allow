const PMs = ['npm','cnpm','pnpm','yarn']

const orders = new Map([
  ['npm','npm install'],
  ['cnpm','cnpm install'],
  ['pnpm','pnpm install'],
  ['yarn','yarn'],
])

const root = process.cwd()
const path = require('path')
const sep =  path.sep

const resolves = new Map([
  ['node_modules_path',path.resolve(root,'node_modules')],
  ['npminstall_err_path',path.resolve(root,'npminstall-debug.log')],
  ['lock_path',(PM)=>path.resolve(root,useredPkgVestigital[PM])],
  ['pkg_path',path.resolve(root,'package.json')],
  ['copy_path',path.resolve(__filename,'../../../cache/package.json')],
  ['cache_path',path.resolve(__filename,'../../../cache')],
  ['config_path',path.resolve(__filename,'../../../cache/config.json')],
  // ['copy_lock_path',path.resolve(__filename,'../../../cache/lock.json')],
  ['dynamic_path',(filePath)=>path.resolve(filePath)],
  ['pnpm_err_path',path.resolve(root,'.pnpm-debug.log')]
])

const messages = new Map([
  ['NO_PM_PROVIDER',`请提供想要使用的包管理器:${PMs.join('、')}`],
  ['NONLICET_PM',(extra)=>`${extra && extra} 不是有效的包管理器. 请从如下包管理器中任选其一: ${PMs.join('、')}`],
  ['MIS_MATCH',(current,setted)=>`当前运行的${current ? '('+current+')' : ''}包管理器与设置的${setted ? '('+setted+')' : ''}不一致`],
  ['EXIT','依赖安装失败！请删除（如果有）npminstall-debug.log文件后重试'],
  ['UN_INSTALLED',(PM)=>`node_modules不存在，请使用${orders.get(PM) || 'npm i'}进行安装`],
  ['UN_MATCHED_INSTALL',(puts)=>`检测到您可能使用了不匹配的包管理器安装了依赖${puts.length?'（'+ puts.join('、')+')':''},请卸载后重试`],
  ['GUIDE','这可能是由于您本地存在多个lock文件，如果您认为该检测是不准确的，您可以删除lock文件尝试跳过'],
  ['GUIDE_NO_LOCK','您可能错误的删除了lock文件，请重新生成'],
  ['NO_PKG','package.json文件不存在']
])

const useredPkgVestigital = {
  'pnpm-lock.yaml':'pnpm',
  'yarn.lock':'yarn',
  'package-lock.json':'npm',
  'npm':'package-lock.json',
  'yarn':'yarn.lock',
  'pnpm':'pnpm-lock.yaml',
  'cnpm':'npm-register-none-lock'
} 


const types = new Map([
  ['[object Object]','O',],
  ['[object Function]','F',],
  ['[object Number]','N',],
  ['[object String]','S',]
])
module.exports = {
  messages,
  types,
  root,
  sep,
  PMs,
  resolves,
  useredPkgVestigital
}