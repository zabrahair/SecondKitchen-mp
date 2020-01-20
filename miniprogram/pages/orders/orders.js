// pages/orders/orders.js
const app = getApp()
const globalData = app.globalData

const MSG = require('../../const/message.js')
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');
const TABLES = require('../../const/collections.js')
const db = wx.cloud.database()
const _ = db.command

const USER_ROLE = require('../../const/userRole.js')
const dbApi = require('../../api/db.js')

const startDate = new Date()
const endDate = new Date()
endDate.setDate(new Date().getDate() + 1)

Page({
  /**
   * 页面的初始数据
   */
  data: {
    startDate: utils.formatDate(startDate),
    endDate: utils.formatDate(endDate),
    orders: null,
    userInfo: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.refreshOrders();
    // debugLog('new date();',JSON.stringify(new Date()))
  },
  /**
   * 刷新订单内容
   */
  refreshOrders: function(){
    let userInfo = utils.getUserInfo(globalData)
    if ( userInfo == undefined || userInfo.openId == undefined) {
      return
    }
    debugLog('Running... refreshOrders', {
      startDate: this.data.startDate,
      endDate: this.data.endDate,
      userInfo: userInfo._openid})
    
    dbApi.query(TABLES.ORDER,
      {
        _openid: userInfo._openid ? userInfo._openid : userInfo.openId,
        shipDateString: _.gte(this.data.startDate),
        shipDateString: _.lte(this.data.endDate)
      }
      , res => {
        debugLog('res', res)
        this.setData({
          orders: res
        })
        // debugLog('date', new Date(res[0].shipDate))
      })
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
    let that = this
    this.refreshOrders();
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

  selStartDate: function(e){
    debugLog('event',e)
    let startDate = new Date(e.detail.value)
    this.setData({
      startDate: utils.formatDate(startDate)
    })
    this.refreshOrders();
  },

  selEndDate: function(e){
    debugLog('event', e)
    let endDate = new Date(e.detail.value)
    this.setData({
      endDate: utils.formatDate(endDate)
    })
    this.refreshOrders();

  }

})