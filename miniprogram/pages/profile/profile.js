// pages/profile/profile.js
const MSG = require('../../const/message.js')
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const USER_ROLE = require('../../const/userRole.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');
const TABLES = require('../../const/collections.js')


const dbApi = require('../../api/db.js')
const companyApi = require('../../api/company.js')
const db = wx.cloud.database()
const $ = db.command.aggregate
const _ = db.command

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userRole: null,
    USER_ROLE: USER_ROLE
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.setData({
      userInfo: wx.getStorageSync(storeKeys.userInfo),
      userRole: wx.getStorageSync(storeKeys.userInfo).userRole,
    })
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
   * 
   */
  onChangeProfile: function(e){
    let userInfo = wx.getStorageSync(storeKeys.userInfo)
    let userRole = userInfo.userRole
    wx.navigateTo({
      url: '../../pages/register/register?userRole=' + userRole,
    })
  },

  /**
   * 跳转到统计页面
   */
  onClickStatistic: function(e) {
    let userInfo = wx.getStorageSync(storeKeys.userInfo)
    let userRole = userInfo.userRole
    wx.navigateTo({
      url: '../../pages/statistics/statistics',
    })
  }
})