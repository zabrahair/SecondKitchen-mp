const app = getApp()
const globalData = app.globalData

const MSG = require('../../const/message.js')
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');
const TABLES = require('../../const/collections.js')

const USER_ROLE = require('../../const/userRole.js')
const dbApi = require('../../api/db.js')
const dishApi = require('../../api/dish.js')

/**
 * 成员列表页功能
 * 1. 显示权限下所有的成员。
 * 2. 对成员可以做删除操作。
 * 3. 对成员的部分信息可以编辑（实名）。
 */
Page({

  /**
   * 页面的初始数据
   */
  data: {
    dishes: null,
    isShownDishEditor: false,
    operatorType: gConst.OPERATION.UPDATE,
    curDishId: '',
    curDish: {},

    userInfo: utils.getUserInfo(globalData),
    userRole: utils.getUserInfo(globalData).userRole,
    USER_ROLE: USER_ROLE,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.onShow();
  },

  /**
   * 刷新菜品列表
   */
  refreshDishes: function () {

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
    this.refreshUserInfo()
    
    dishApi.queryDishes({}, result => {
      debugLog('refresh dishes count', result.length);
      that.setData({
        dishes: result
      })
    })
  },

  /**
   * 刷新当前用户信息
   */
  refreshUserInfo: function(){
    let userInfo = utils.getUserInfo(globalData)
    if (userInfo == undefined || userInfo.openId == undefined) {
      return
    }
    this.setData({
      userInfo: utils.getUserInfo(globalData),
      userRole: utils.getUserInfo(globalData).userRole,
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
   * on click edit dish button
   */
  onEditDish: function (e) {
    debugLog('onEditDish.e', e)
    let dishId = e.currentTarget.dataset.dishId
    let dishIdx = e.currentTarget.dataset.dishIdx
    let curDish = this.data.dishes[dishIdx]
    this.setData({
      curDishId: dishId,
      curDish: curDish,
      isShownDishEditor: true,
      operatorType: gConst.OPERATION.UPDATE
    })
  },

  /**
   * Update Dish
   */
  onDishUpdate: function (e) {
    debugLog('onDishUpdate', e)
    this.onShow();
    this.setData({
      isShownDishEditor: false
    })
  },

  /**
 * Create Dish
 */
  onDishCreate: function (e) {
    debugLog('onDishCreate', e)
    this.onShow();
    this.setData({
      isShownDishEditor: false
    })
  },

  /**
   * Delete Dish
   */
  onDishDelete: function (e) {
    debugLog('onDishDelete', e)
    this.onShow();
    this.setData({
      isShownDishEditor: false
    })
  },

  /**
   * Close Dish Editor
   */
  closeDishEditor: function (e) {
    // debugLog('closeDishEditor.event', e)
    this.setData({
      isShownDishEditor: false
    })
  },
})