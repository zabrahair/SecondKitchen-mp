// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'laiqiafanfan-z3fxt'
})

const db = cloud.database()
const $ = db.command.aggregate
const _ = db.command
const COMPANY_TABLE = 'company'
const USER_ROLE = {
  ADMIN: 'ADMIN',
  NORMAL: 'NORMAL',
  COMPANY: 'COMPANY',
  RESTAURANT: 'RESTAURANT'
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log('event', JSON.stringify(event, null, 4))
  let result = null;
  let userRole = ''
  let vertifiedCompany = null
  try {
    // Normal User Vertify
    console.log('Normal User Vertify')
    result = await db.collection(COMPANY_TABLE).where({
      // _id: event.companyId,
      userVertify: event.vertifyCode
    }).get()

    if (result && result.data && result.data.length && result.data.length > 0){
      userRole = 'NORMAL'
      vertifiedCompany = result.data[0]

    }else{
      // Company User Vertify
      console.log('Company User Vertify')
      result = await db.collection(COMPANY_TABLE).where({
        // _id: event.companyId,
        companyVertify: event.vertifyCode
      }).get()
      if (result && result.data && result.data.length && result.data.length > 0){
        userRole = result.data[0].type
        vertifiedCompany = result.data[0]
      }
    }

    
    console.log('result', JSON.stringify(result, null, 4))
    if(result && result.data && result.data.length && result.data.length > 0){
      return {
        isVertified: true,
        userRole: userRole,
        vertifiedCompany: vertifiedCompany
      }
    }else{
      return {
        isVertified: false,
        userRole: '',
        vertifiedCompany: ''
      }
    }

  }catch(e){
    console.log('error', JSON.stringify(e, null, 4))
  }



}