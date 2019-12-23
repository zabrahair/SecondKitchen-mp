const debugLog = require('../utils/log.js').debug;
const errorLog = require('../utils/log.js').error;
const gConst = require('../const/global.js');
const storeKeys = require('../const/global.js').storageKeys;
const utils = require('../utils/util.js');
const TABLES = require('../const/collections.js');
const db = wx.cloud.database()
const $ = db.command.aggregate
const _ = db.command

const query = function (table, filters, callback) {
  
  // 根据条件查询所有Records
  db.collection(table).where(filters).get({
    success: res => {
      let result = res.data;
      // debugLog('[数据库' + table + '][查询记录]', result);
      callback(result)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      errorLog('[数据库' + table + '][查询记录] 失败：', err)
    }
  })
}

const create = function (table, insertData, callback) {
  insertData = Object.assign(insertData, {
    _id: insertData.openId
  })
  let now = new Date();
  let nowTimeString = utils.formatTime(now);

  Object.assign(insertData, {
    createTimestamp: now.getTime(),
    createLocalTime: nowTimeString
  })
  // debugLog('insertData', insertData)
  // 根据条件插入所有Records
  db.collection(table).add({
    data: insertData,
    success: res => {
      let result = res;
      // debugLog('[数据库' + table + '][插入记录]成功', result);
      callback(result)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '插入记录失败'
      })
      errorLog('[数据库' + table + '][插入记录]失败', err)
    }
  })
}

const update = function (table, id, updateObj, callback) {
  let now = new Date();
  let nowTimeString = utils.formatTime(now);
  
  Object.assign(updateObj, {
    updateTimestamp: now.getTime(),
    updateLocalTime: nowTimeString
  })
  delete updateObj._id
  // debugLog('id', id)
  // debugLog('updateObj', updateObj)
  // 根据条件更新所有Records
  db.collection(table).doc(id).update({
    data: updateObj,
    success: res => {
      let result = res;
      // debugLog('[数据库' + table + '][更新记录]成功', result);
      callback(result)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '更新记录失败'
      })
      errorLog('[数据库' + table + '][更新记录]失败', err)
    }
  })
}

const groupCount = function(table, matchObj, unwindObj, groupObj, projectObj, callback){
  db.collection('order')
    .aggregate()
    .match(matchObj)
    .unwind(unwindObj)
    .group(groupObj)
    .project(projectObj)
    .end().then(res=>{
      callback(res)
    })  
}

module.exports = {
  query: query,
  create: create,
  update: update,
  groupCount: groupCount,
}