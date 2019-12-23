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

const formatDate = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/')
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

module.exports = {
  formatTime: formatTime,
  formatDate: formatDate,
  resetStatus: resetStatus,
  cloneObj: cloneObj,
  pickerMaker: pickerMaker
}
