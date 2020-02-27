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
// DB Related
const db = wx.cloud.database()
const $ = db.command.aggregate
const _ = db.command

var categoriesFilter = ['全部']
categoriesFilter = categoriesFilter.concat(gConst.DISH_CATEGORIES)
categoriesFilter.push('其他')

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
    dishes: [],
    categoriesFilter: categoriesFilter, 
    curFilterCategory: categoriesFilter[0],
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
  refreshDishes: function(){

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
    let filters = {}
    if (that.data.curFilterCategory == '全部'){
      
    } else if (that.data.curFilterCategory == '其他'){
      filters['category'] = _.or(gConst.DISH_CATEGORIES)
    } else {
      filters['category'] = that.data.curFilterCategory
    }
    // debugLog('onShow.filters', filters)
    utils.loadPagesData((pageIdx, loadTimer)=>{
      dishApi.queryDishes(filters, pageIdx, result => {
        // debugLog('refresh dishes count', result.length);
        if (result.length > 0) {
          let dishes = that.data.dishes ? that.data.dishes : []
          that.setData({
            dishes: dishes.concat(result)
          })
        } else {
          clearInterval(loadTimer)
        }
      })
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
   * on click add dish button
   */
  onAddDish: function(e){
    this.setData({
      curDishId: '',
      isShownDishEditor: true,
      operatorType: gConst.OPERATION.INSERT,
      curDish: gConst.EMPTY_DISH,
    })
  },

  /**
   * on click edit dish button
   */
  onEditDish: function(e){
    // debugLog('onEditDish.e', e)
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
  onDishUpdate: function(e){
    // debugLog('onDishUpdate', e)
    this.onShow();
    this.setData({
      isShownDishEditor: false
    })
  },

  /**
 * Create Dish
 */
  onDishCreate: function (e) {
    // debugLog('onDishCreate', e)
    this.onShow();
    this.setData({
      isShownDishEditor: false
    })
  },

  /**
   * Delete Dish
   */
  onDishDelete: function (e) {
    // debugLog('onDishDelete', e)
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

  /**
   * add select category in exists categories
   */
  selectCategory: function (e) {
    let that = this
    // debugLog('selectCategory.e', e)
    let dish = this.data.dish
    let category = categoriesFilter[e.detail.value]
    that.setData({
      curFilterCategory: category
    }, res => {
      that.onShow()
    })
  },
})