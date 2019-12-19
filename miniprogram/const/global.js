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

module.exports = {
  UNSELECT: UNSELECT,
  SELECTED: SELECTED,
  storageKeys: storageKeys,
  userInfoObj: userInfoObj,
  pageParams: pageParams,
}