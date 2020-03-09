const app = getApp()
const globalData = app.globalData

const debugLog = require('../utils/log.js').debug;
const errorLog = require('../utils/log.js').error;
const gConst = require('../const/global.js');
const storeKeys = require('../const/global.js').storageKeys;
const utils = require('../utils/util.js');
const TABLES = require('../const/collections.js')
const USER_ROLE = require('../const/userRole.js')
const dbApi = require('../api/db.js')

/**
 * 支付函数
 */
function toPay(that, amount, callback){
  let totalFee = parseFloat(amount).toFixed(2) * 100
  debugLog('totalFee', totalFee)
  wx.cloud.callFunction({
    name: 'GetPay',
    data: {
      totalFee: totalFee,
      attach: 'anything',
      body: 'whatever'
    }
  })
  .then(res => {
    debugLog('toPay', res)
    wx.requestPayment({
      appId: res.result.appid,
      timeStamp: res.result.timeStamp,
      nonceStr: res.result.nonce_str,
      package: 'prepay_id=' + res.result.prepay_id,
      signType: 'MD5',
      paySign: res.result.paySign,
      success: res => {
        console.log(res)
      },
      fail: err => {
      },
      complete: sth => {
      }
    })
  })
}

module.exports = {
  toPay: toPay
}