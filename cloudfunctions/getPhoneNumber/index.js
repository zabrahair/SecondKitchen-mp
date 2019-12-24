// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('event', JSON.stringify(event, {}, 4))
  console.log('unionId', JSON.stringify(wxContext.UNIONID, {}, 4))
  return {
    appId: event.userInfo.appId,
    openId: event.userInfo.openId,
    phoneNumber: event.phoneNumber.data.phoneNumber,
    purePhoneNumber: event.phoneNumber.data.purePhoneNumber,
    unionid: wxContext.UNIONID,
  }
}