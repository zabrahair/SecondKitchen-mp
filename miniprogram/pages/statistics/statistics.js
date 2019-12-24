// pages/statistics/statistics.js
const MSG = require('../../const/message.js')
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const USER_ROLE = require('../../const/userRole.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');
const TABLES = require('../../const/collections.js')


const dbApi = require('../../api/db.js')
const orderApi = require('../../api/order.js')
const companyApi = require('../../api/company.js')
const db = wx.cloud.database()
const $ = db.command.aggregate
const _ = db.command

const startDate = new Date("2019-10-01")
const endDate = new Date("2030-10-01")

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    startDate: utils.formatDate(startDate),
    endDate: utils.formatDate(endDate),
    tabStatus: {
      SUMMARY: 'unselected',
      ORDERS: 'selected',
      DISHES: 'unselected'
    },
    orders: [],
    countDishes: [],
    companiesPickerObj: {},
    companiesPicker: [],
    selectCompanyIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  refreshStatistics: function(){
    // Clear last data
    debugLog('endDate', this.data.startDate)
    debugLog('endDate', this.data.endDate)
    this.setData({
      orders: [],
      countDishes: []
    })

    // Company Picker List Get
    let userRole = this.data.userInfo.userRole
    if (userRole != USER_ROLE.ADMIN) {
      let companyName = this.data.userInfo.companyName
      let companiesPicker = new Array(1);
      companiesPicker[0] = companyName
      debugLog('companiesPicker', companiesPicker)
      this.setData({
        companiesPicker: companiesPicker
      })
    }else{
      companyApi.query({}, res => {
        let companiesPickerAllInfo = utils.pickerMaker(res, 'name')
        // debugLog('companiesPickerAllInfo', companiesPickerAllInfo)
        this.setData({
          companiesPickerObj: companiesPickerAllInfo.pickerObjs,
          companiesPicker: companiesPickerAllInfo.pickerList
        })
      })
    }

    let whereFilters = {
      shipDateString: _.and(_.gt(this.data.startDate), _.lt(this.data.endDate))
    }


    // debugLog('whereFilters-1', whereFilters)
    let curCompany = this.data.companiesPicker[this.data.selectCompanyIndex]
    if (curCompany != gConst.ALL_COMPANIES){
      whereFilters['companyName'] = curCompany
    }
    // debugLog('whereFilters-2', whereFilters)

    // Order List 
    orderApi.query(whereFilters, res => {
      // debugLog('orders', res)
      let orders = res
      this.setData({
        orders: orders
      })
    })

    // Dishes Count aggregate
    orderApi.countDishes(whereFilters, res => {
      // debugLog('countDishes', res)
      let countDishes = res.list
      this.setData({
        countDishes: countDishes
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
    this.setData({
      userInfo: wx.getStorageSync(storeKeys.userInfo),
    })
    this.refreshStatistics();
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
    debugLog('event', event);
    debugLog('data', data);
    let tabName = event.target.dataset.tabName;
    utils.resetStatus(this.data.tabStatus, tabName, gConst.UNSELECT, gConst.SELECTED)
    this.setData({
      tabStatus: this.data.tabStatus
    })
  },

  onOrdersCompanyChange: function (e) {
    this.setData({
      selectCompanyIndex: e.detail.value
    })
    this.refreshStatistics()
  },

  selStartDate: function(e){
    let startDate = e.detail.value;
    if (startDate <= this.data.endDate){
      this.setData({
        startDate: e.detail.value
      })
      this.refreshStatistics()
    } else {
      wx.showToast({
        title: '时间不合理',
        icon: 'success',
        duration: 1500
      })
    }

  },

  selEndDate: function (e) {
    let endDate = e.detail.value;
    if (this.data.startDate <= endDate) {
      this.setData({
        endDate: e.detail.value
      })
      this.refreshStatistics()
    }else{
      wx.showToast({
        title: '时间不合理',
        icon: 'success',
        duration: 1500
      })
    }
  },
})