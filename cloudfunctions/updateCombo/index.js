// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'laiqiafanfan-z3fxt'
})

const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
const COMBO_TABLE = 'combo'

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let id = event.comboId
  let combo = event.combo
  console.log('event', JSON.stringify(event,null,4))
  try {
    let result = await db.collection(COMBO_TABLE).doc(id).update({
      // data 传入需要局部更新的数据
      data: combo
    })
    console.log('updateComboResult:', JSON.stringify(result, null, 4))
    return result;
  } catch (e) {
    console.error(e)
  }
}