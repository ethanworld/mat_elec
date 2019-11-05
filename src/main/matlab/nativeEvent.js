const { ipcMain } = require('electron')
var api = require('./api').api

exports.nativeEvent = function () {
  // 初始化
  ipcMain.on('init', (event, arg) => {
    console.log(arg)
    setTimeout(() => {
      var info = api.init()
      event.sender.send('getInitRes', info)
    }, 0)
  })
  // 获取状态
  ipcMain.on('state', (event, arg) => {
    setTimeout(() => {
      var info = api.state()
      event.sender.send('getStateRes', info)
    }, 0)
  })
  // 开始计算
  ipcMain.on('calculate', (event, arg) => {
    setTimeout(() => {
      console.log(arg)
      var info = api.calculate(arg)
      event.sender.send('getCalculateRes', info)
    }, 0)
  })
  // 释放matlab
  ipcMain.on('stop', (event, arg) => {
    setTimeout(() => {
      api.stop()
    }, 0)
  })
}
