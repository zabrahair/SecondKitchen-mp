//index.js
//获取应用实例
const app = getApp()
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');

const USER_ROLE = require('../../const/userRole.js')
const userApi = require('../../api/user');

Page({
  data: {
    USER_ROLE: USER_ROLE,
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
    this.checkUserExisted()
  },



  onClickRoleButton: function(e){


  },
  /**
   * 判断用户是否存在于数据库
   */
  checkUserExisted: function () {
    let userInfo = wx.getStorageSync(storeKeys.userInfo)
    userApi.queryUser({
      _id: userInfo.openId
    }, result => {
      // debugLog('queryUserResult', result)
      // If not found the user insert a new one.
      if (result.length <= 0) {
        wx.navigateTo({
          url: '../firstLogin/firstLogin'
        })
      } else {
        userInfo = result[0]
        // else update the user info with login time
        userApi.updateUser(result[0]._id,
          {},
          result => {
            // debugLog('updateResult', result)
            debugLog(storeKeys.userInfo)
            debugLog('', userInfo)
            wx.setStorageSync(storeKeys.userInfo, userInfo)
            wx.switchTab({
              url: '../menuList/menuList'
            })
          })
      }
    })
  },

})
