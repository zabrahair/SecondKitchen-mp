const debugLog = require('../utils/log.js').debug;
const errorLog = require('../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;

const getRecords = function(collectName, filter, callback){
  const db = wx.cloud.database()
  // 根据条件查询所有菜品
  db.collection(collectName).where(filters).get({
    success: res => {
      let result = res.data;
      debugLog('dishes', result, 4);
      callback(result)
    },
    fail: err => {
      wx.showToast({
        icon: 'none',
        title: '查询记录失败'
      })
      errorLog('[数据库DISH] [查询记录] 失败：', err)
    }
  })
}

module.exports = {
  getRecords: getRecords,
}