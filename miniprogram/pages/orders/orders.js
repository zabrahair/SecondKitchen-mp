// pages/orders/orders.js
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

const startDate = new Date("2019-10-01")
const endDate = new Date("2030-10-01")
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
    let userInfo = wx.getStorageSync(storeKeys.userInfo)
    dbApi.query(TABLES.ORDER,
      {
        userId: userInfo._id ? userInfo._id : userInfo.openId,
        shipDate: _.gt(new Date(this.data.startDate).getTime()),
        shipDate: _.lt(new Date(this.data.endDate).getTime())
      }
      , res => {
        // debugLog('res', res)
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