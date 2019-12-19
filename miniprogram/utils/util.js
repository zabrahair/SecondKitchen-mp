const debug = require('log.js').debug;

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
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
  debug(object);
  debug(setValue);
  for(let i in object){
    if(i == key){
      object[i] = setValue;
    }else{
      object[i] = defaultValue;
    }
    
  }
  debug(object);
}

const cloneObj = function(source, target){
  return Object.assign(target, source);
}

module.exports = {
  formatTime: formatTime,
  resetStatus: resetStatus,
  cloneObj: cloneObj
}
