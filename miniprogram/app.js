//app.js
const debugLog = require('./utils/log.js').debug;
const errorLog = require('./utils/log.js').error;
const gConst = require('./const/global.js');
const storeKeys = require('./const/global.js').storageKeys;
const utils = require('./utils/util.js');

const USER_ROLE = require('./const/userRole.js')
const userApi = require('./api/user');

App({
  onLaunch: function () {
    
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        // env 参数说明：
        //   env 参数决定接下来小程序发起的云开发调用（wx.cloud.xxx）会默认请求到哪个云环境的资源
        //   此处请填入环境 ID, 环境 ID 可打开云控制台查看
        //   如不填则使用默认环境（第一个创建的环境）
        // env: 'my-env-id',
        traceUser: true,
      })
    }

    this.globalData = {
      
    }
    // this.login();
  },

  login: function(){
    var that = this;
    var userInfo = {};
    var hasUserInfo = false;
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          // 在没有 open-type=getUserInfo 版本的兼容处理
          wx.getUserInfo({
            success: res => {
              userInfo = res.userInfo;
              hasUserInfo = true;
              that.globalData['userInfo'] = userInfo
              that.globalData['hasUserInfo'] = true
              wx.setStorageSync('userInfo', userInfo)
              // 登陆当前用户
              // 调用云函数
              wx.cloud.callFunction({
                name: 'login',
                data: {},
                success: res => {
                  // debugLog('', res)
                  // debugLog('[云函数] [login] user openid: ', res.result.openid)
                  that.globalData['openId'] = res.result.openid
                  let userInfo = that.globalData['userInfo'];
                  userInfo['openId'] = res.result.openid;
                  userInfo['appId'] = res.result.appid;

                  userApi.queryUser({
                    _id: userInfo.openId
                  }, result => {
                    debugLog('result',result)
                    if (result.length >= 0) {
                      wx.setStorageSync('userInfo', result[0])
                      that.globalData['userInfo'] = result[0]
                    } else {
                      wx.setStorageSync('userInfo', userInfo)
                      that.globalData['userInfo'] = userInfo
                    }
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
})
