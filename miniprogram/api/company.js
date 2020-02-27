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

const query = function (whereObj, pPageIdx, callback) {
  let pageIdx = 0
  if (pPageIdx) {
    pageIdx = pPageIdx
  } else {
    pageIdx = 0
  }
  dbApi.query(TABLES.COMPANY, whereObj, pageIdx, callback)
}

const getCompanyType = function(whereObj, callback){
  query(whereObj, res=>{
    if(res && res.length > 0){
      let companyType = res[0].type
      if (callback && typeof callback == 'function') {
        callback(companyType)
      }
    }else{
      callback(null)
    }

  })
}

module.exports = {
  getCompanyType: getCompanyType,
  query: query,
}