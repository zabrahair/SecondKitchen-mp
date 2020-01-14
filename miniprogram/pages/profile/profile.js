// pages/profile/profile.js
const app = getApp()
const globalData = app.globalData

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
    userInfo: utils.getUserInfo(globalData),
    userRole: utils.getUserInfo(globalData).userRole,
    USER_ROLE: USER_ROLE
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = utils.getUserInfo(globalData)
    if (userInfo || userINfo.openId) {
      return
    }
    this.setData({
      userInfo: utils.getUserInfo(globalData),
      userRole: utils.getUserInfo(globalData).userRole,
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    let userInfo = utils.getUserInfo(globalData)
    if (userInfo || userINfo.openId) {
      return
    }
    this.setData({
      userInfo: utils.getUserInfo(globalData),
      userRole: utils.getUserInfo(globalData).userRole,
    })
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
   * 
   */
  onChangeProfile: function(e){

    wx.navigateTo({
      url: '../../pages/register/register',
    })
  },

  /**
   * 跳转到统计页面
   */
  onClickStatistic: function(e) {

    wx.navigateTo({
      url: '../../pages/statistics/statistics',
    })
  },

  onClickDishEdit: function(e){

    wx.navigateTo({
      url: '../../pages/dishes/dishes',
    })    
  },

  onClickMenuEdit: function (e) {

    wx.navigateTo({
      url: '../../pages/menuList/menuList',
    })
  }
})