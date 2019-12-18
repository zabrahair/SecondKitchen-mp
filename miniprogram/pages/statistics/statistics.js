// pages/statistics/statistics.js
const util = require('../../utils/util');
const debug = require('../../utils/log').debug;
const constant = require('../../const/global.js');
const orders = require('../../mockupData/orders.js').orders
const companies = require('../../mockupData/company.js').companies;
const companiesPicker = require('../../mockupData/company.js').companiesPicker



Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: {
      SUMMARY: 'unselected',
      ORDERS: 'selected',
      DISHES: 'unselected'
    },
    orders: orders,
    companiesPicker: companiesPicker,
    selectCompanyIndex: 0,
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
   * 点击Tab标签
   */
  onClickTab: function (event, data){
    let tabName = event.target.dataset.tabName;
    util.resetStatus(this.data.status, tabName, constant.UNSELECT, constant.SELECTED)
    this.setData({
      status: this.data.status
    })
  },

  onOrdersCompanyChange: function (e) {
    
    this.setData({
      selectCompanyIndex: e.detail.value
    })
  },
})