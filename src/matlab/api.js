const ffi = require('ffi')
const ref = require('ref')
const refArray = require('ref-array')
const path = require('path')

const DoubleArray = refArray(ref.types.double)
const input = new DoubleArray(7)
input[0] = 49
input[1] = 58
input[2] = 7
input[3] = 8
input[4] = 5
input[5] = 1644
input[6] = 2617
let initFlag = false

function Matlab () {
  var libpath = path.join(__dirname, '../../../')
  // 这是由于默认的进程Path是二进制文件所在目录，即node.exe/electron.exe目录而不是DLL所在目录
  // if (process.env.NODE_ENV === 'production') {
  //   libpath = ''
  // } else {
  //   libpath = path.join(__dirname, '')
  // }
  process.env.PATH = `${process.env.PATH}${path.delimiter}${libpath}`
  const dll = 'DllTest.dll'
  // if (dll !== undefined) {
  //   throw new Error('Dynamic Linking Error: ' + libpath)
  // }
  this.testLib = ffi.Library(dll, {
    init: ['int', []],
    stop: [ref.types.void, []],
    compute: [ref.types.double, [DoubleArray]]
  })
  this.init = function () {
    // 初始化设备
    let res = this.testLib.init()
    if (res > 0) {
      initFlag = true
    } else {
      initFlag = false
    }
    return res
  }
  this.calculate = function (jsonStr) {
    // 初始化设备
    if (!initFlag) {
      this.testLib.init()
    }
    let arr = jsonStr.split(',')
    console.log(input)
    // for (let i = 0; i < arr.length; i++) {
    for (let i = 0; i < 7; i++) {
      input[i] = arr[i]
    }
    console.log(input)
    return this.testLib.compute(input)
  }
  this.stop = function () {
    // 初始化设备
    initFlag = false
    return this.testLib.stop()
  }
  this.state = function () {
    return initFlag
  }
}
exports.api = new Matlab()
