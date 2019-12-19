// pages/register/register.js
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');

const USER_ROLE = require('../../const/userRole.js')
const userApi = require('../../api/user');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userRole: USER_ROLE.NORMAL,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    debugLog('options', options)
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  /**
   * 点击注册后创建用户
   */
  onRegister: function(e){
    let that = this
    // Show form values
    let formValues = e.detail.value
    // debugLog('onRegister.formValue', e.detail.value);
    let userInfo = wx.getStorageSync(storeKeys.userInfo)
    // debugLog('userInfo', userInfo)
    formValues['userRole'] = that.data.userRole
    Object.assign(userInfo, formValues)
    wx.setStorageSync(storeKeys.userInfo, userInfo)
    // debugLog('userInfo', userInfo)

    userApi.queryUser({
      _id: userInfo.openId
    }, result=>{
      // debugLog('queryUserResult', result)
      // If not found the user insert a new one.
      if(result.length <= 0){
        userApi.createUser(userInfo, result => {
          debugLog('insertResult', result)
          wx.switchTab({
            url: '../menuList/menuList'
          })
        })
      } else {
        userInfo = result[0]
        // else updat the user info with login time
        // debugLog('else updat the user info with login time','')
        userApi.updateUser(userInfo._id, 
          formValues,
          result => {
          // debugLog('updateResult', result)
            // wx.setStorageSync(storeKeys.userInfo, userInfo)
            wx.switchTab({
              url: '../menuList/menuList'
            })
        })
      }

    })
    
  },

  /**
   * Reset Form
   */
  formReset: function(){

  },

  /**
   * Get phone number from weixin
   */
  getPhoneNumber: function(e){
    debugLog('event', e);

       
    wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        weRunData: wx.cloud.CloudID('xxx'), // 这个 CloudID 值到云函数端会被替换
        obj: {
          shareInfo: wx.cloud.CloudID('yyy'), // 非顶层字段的 CloudID 不会被替换，会原样字符串展示
        }
      }
    })    
  }

})