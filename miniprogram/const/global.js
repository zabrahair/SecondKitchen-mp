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
  FINISHED: 'finished',
  ORDERED: 'ordered',
  SHIPPING: 'shipping'
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

module.exports = {
  UNSELECT: UNSELECT,
  SELECTED: SELECTED,
  storageKeys: storageKeys,
  userInfoObj: userInfoObj,
  pageParams: pageParams,
  maxOrdersPerDay: 10,
  orderStatus: orderStatus,
  ALL_COMPANIES: '所有企业',
  valueCSS: valueCSS,
  OPERATION: OPERATION,
  EMPTY_DISH: EMPTY_DISH
}