// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'laiqiafanfan-z3fxt'
})

const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
const TABLE = 'user'

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let id = event.id
  console.log('event', JSON.stringify(event, null, 4))
  try {
    let result = await db.collection(TABLE).doc(id).remove()
    console.log('remove user result:', JSON.stringify(result, null, 4))
    return result;
  } catch (e) {
    console.error(e)
  }
}