const debugLog = require('log.js').debug;

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatDate = (date,seperator='/') => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()
  return [year, month, day].map(formatNumber).join(seperator)
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const log = function(object, message, tabs){
  if(tabs == undefined){
    tabs = 4
  }

  if(message == undefined){
    message = 'object'
  }
  console.log(message + ':' + JSON.stringify(object, tabs))
}

const resetStatus = function(object, key, defaultValue, setValue){
  debugLog(object);
  debugLog(setValue);
  for(let i in object){
    if(i == key){
      object[i] = setValue;
    }else{
      object[i] = defaultValue;
    }
    
  }
  debugLog(object);
}

const cloneObj = function(source, target){
  return Object.assign(target, source);
}

const pickerMaker = function(array, selectProperty){
  // debugLog('array', array);
  let res = {
    pickerObjs: {},
    pickerList: []
  }
  for(let i in array){
    // debugLog('i', i);
    let obj = array[i]
    // debugLog('obj',obj);
    // If not exist, append one
    if (!res.pickerObjs[obj[selectProperty]]){
      res.pickerObjs[obj[selectProperty]] = obj
      res.pickerList.push(obj[selectProperty])
    }
  }
  return res;
}

const getUserInfo = function(globalData){
  let userInfo = {}
  if (globalData.userInfo && globalData.userInfo != ''){
    // debugLog('utils.getUserInfo', globalData.userInfo)
    userInfo = globalData.userInfo;
  }else{
    userInfo = wx.getStorageSync('userInfo')
  }

  return userInfo
}

const setUserInfo = function (userInfo, globalData) {
  globalData.userInfo = userInfo
  wx.setStorageSync('userInfo', userInfo)
  // debugLog('globalData.userInfo', globalData.userInfo)
  // debugLog('setUserInfo', wx.getStorageSync('userInfo'))
}

const extractFileInfo = function(filePath){
  // debugLog('extractFileInfo.filePath', filePath)
  let fileInfo = {
    path: filePath,
    directory: '',
    filename: '',
    fileMajorName: '',
    fileExtension: ''
  }
  let regex = new RegExp("(.+/)(([^/]+)(\\.[^.]+))","gim")
  let regexGroups = regex.exec(filePath)
  // debugLog('extractFileInfo.regexGroups', regexGroups)
  if(regexGroups != undefined && regexGroups[1]){
    fileInfo.directory = regexGroups[1]
  }
  if (regexGroups != undefined && regexGroups[2]) {
    fileInfo.filename = regexGroups[2]
  }
  if (regexGroups != undefined && regexGroups[3]) {
    fileInfo.majorName = regexGroups[3]
  }
  if (regexGroups != undefined && regexGroups[4]) {
    fileInfo.extension = regexGroups[4]
  }
  // debugLog('extractFileInfo.fileInfo', fileInfo)
  return fileInfo
  
}

/**
 * 生成订单号
 */
function genOrderNo(cmpName, shipDate, callback){
  let orderNo = null;
  let nowDate = new Date()
  let secmillsec = nowDate.getHours().toString().padStart(2,'0')
    + nowDate.getMinutes().toString().padStart(2, '0')
    + nowDate.getSeconds().toString().padStart(2, '0')
    + (Math.floor(Math.random() * 100)).toString().padStart(2, '0')

  let orderPrefix = shipDate.replace(/\//gi, '') + secmillsec
  wx.cloud.callFunction({
    name: 'getOrderCount',
    data: {
      shipDateStr: shipDate,
      companyName: cmpName,
    },
    success: res => {
      // debugLog('genOrderNo.success.res', res)
      if(res.result && res.result.list && res.result.list.length > 0){
        if (callback && typeof callback == 'function') {
          orderNo = orderPrefix + (res.result.list[0].count+1).toString().padStart(4, '0')
          callback(orderNo)
        }
      }else{
        let lastNo = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0')
        orderNo = orderPrefix + lastNo
        callback(orderNo)
      }

    },
    fail: err => {
      let lastNo = (Math.floor(Math.random() * 10000)).toString().padStart(4, '0')
      orderNo = orderPrefix + lastNo
      callback(orderNo)
    }
  })
}

/**
 * 获取Event事件的Detail.Value
 */
function getEventDetailValue(e) {
  let value = ''
  try {
    value = e.detail.value
  } catch (e) {
    // value = ''
  }
  return value
}
/**
 * 获得Event事件的Dataset
 */
function getEventDataset(e) {
  // debugLog('getDataset.e',e)
  let dataset1
  let dataset2
  try {
    dataset1 = e.target.dataset
  } catch (e) { }
  try {
    dataset2 = e.currentTarget.dataset
  } catch (e) { }
  // debugLog('Object.keys(dataset1).length', Object.keys(dataset1).length)
  if (Object.keys(dataset1).length < 1) {
    // debugLog('Object.keys(dataset2)', e.currentTarget.dataset)
    return e.currentTarget.dataset
  } else {
    // debugLog('Object.keys(dataset1)', Object.keys(dataset1))
    return e.target.dataset
  }
}

function runCallback(callback) {
  if (callback && typeof callback == 'function') {
    return callback
  } else {
    return () => {
      debugLog('I am a null fuction')
    }
  }
}

function loadPagesData(callback, pTimeout){
  let timeout = 500
  if (typeof pTimeout == 'number'){
    timeout = pTimeout
  }
  let pageIdx = 0
  let loadTimer = setInterval(() => {
    if (pageIdx < 100) {
      runCallback(callback)(pageIdx, loadTimer)
      pageIdx++
    } else {
      clearInterval(loadTimer)
    }
  }, timeout)
}

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  resetStatus: resetStatus,
  cloneObj: cloneObj,
  pickerMaker: pickerMaker,
  getUserInfo: getUserInfo,
  setUserInfo: setUserInfo,
  extractFileInfo: extractFileInfo,
  genOrderNo: genOrderNo,
  getEventDataset: getEventDataset,
  getEventDetailValue: getEventDetailValue,
  runCallback: runCallback,
  loadPagesData: loadPagesData,
}
