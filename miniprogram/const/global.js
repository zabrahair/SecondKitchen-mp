const UNSELECT = 'unselected';
const SELECTED = 'selected';
const storageKeys = {
  userInfo: 'userInfo'
}
const userInfoObj = {
  userRole: '',
  realName: '',
  userMobile: '',
  openId: '',
  appId: '',
}

const pageParams = {
  userRole: 'userRole',
}

const orderStatus = {
  FINISHED: '完成',
  ORDERED: '已下单',
  SHIPPING: '配送中'
}

const valueCSS = {
  CORRECT: 'value_correct',
  INCORRECT: 'value_incorrect'
}

const OPERATION = {
  INSERT: 'INSERT',
  UPDATE: 'UPDATE',
  SELECT: 'SELECT',
  DELETE: 'DELETE'
}

const EMPTY_DISH = {
  name: '',
  category: '',
  imageUrl: '',
  price: null,
}

const WEEK_DAYS = [
  { en: 'Sunday', abbr: 'Sun', cn: '周日'},
  { en: 'Monday', abbr: 'Mon', cn: '周一' },
  { en: 'Tuesday', abbr: 'Tue', cn: '周二' },
  { en: 'Wednesday', abbr: 'Wed', cn: '周三' },
  { en: 'Thursday', abbr: 'Thu', cn: '周四' },
  { en: 'Friday', abbr: 'Fri', cn: '周五' },
  { en: 'Saturday', abbr: 'Sat', cn: '周六' },
]

module.exports = {
  UNSELECT: UNSELECT,
  SELECTED: SELECTED,
  storageKeys: storageKeys,
  userInfoObj: userInfoObj,
  pageParams: pageParams,
  maxOrdersPerDay: 1,
  orderStatus: orderStatus,
  ALL_COMPANIES: '所有企业',
  valueCSS: valueCSS,
  OPERATION: OPERATION,
  EMPTY_DISH: EMPTY_DISH,
  NO_COMPANY_ID: 'NO_COMPANY_ID',
  NO_COMPANY_NAME: '临时订饭',
  WEEK_DAYS: WEEK_DAYS
}