//index.js
//获取应用实例
const app = getApp()
const globalData = app.globalData

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
    avatarUrl: ''
  },

  onLoad: function () {
    this.login();
    
  },



  onClickRoleButton: function(e){


  },
  /**
   * 判断用户是否存在于数据库
   */
  checkUserExisted: function () {
    let that = this
    let userInfo = globalData.userInfo
    userApi.queryUser({
      _id: userInfo.openId
    }, result => {
      // debugLog('queryUserResult', result)
      // If not found the user insert a new one.
      if (result.length <= 0) {
        wx.navigateTo({
          url: '../register/register'
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
            globalData.userInfo = userInfo
            wx.setStorageSync('userInfo', userInfo)
            wx.switchTab({
              url: '../menuList/menuList'
            })
          })
      }
    })
  },

  getUserInfo: function (e) {
    var that = this;
    debugLog('auth.event', e.detail)
    let avatarUrl = e.detail.userInfo.avatarUrl
    let userInfo = e.detail.userInfo
    that.setData({
      avatarUrl: avatarUrl
    })
    debugLog('userInfo1', userInfo)
    this.login()
  },

  /**
   * 
   */
  login: function(){
    let that = this
    let userInfo = utils.getUserInfo(globalData)
    this.setData({
      userInfo: userInfo,
      avatarUrl: userInfo.avatarUrl
    })
    wx.getSetting({
      success: res => {
        debugLog('getSetting', res)
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              debugLog('getUserInfo', res)
              userInfo = res.userInfo;
              debugLog('userInfo2', userInfo)
              that.setData({
                userInfo: userInfo
              })
              globalData.userInfo = userInfo
              debugLog('getUserInfo', globalData.userInfo)
              // 登陆当前用户
              // 调用云函数
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                  debugLog('login', res)
                  // debugLog('[云函数] [login] user openid: ', res.result.openid)
                  userInfo['openId'] = res.result.openid
                  userInfo['appId'] = res.result.appid;
                  debugLog('userInfo3', userInfo)
                  that.setData({
                    userInfo: userInfo
                  })
                  userApi.queryUser({
                    _id: userInfo.openId
                  }, result => {
                    debugLog('queryUser', result)
                    debugLog('userInfo4', userInfo)
                    if (result.length > 0) {
                      debugLog('1')
                      app.globalData.userInfo = result[0]
                      wx.setStorageSync('userInfo', result[0])
                      debugLog('2')
                      that.setData({
                        userInfo: result[0]
                      })
                    } else {
                      globalData.userInfo = userInfo
                      wx.setStorageSync('userInfo', userInfo)
                      that.setData({
                        userInfo: userInfo
                      })
                    }
                    debugLog('globalData.userInfo', globalData.userInfo)
                    that.checkUserExisted()
                  })


                },
                fail: err => {
                  // console.error('[云函数] [login] 调用失败', err)
                }
              })
            }
          })

        }
      }
    })
  },

  /**
   * 让用户到处看看
   */
  goRound: function(e){
    wx.switchTab({
      url: '../menuList/menuList'
    })   
  }
})
