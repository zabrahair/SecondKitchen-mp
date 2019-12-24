// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: 'second-kitchen-backend'
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
  if (event.userRole == USER_ROLE.NORMAL){
    // Normal User Vertify
    result = await db.collection(COMPANY_TABLE).where({
      _id: event.companyId,
      userVertify: event.vertifyCode
    }).get()
  } else if (event.userRole == USER_ROLE.ADMIN 
    && event.userRole == USER_ROLE.COMPANY 
    && event.userRole == USER_ROLE.RESTAURANT){
    // Company User Vertify
    result = await db.collection(COMPANY_TABLE).where({
      _id: event.companyId,
      companyVertify: event.vertifyCode
    }).get()
    
  }
  try{
    if(result.data.length && result.data.length > 0){
      return {
        isVertified: true
      }
    }else{
      return {
        isVertified: false
      }
    }

  }catch(e){
    console.log('error', JSON.stringify(e, null, 4))
  }



}