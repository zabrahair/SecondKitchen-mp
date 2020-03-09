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

  try {
    let result = await db.collection(TABLE)
      .aggregate()
      .match({
        isRemoved: _.exists(false)
      })
      .group({
        _id: {
          companyName: companyName,
          createLocalDate: $.substr([createLocalTime, 0, 9]),
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