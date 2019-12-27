const cloud = require('wx-server-sdk')
cloud.init({
  env: 'second-kitchen-backend'
})

const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
const DISH_TABLE = 'dish'

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let filters = event.filters
  console.log('event', JSON.stringify(event, null, 4))
  try {
    let result = await db.collection(DISH_TABLE).where(filters).get()
    console.log('queryDishResult:', JSON.stringify(result, null, 4))
    return result;
  } catch (e) {
    console.error(e)
  }
}