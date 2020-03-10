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
 * GetPayCorrectSample：
 * {
    "errMsg": "cloud.callFunction:ok",
    "result": {
        "appid": "wxb6de73fb93817fbb",
        "nonce_str": "xxlnf9xwye",
        "timeStamp": "1583809780",
        "prepay_id": "wx101109410671191e16b4fb7e1552257600",
        "paySign": "2DA2A6B5D7F65BE1653320AF609E7632"
    },
    "requestID": "949f48d3-627c-11ea-8756-52540054168a"
}
 */
function toPay(orderObj, callback){
  let totalFee = parseFloat(orderObj.price).toFixed(2) * 100
  debugLog('totalFee', totalFee)
  let detail = makePaymentOneComboDetail(orderObj, 1)
  let body = makePaymentBody(orderObj)
  wx.cloud.callFunction({
    name: 'GetPay',
    data: {
      totalFee: totalFee,
      orderNo: orderObj.orderNo,
      detail: detail,
      body: body
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
        let orderIsPaid = true
        utils.runCallback(callback)(orderIsPaid)
        debugLog('requestPayment.success', res)
      },
      fail: err => {
        let orderIsPaid = false
        utils.runCallback(callback)(orderIsPaid)
        errorLog('requestPayment.fail', res)
        console.log(res)
      },
      complete: sth => {

      }
    })
  })
}

/**
 * 生成支付对象的Body字段
 */
function makePaymentBody(orderObj){
  let body = ''
  let bodyStr = orderObj.companyName + '-' + orderObj.comboName 
  return bodyStr
}

/**
 * 生成支付对象的Detail字段
 */
function makePaymentOneComboDetail(orderObj, quantity){
  let template = {
    "cost_price": 0, //分为单位
    "receipt_id": "", // 小票的id
    "goods_detail": [ //注意goods_detail字段的格式为"goods_detail":[{}],较多商户写成"goods_detail":{}
    ]
  }
  let goodDetailTemplate = {
    "goods_id": "", //由半角的大小写字母、数字、中划线、下划线中的一种或几种组成
    // "wxpay_goods_id": "1001", //微信支付定义的统一商品编号（没有可不传）
    "goods_name": "",
    "quantity": 0,
    "price": 528800
  }

  let detail  = Object.assign({}, template)
  let total_fee = parseFloat(orderObj.price).toFixed(2) * 100
  detail.cost_price = total_fee

  let goodDetail = Object.assign({}, goodDetailTemplate)
  goodDetail.goods_id = orderObj.comboId
  goodDetail.goods_name = orderObj.companyName + '-' + orderObj.comboName + '-' + orderObj.realName
  goodDetail.quantity = quantity
  goodDetail.price = total_fee
  debugLog('goodDetail', goodDetail)
  detail.goods_detail.push(goodDetail)
  debugLog('detail', detail)

  let detailStr = JSON.stringify(detail)
  // detailStr = '<![CDATA[' + detailStr + ']]>'
  debugLog('makePaymentOneComboDetail.detail\n', detailStr)
  return detailStr
}

module.exports = {
  toPay: toPay
}