// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'laiqiafanfan-z3fxt'
})
const rp = require('request-promise')
const crypto = require('crypto')

// 商家基本参数
// 这是商户的key，不是小程序的密钥，32位。
const key = "uVWllQf5sqvPO1oWEooK8Nnwu9A6ZSAu"
// 商户号
const mch_id = "1578592251" 


function paysign({ ...args }) {
  let sa = []
  for (let k in args) sa.push(k + '=' + args[k])
  sa.push('key=' + key)
  console.log('sign', JSON.stringify(sa.join('&'), null, 4))
  return crypto.createHash('md5')
    .update(sa.join('&'), 'utf8')
    .digest('hex').toUpperCase()
}



exports.main = async (event, context) => {
  console.log('event', JSON.stringify(event, null, 4))
  const appid = event.userInfo.appId
  const openid = event.userInfo.openId
  const attach = event.attach
  const body = event.body
  const detail = event.detail
  const total_fee = event.totalFee
  const notify_url = "https://www.teekstore.com/qiafanfan_search.php"

  const spbill_create_ip = "47.111.86.25"
  const nonce_str = Math.random().toString(36).substr(2, 15)
  const timeStamp = parseInt(Date.now() / 1000) + ''
  const out_trade_no = event.orderNo

  let formData = "<xml>"
  formData += "<appid>" + appid + "</appid>"
  formData += "<body>" + body + "</body>"
  formData += "<detail>" + detail + "</detail>"
  formData += "<mch_id>" + mch_id + "</mch_id>"
  formData += "<nonce_str>" + nonce_str + "</nonce_str>"
  formData += "<notify_url>" + notify_url + "</notify_url>"
  formData += "<openid>" + openid + "</openid>"
  formData += "<out_trade_no>" + out_trade_no + "</out_trade_no>"
  formData += "<spbill_create_ip>" + spbill_create_ip + "</spbill_create_ip>"
  formData += "<total_fee>" + total_fee + "</total_fee>"
  formData += "<trade_type>JSAPI</trade_type>"
  formData += "<sign>" + paysign({ appid, body, detail, mch_id, nonce_str, notify_url, openid, out_trade_no, spbill_create_ip, total_fee, trade_type: 'JSAPI' }) + "</sign>"
  formData += "</xml>"

  console.log('formData', formData)
  let res = await rp({ url: "https://api.mch.weixin.qq.com/pay/unifiedorder", method: 'POST', body: formData })
  let xml = res.toString("utf-8")
  if (xml.indexOf('prepay_id') < 0) return xml
  let prepay_id = xml.split("<prepay_id>")[1].split("</prepay_id>")[0].split('[')[2].split(']')[0]
  let paySign = paysign({ appId: appid, nonceStr: nonce_str, package: ('prepay_id=' + prepay_id), signType: 'MD5', timeStamp: timeStamp })
  return { appid, nonce_str, timeStamp, prepay_id, paySign }

}