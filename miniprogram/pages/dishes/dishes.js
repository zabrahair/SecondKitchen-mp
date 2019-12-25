// pages/dishes/dishes.js
const app = getApp()
const globalData = app.globalData

const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const dishApi = require('../../api/dish.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dishes: null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    dishApi.queryDishes({}, result=>{
      debugLog('Dish Page onLoad', JSON.stringify(result), 2);
      that.setData({
        dishes: result
      })
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

  }
})