// pages/dishes/dishes.js
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

Page({

  /**
   * 页面的初始数据
   */
  data: {
    dishes: null,
    isShownDishEditor: false,
    operatorType: gConst.OPERATION.UPDATE
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    dishApi.queryDishes({}, result=>{
      // debugLog('Dish Page onLoad', JSON.stringify(result), 2);
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

  },

  /**
   * on click add dish button
   */
  onAddDish: function(e){
    this.setData({
      dishId: '',
      isShownDishEditor: true,
      operatorType: gConst.OPERATION.INSERT
    })
  },

  /**
   * on click edit dish button
   */
  onEditDish: function(e){
    debugLog('onEditDish.e', e)
    let dishId = e.currentTarget.dataset.dishId
    this.setData({
      curDishIdx: dishId,
      isShownDishEditor: true,
      operatorType: gConst.OPERATION.UPDATE
    })
  },

  /**
   * Update Dish
   */
  onDishUpdate: function(e){

  },

  /**
 * Create Dish
 */
  onDishUpdate: function (e) {

  },

  /**
   * Delete Dish
   */
  onDishRemove: function (e) {

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