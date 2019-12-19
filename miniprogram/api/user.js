const debugLog = require('../utils/log.js').debug;
const errorLog = require('../utils/log.js').error;
const gConst = require('../const/global.js');
const storeKeys = require('../const/global.js').storageKeys;
const utils = require('../utils/util.js');
const COLLECTIONS = require('../const/collections.js');

const queryUser = function (filters, callback) {
  const db = wx.cloud.database()
  // 根据条件查询所有用户
  db.collection(COLLECTIONS.USER).where(filters).get({
    success: res => {
      let result = res.data;
      debugLog('user', result);
      callback(result)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      errorLog('[数据库USER] [查询记录] 失败：', err)
    }
  })
}

const createUser = function (insertData, callback) {
  const db = wx.cloud.database()
  insertData = Object.assign(insertData, {
    _id: insertData.openId
  })
  let now = new Date();
  let nowTimeString = now.toString();
  let nowTimestamp = Date.parse(now)
  Object.assign(insertData, {
    createTimestamp: nowTimestamp,
    createLocalTime: nowTimeString
  })  
  debugLog('insertData', insertData)
  // 根据条件插入所有用户
  db.collection(COLLECTIONS.USER).add({
    data: insertData,
    success: res => {
      let result = res;
      debugLog('【插入结果】user', result);
      callback(result)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '插入记录失败'
      })
      errorLog('[数据库USER] [插入记录] 失败：', err)
    }
  })
}

const updateUser = function (id, updateObj, callback) {
  const db = wx.cloud.database()
  let now = new Date();
  let nowTimeString = now.toString();
  let nowTimestamp = Date.parse(now)
  Object.assign(updateObj, {
    updateTimestamp: nowTimestamp,
    updateLocalTime: nowTimeString
  })
  delete updateObj._id
  debugLog('id', id)
  debugLog('updateObj', updateObj)
  // 根据条件更新所有用户
  db.collection(COLLECTIONS.USER).doc(id).update({
    data: updateObj,
    success: res => {
      let result = res;
      debugLog('user', result);
      callback(result)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '更新记录失败'
      })
      errorLog('[数据库USER] [更新记录] 失败：', err)
    }
  })
}

module.exports = {
  queryUser: queryUser,
  createUser: createUser,
  updateUser: updateUser,
}