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

module.exports = {
  UNSELECT: UNSELECT,
  SELECTED: SELECTED,
  storageKeys: storageKeys,
  userInfoObj: userInfoObj,
  pageParams: pageParams,
  maxOrdersPerDay: 10,
  orderStatus: orderStatus
}