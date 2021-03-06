// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'laiqiafanfan-z3fxt'
})

const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
const TABLE = 'order'

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  let shipDateString = event.shipDateStr
  let companyName = event.companyName
  console.log('event', JSON.stringify(event, null, 4))
  try {
    let result = await db.collection(TABLE)
      .aggregate()
      .match({
        companyName: companyName,
        shipDateString: shipDateString,
      })
      .group({
        _id: {
          companyName: companyName,
          shipDateString: shipDateString,
        },
        count: $.sum(1)
      })
      .project({
        _id: 1,
        count: 1,
      })
      .end()

    console.log(companyName + ".当日订单数", JSON.stringify(result, null, 4))
    return result;
  } catch (e) {
    console.error(e)
  }
}