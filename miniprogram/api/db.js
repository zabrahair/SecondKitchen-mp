const debugLog = require('../utils/log.js').debug;
const errorLog = require('../utils/log.js').error;
const gConst = require('../const/global.js');
const storeKeys = require('../const/global.js').storageKeys;
const utils = require('../utils/util.js');
const TABLES = require('../const/collections.js');
const MSG = require('../const/message.js');
const db = wx.cloud.database()
const $ = db.command.aggregate
const _ = db.command

const query = function (table, filters, pPageIdx, callback) {
  let pageIdx = 0
  if (typeof pPageIdx == 'function'){
    callback = pPageIdx
  }
  if (pPageIdx && typeof pPageIdx != 'function'){
    pageIdx = pPageIdx
  }else{
    pageIdx = 0
  }
  let countOfPage = 20
  // 根据条件查询所有Records
  db.collection(table)
  .where(filters)
  .skip(pageIdx * countOfPage)
  .limit(countOfPage)
  .get({
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

const remove = function (table, id, callback) {
  debugLog('id', id)
  wx.showModal({
    title: MSG.REMOVE_CONFIRM_TITLE,
    content: MSG.REMOVE_CONFIRM_MESSAGE,
    success(res) {
      if (res.confirm) {
        debugLog('用户点击确定')
        // 根据条件删除所有Records
        db.collection(table).doc(id).remove({
          success: res => {
            let result = res;
            // debugLog('[数据库' + table + '][更新记录]成功', result);
            callback(result)
          },
          fail: err => {
            wx.showToast({
              icon: 'none',
              title: '删除记录失败'
            })
            errorLog('[数据库' + table + '][删除记录]失败', err)
            callback(result)
          }
        })
      } else if (res.cancel) {
        errorLog('用户点击取消')
      }
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

const groupCount = function(table, matchObj, unwindObj
  , groupObj, projectObj, pPageIdx, callback){
  let pageIdx = 0
  if (pPageIdx) {
    pageIdx = pPageIdx
  } else {
    pageIdx = 0
  }
  let countOfPage = 20

  db.collection(table)
    .aggregate()
    .match(matchObj)
    .unwind(unwindObj)
    .group(groupObj)
    .project(projectObj)
    .skip(countOfPage*pageIdx)
    .limit(countOfPage)
    .end()
    .then(res=>{
      callback(res)
    })  
}

module.exports = {
  query: query,
  create: create,
  update: update,
  groupCount: groupCount,
  remove: remove,
}