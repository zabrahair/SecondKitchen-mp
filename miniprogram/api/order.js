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

const query = function (whereFilters, callback){
  dbApi.query(TABLES.ORDER, whereFilters, callback)
}

const countDishes = function (whereFilters, callback){
  dbApi.groupCount(TABLES.ORDER
    , whereFilters
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
    , callback);
}

module.exports = {
  countDishes: countDishes,
  query: query,
}