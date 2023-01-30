const PMs = ['npm','cnpm','pnpm','yarn']

const npmName = 'npm-only-allow'

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
  ['copy_path',path.resolve(__filename,'../../../cache/pkg.json')],
  ['copy_lock_path',path.resolve(__filename,'../../../cache/lock.json')],
  ['cache_path',path.resolve(__filename,'../../../cache')],
  ['config_path',path.resolve(__filename,'../../../cache/config.json')],
  ['dynamic_path',(filePath)=>path.resolve(filePath)],
  ['pnpm_err_path',path.resolve(root,'.pnpm-debug.log')]
])

const messages = new Map([
  ['NO_PM_PROVIDER',`请提供想要使用的包管理器:${PMs.join('、')}`],
  ['NONLICET_PM',(extra)=>`${extra && extra} 不是有效的包管理器. 请从如下包管理器中任选其一: ${PMs.join('、')}`],
  ['MIS_MATCH',(current,setted)=>`当前运行的${current ? '('+current+')' : ''}包管理器与设置的${setted ? '('+setted+')' : ''}不一致`],
  ['EXIT','依赖安装失败！请删除（如果有）npminstall-debug.log文件后重试'],
  ['UN_INSTALLED',(PM)=>`node_modules不存在，请使用${orders.get(PM) || 'npm i'}进行安装`],
  ['UN_MATCHED_INSTALL',(puts)=>`检测到您可能使用了不匹配的包管理器安装了依赖${puts.length?'（'+ puts.join('、')+')':''},请卸载或使用正确的管理器安装后重试`],
  ['GUIDE','这可能是由于您本地存在多个lock文件，如果您认为该检测是不准确的，您可以删除lock文件尝试跳过'],
  ['GUIDE_NO_LOCK','您可能错误的删除了lock文件，请重新生成'],
  ['GUIDE_MIS_MATCH_PNPM','请删除（如果有）.pnpm-debug.log文件后重试'],
  ['NO_PKG','package.json文件不存在'],
  ['NO_PRE_HOOK','未定义preinstall'],
  ['MORE_USED','您应当仅在开始(如：start)和preinstall中使用该脚本'],
])

const messages_en = new Map([
  ['NO_PM_PROVIDER',`Please specify the wanted package manager: ${PMs.join('、')}`],
  ['NONLICET_PM',(extra)=>`${extra && extra} not a valid package manager. the alternative: ${PMs.join('、')}`],
  ['MIS_MATCH',(current,setted)=>`The current used ${current ? '('+current+')' : ''} package manager is inconsistent with the set ${setted ? '('+setted+')' : ''}`],
  ['EXIT','If npminstall-debug.log exists , delete it and try again'],
  ['UN_INSTALLED',(PM)=>`'node_modules' is not present，install with ${orders.get(PM) || 'npm i'}`],
  ['UN_MATCHED_INSTALL',(puts)=>`Detected that you may have installed a dependency ${puts.length?'（'+ puts.join('、')+')':''} using a mismatched package manager ,please uninstall or use correct PM ant try again`],
  ['GUIDE','This may be due to the presence of multiple lock files locally, if you think the detection is inaccurate, you can remove the lock file to try to skip'],
  ['GUIDE_NO_LOCK','You may have deleted the lock file by mistake. Please regenerate it'],
  ['GUIDE_MIS_MATCH_PNPM',`If '.pnpm-debug.log' exists , delete it and try again`],
  ['NO_PKG',`The 'package.json' file does not exist`],
  ['NO_PRE_HOOK','Undefined preinstall'],
  ['MORE_USED','You should only use this script at the start (e.g., start) and preinstall'],
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
  messages_en,
  types,
  root,
  sep,
  PMs,
  resolves,
  useredPkgVestigital,
  npmName
}