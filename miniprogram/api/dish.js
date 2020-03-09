const debugLog = require('../utils/log.js').debug;
const errorLog = require('../utils/log.js').error;
const TABLES = require('../const/collections.js');

const queryDishes = function(filters, pPageIdx, callback){
  let pageIdx = 0
  if (typeof pPageIdx == 'function') {
    callback = pPageIdx
  }
  if (typeof pPageIdx == 'number') {
    pageIdx = pPageIdx
  } else {
    pageIdx = 0
  }
  wx.cloud.callFunction({
    name: 'queryDish',
    data: {
      filters: filters,
      pageIdx: pageIdx,
    },
    success: res => {
      // debugLog('queryDish.success.res', res)
      // debugLog('queryDish.dishes.count', res.result.data.length)
      callback(res.result.data)
    },
    fail: err => {
      console.error('[云函数] 调用失败：', err)
    }
  })
  // const db = wx.cloud.database()
  // // 根据条件查询所有菜品
  // db.collection(TABLES.DISH).where(filters).get({
  //   success: res => {
  //     let result = res.data;
  //     debugLog('dishes', result, 4);
  //     debugLog('dishes.count', result.length)
  //     callback(result)
  //   },
  //   fail: err => {
  //     wx.showToast({
  //       icon: 'none',
  //       title: '查询记录失败'
  //     })
  //     errorLog('[数据库DISH] [查询记录] 失败：', err)
  //   }
  // })
}

module.exports = {
  queryDishes: queryDishes
}