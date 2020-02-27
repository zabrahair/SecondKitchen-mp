const debugLog = require('../utils/log.js').debug;
const errorLog = require('../utils/log.js').error;
const gConst = require('../const/global.js');
const storeKeys = require('../const/global.js').storageKeys;
const utils = require('../utils/util.js');
const TABLES = require('../const/collections.js');
const dbApi = require('db.js')
const db = wx.cloud.database()
const $ = db.command.aggregate
const _ = db.command

const query = function (whereFilters, pPageIdx, callback){
  let where = {}
  let pageIdx = 0
  if (typeof pPageIdx == 'function') {
    callback = pPageIdx
  }
  if (pPageIdx && typeof pPageIdx != 'function') {
    pageIdx = pPageIdx
  } else {
    pageIdx = 0
  }
  where = {
    isRemoved: _.or([_.exists(false), false])
  }
  Object.assign(where, whereFilters)
  dbApi.query(TABLES.ORDER, where, pageIdx, callback)
}

const countDishes = function (whereFilters, pPageIdx, callback){
  let where = {}
  let pageIdx = 0
  if (typeof pPageIdx == 'function') {
    callback = pPageIdx
  }
  if (pPageIdx && typeof pPageIdx != 'function') {
    pageIdx = pPageIdx
  } else {
    pageIdx = 0
  }
  Object.assign(where, whereFilters)
  dbApi.groupCount(TABLES.ORDER
    , where
    , '$dishes'
    , {
      _id: {
        _id: '$dishes._id',
        name: '$dishes.name',
        imageUrl: '$dishes.imageUrl',
      },
      count: $.sum(1)
    }
    , {
      _id: 1,
      count: 1
    }
    , pageIdx
    ,callback);
}

const countUserOrdered = function (whereFilters, callback) {
  let where = {
    isRemoved: _.or([_.exists(false), false])
  }
  Object.assign(where, whereFilters)
  dbApi.groupCount(TABLES.ORDER
    , where
    , '$_id'
    , {
      _id: '$_openid',
      count: $.sum(1)
    }
    , {
      _id: 1,
      count: 1
    }
    , res=>{
      debugLog('countUserOrdered.res', res)
      if(res && res.list && res.list.length > 0){
        if (callback && typeof callback == 'function') {
          callback(res.list[0].count)
        }
      }else{
        callback(0)
      }      
    });
}

function removeOrder(orderId, callback){
  dbApi.update(TABLES.ORDER
    , orderId
    ,{
      isRemoved: true
    }
    , res => {
      debugLog('removeOrder.res', res)
      if (res) {
        if (callback && typeof callback == 'function') {
          callback(res)
        }
      } else {
        callback(null)
      }
    });
}
module.exports = {
  countDishes: countDishes,
  query: query,
  countUserOrdered: countUserOrdered,
  removeOrder: removeOrder,

}