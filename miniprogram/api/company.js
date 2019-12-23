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

const query = function (whereObj, callback) {
  dbApi.query(TABLES.COMPANY, whereObj, callback)
}

module.exports = {
  query: query
}