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
const orderApi = require('../../api/order.js')

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
    pageIdx: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    this.refreshOrders(0);
    // debugLog('new date();',JSON.stringify(new Date()))
  },
  /**
   * 刷新订单内容
   */
  refreshOrders: function(pageIdx, callback){
    let that = this

    if (pageIdx == 0) {
      that.setData({
        orders: [],
        countDishes: []
      })
    }

    let userInfo = utils.getUserInfo(globalData)
    if ( userInfo == undefined || userInfo.openId == undefined) {
      return
    }
    // debugLog('Running... refreshOrders', {
    //   startDate: this.data.startDate,
    //   endDate: this.data.endDate,
    //   userInfo: userInfo._openid})
    
    dbApi.query(TABLES.ORDER,
      {
        _openid: userInfo._openid ? userInfo._openid : userInfo.openId,
        createLocalTime: _.gte(that.data.startDate),
        createLocalTime: _.lte(that.data.endDate),
        isRemoved: _.or([_.exists(false),false]),
      }
      , pageIdx
      , res => {
        // debugLog('res', res)
        if(res.length>0){
          that.setData({
            orders: res
          }, () => {
            utils.runCallback(callback)(true)
          })
        }

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
    this.refreshOrders(0);
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
    debugLog('onPullDownRefresh', 'refresh')
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this
    debugLog('onReachBottom', 'refresh')
    let pageIdx = that.data.pageIdx + 1
    that.refreshOrders(pageIdx, isLoaded => {
      if (isLoaded) {
        that.setData({
          pageIdx: pageIdx
        })
      }
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },

  selStartDate: function(e){
    let that = this
    debugLog('event',e)
    let startDate = new Date(e.detail.value)
    that.setData({
      startDate: utils.formatDate(startDate)
    })
    that.refreshOrders(0);
  },

  selEndDate: function(e){
    let that = this
    // debugLog('event', e)
    let endDate = new Date(e.detail.value)
    this.setData({
      endDate: utils.formatDate(endDate)
    })
    this.refreshOrders();

  },

  removeOrder: function(e){
    let that = this
    let dataset = utils.getEventDataset(e)
    let orderId = dataset.orderId
    orderApi.removeOrder(orderId, res=>{
      that.refreshOrders(0)
    })
  }

})