// pages/statistics/statistics.js
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
const orderApi = require('../../api/order.js')
const companyApi = require('../../api/company.js')
const db = wx.cloud.database()
const $ = db.command.aggregate
const _ = db.command

var startDate = new Date()
var endDate = new Date()
endDate.setDate(new Date().getDate() + 1)

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
    userInfo: null,
    pageIdx: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let userInfo = utils.getUserInfo(globalData)
    this.setData({
      userInfo: userInfo
    })
    that.fetchCompanys()
  },

  /**
   * 获取公司列表
   */
  fetchCompanys: function(callback){
    let that = this
    // Company Picker List Get
    let userRole = that.data.userInfo.userRole
    if (userRole != USER_ROLE.ADMIN) {
      let companyName = that.data.userInfo.companyName
      let companiesPicker = new Array(1);
      companiesPicker[0] = companyName
      debugLog('companiesPicker', companiesPicker)
      that.setData({
        companiesPicker: companiesPicker
      })
    } else {
      that.setData({
        companiesPickerObj: {},
        companiesPicker: [],
      }
      ,()=>{
        utils.loadPagesData((pageIdx, loadTimer) => {
          companyApi.query({}, pageIdx, res => {
            if (res.length > 0) {
              let companiesPickerAllInfo = utils.pickerMaker(res, 'name')
              // debugLog('companiesPickerAllInfo', companiesPickerAllInfo)
              that.setData({
                companiesPickerObj: Object.assign(that.data.companiesPickerObj, companiesPickerAllInfo.pickerObjs),
                companiesPicker: that.data.companiesPicker.concat(companiesPickerAllInfo.pickerList)
              })
            } else {
              clearInterval(loadTimer)
            }
          })
        })
      })


    }
  },

  refreshStatistics: function(pageIdx, callback){
    // debugLog('pageIdx', pageIdx)
    // Clear last data
    // debugLog('startDate', this.data.startDate)
    // debugLog('endDate', this.data.endDate)
    let that = this
    if (pageIdx == 0){
      that.setData({
        orders: [],
        countDishes: []
      })
    }

    let whereFilters = {
      shipDateString: _.and(_.gte(that.data.startDate), _.lte(that.data.endDate)),
      isRemoved: _.or([_.exists(false), false]),
    }

    // debugLog('whereFilters-1', whereFilters)
    let curCompany = that.data.companiesPicker[that.data.selectCompanyIndex]
    if (curCompany != gConst.ALL_COMPANIES){
      whereFilters['companyName'] = curCompany
    }
    // debugLog('whereFilters-2', whereFilters)
    // debugLog('pageIdx', pageIdx)
    if(that.data.tabStatus.ORDERS == 'selected'){
      // Order List 
      orderApi.query(whereFilters, pageIdx, res => {
        // debugLog('orders', res)
        debugLog('orders.length', res.length)
        let orders = res
        if (orders.length>0){
          that.setData({
            orders: that.data.orders.concat(orders)
          }, () => {
            utils.runCallback(callback)(true)
          })
        }
      })
    }


    if (that.data.tabStatus.DISHES == 'selected') {
      // Dishes Count aggregate
      debugLog('whereFilters', whereFilters)
      orderApi.countDishes(whereFilters, pageIdx, res => {
        debugLog('countDishes', res)
        let countDishes = res.list
        if (countDishes.length > 0) {
          that.setData({
            countDishes: that.data.countDishes.concat(countDishes)
          }, () => {
            utils.runCallback(callback)(true)
          })
        }
      })
    }
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
    let userInfo = utils.getUserInfo(globalData)
    this.setData({
      userInfo: userInfo
    })
    that.refreshStatistics(0)
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
    that.refreshStatistics(pageIdx, isLoaded => {
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

  /**
   * 点击Tab标签
   */
  onClickTab: function (event, data){
    // debugLog('event', event);
    // debugLog('data', data);
    let that = this
    let tabName = event.target.dataset.tabName;
    utils.resetStatus(that.data.tabStatus, tabName, gConst.UNSELECT, gConst.SELECTED)
    that.setData({
      tabStatus: that.data.tabStatus
    }, () => {
      that.refreshStatistics(0)
    })
  },

  onOrdersCompanyChange: function (e) {
    let that = this
    that.setData({
      selectCompanyIndex: e.detail.value
    })
    that.refreshStatistics(0)
  },

  selStartDate: function(e){
    let startDate = utils.formatDate(new Date(e.detail.value))
    if (startDate <= this.data.endDate){
      this.setData({
        startDate: startDate
      })
      this.refreshStatistics(0)
    } else {
      wx.showToast({
        title: '时间不合理',
        icon: 'success',
        duration: 1500
      })
    }

  },

  selEndDate: function (e) {
    let endDate = utils.formatDate(new Date(e.detail.value))
    if (this.data.startDate <= endDate) {
      this.setData({
        endDate: endDate
      })
      this.refreshStatistics(0)
    }else{
      wx.showToast({
        title: '时间不合理',
        icon: 'success',
        duration: 1500
      })
    }
  },

  removeOrder: function (e) {
    let that = this
    let dataset = utils.getEventDataset(e)
    let orderId = dataset.orderId
    orderApi.removeOrder(orderId, res => {
      that.refreshOrders()
    })
  }
})