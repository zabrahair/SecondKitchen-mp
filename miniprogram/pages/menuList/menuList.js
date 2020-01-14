// pages/menuList/menuList.js
const app = getApp()
const globalData = app.globalData

const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');
const TABLES = require('../../const/collections.js')

const USER_ROLE = require('../../const/userRole.js')
const dbApi = require('../../api/db.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    combos: null,
    userRole: USER_ROLE,
    userInfo: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let userInfo = utils.getUserInfo(globalData)
    if(userInfo){
      that.setData({
        userInfo: userInfo,
        userRole: userInfo.userRole,
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
    let userInfo = utils.getUserInfo(globalData)
    if(userInfo || userINfo.openId) {
      return
    }
    this.setData({
      userInfo: userInfo,
      userRole: userInfo.userRole,
    })
    let companyId = userInfo.companyId;
    let companyName = userInfo.companyName
    if (companyName == gConst.ALL_COMPANIES){
      dbApi.query(TABLES.COMBO, {
      }, res => {
        // debugLog('res:', res)
        this.setData({
          combos: res
        })
      })
    }else{
      dbApi.query(TABLES.COMBO, {
        companyId: companyId
      }, res => {
        // debugLog('res:', res)
        this.setData({
          combos: res
        })
      })
    }

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

  onClickMenu: function(e){
    let comboId = e.target.dataset.comboId;
    debugLog('comboId', comboId);
    if(this.data.userRole == USER_ROLE.ADMIN){
      if (comboId) {
        wx.navigateTo({
          url: '../editMealCombo/editMealCombo?comboId=' + comboId,
        })
      }
    }else{
      if (comboId) {
        wx.navigateTo({
          url: '../selectMealCombo/selectMealCombo?comboId=' + comboId,
        })
      }
    }
  },

  /**
   * 添加新的菜单
   */
  onAddMenu: function(e){
    wx.navigateTo({
      url: '../../pages/editMealCombo/editMealCombo',
    })
  }
})