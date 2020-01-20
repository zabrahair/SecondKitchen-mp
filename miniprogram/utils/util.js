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
    userInfo = globalData.userInfo;
  }else{
    userInfo = wx.getStorageSync('userInfo')
  }

  return userInfo
}

const setUserInfo = function (userInfo, globalData) {
  globalData.userInfo = userInfo
  wx.setStorageSync('userInfo', userInfo)
  debugLog('setUserInfo', wx.getStorageSync('userInfo'))
}

const extractFileInfo = function(filePath){
  debugLog('extractFileInfo.filePath', filePath)
  let fileInfo = {
    path: filePath,
    directory: '',
    filename: '',
    fileMajorName: '',
    fileExtension: ''
  }
  let regex = new RegExp("(.+/)(([^/]+)(\\.[^.]+))","gim")
  let regexGroups = regex.exec(filePath)
  debugLog('extractFileInfo.regexGroups', regexGroups)
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
  debugLog('extractFileInfo.fileInfo', fileInfo)
  return fileInfo
  
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
}
