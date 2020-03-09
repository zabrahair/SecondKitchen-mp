const cloud = require('wx-server-sdk')
cloud.init({
  env: 'laiqiafanfan-z3fxt'
})

const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
const DISH_TABLE = 'dish'

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let filters = event.filters
  let pPageIdx = event.pageIdx
  let pageIdx = 0
  if (typeof pPageIdx == 'number') {
    pageIdx = pPageIdx
  } else {
    pageIdx = 0
  }
  let countOfPage = 100
  console.log('event', JSON.stringify(event, null, 4))
  try {
    let result = await db
      .collection(DISH_TABLE)
      .skip(pageIdx * countOfPage)
      .limit(countOfPage)
      .where(filters).get()
    console.log('queryDishResult:', JSON.stringify(result, null, 4))
    return result;
  } catch (e) {
    console.error(e)
  }
}