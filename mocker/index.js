const mock = require('./data/login'); // 引入模块mock的接口
const mock2 = require('./data/delete'); // 引入模块mock2的接口

const config = 'dev'; // dev '开发环境' pro '生产环境' 通过改变config的内容来实现后台与mock的切，支持热加载
const proxy = config === 'dev'
  ? {
    ...mock,
    ...mock2,
  }
  : {};
module.exports = proxy;
