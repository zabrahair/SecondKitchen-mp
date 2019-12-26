// pages/editMealCombo/editMealCombo.js
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
const orderApi = require('../../api/order.js')

const NEW_COMBO = {
  name: '',
  price: '',
  companyId: '',
  companyName: '',
  menuId: '',
  dishes: [{
    name: '大荤',
    enName: 'meat',
    price: 15,
    options: new Array()
  },
  {
    name: '小荤',
    enName: 'meat-vege-1',
    price: 9,
    options: new Array()
  },
  {
    name: '小荤',
    enName: 'meat-vege-2',
    price: 9,
    options: new Array()
  }],
  menuId: '',
}


Page({

  /**
   * 页面的初始数据
   */
  data: {
    total_price: 10000,
    combo: null,
    comboId: '',
    isShownDishSelector: false,
    curDishEnName: '',
    curDishIdx: '',
    operation: gConst.OPERATION.UPDATE
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    let comboId = options.comboId

    if(comboId != undefined && comboId != ''){
      // update combo
      let userInfo = utils.getUserInfo(globalData)
      this.setData({
        comboId: comboId,
        userInfo: userInfo
      })
      // // debugLog('editMealCombo', this.data)

      dbApi.query(
        TABLES.COMBO
        , { _id: comboId }
        , res => {
          let combo = res[0]
          // // debugLog('dbApi.query', combo)
          that.setData({
            combo: combo,
          })
        })
    } else{
      // create new combo
      that.setData({
        combo: NEW_COMBO,
        operation: gConst.OPERATION.INSERT
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
   * 关闭DishSelector
   */
  closeDishSelector: function(e){
    // // debugLog('closeDishSelector.event', e)
    this.setData({
      isShownDishSelector: false
    })
  },

  /**
   * 点击增加Option
   */
  addNewOption: function(e){
    // debugLog('addNewOption.event', e);
    let detail = e.detail
    // debugLog('addNewOption.detail', detail);
    let addDishOption = detail.dishOption
    let dishIdx = detail.dishIdx
    let dishEnName = detail.dishEnName
    let combo = this.data.combo
    combo.dishes[dishIdx].options.splice(0, 0, addDishOption)
    this.setData({
      combo: combo,
      isShownDishSelector: false,
    })

  },

  /**
   * 点击添加Option按钮
   */
  onClickAddOption: function(e){
    // // debugLog('onClickAddOption.event', e)
    let dataset = e.currentTarget.dataset
    // debugLog('onClickAddOption.dataset', dataset)
    this.setData({
      curDishEnName: dataset.dishEnName,
      curDishIdx: dataset.dishIdx,
      isShownDishSelector: true

    })
  },

  /**
   * 删除选项
   */
  onRemoveOption: function(e){
    let dataset = e.currentTarget.dataset
    // debugLog('onRemoveOption.dataset', dataset)
    let combo = this.data.combo
    let dishIdx = dataset.dishIdx
    let optionIdx = dataset.optionIdx
    combo.dishes[dishIdx].options.splice(optionIdx,1)
    this.setData({
      combo: combo
    })
  },

  /**
   * 保存套餐选项
   */
  onSaveCombo: function(e){
    // debugLog('onSaveCombo', e)
    let comboId = this.data.comboId
    let combo = this.data.combo
    delete combo._id

    if(this.data.operation == gConst.OPERATION.UPDATE){
      wx.cloud.callFunction({
        name: 'updateCombo',
        data: {
          comboId: comboId,
          combo: combo
        },
        success: res => {
          // debugLog('updateCombo.success.res', res)
          wx.showToast({
            title: '套餐更新成功',
            duration: 1500,
          })
          wx.navigateBack({
            delta: 1
          })
        },
        fail: err => {
          wx.showToast({
            title: '套餐更新失败',
            duration: 1500,
          })
          console.error('[云函数]调用失败：', err)
        }
      })
    }else if(this.data.operation == gConst.OPERATION.INSERT){
      wx.cloud.callFunction({
        name: 'createCombo',
        data: {
          combo: combo
        },
        success: res => {
          debugLog('createCombo.success.res', res)
          wx.showToast({
            title: '套餐插入成功',
            duration: 1500,
          })
          wx.navigateBack({
            delta: 1
          })
        },
        fail: err => {
          wx.showToast({
            title: '套餐插入失败',
            duration: 1500,
          })
          console.error('[云函数] 调用失败：', err)
        }
      })
    }

  },
  /**
   * 套餐名称发生变化
   */
  onTitleChange: function(e){
    // debugLog('onTitleChange.e', e)
    let comboName = e.detail.value
    let combo = this.data.combo
    combo.name = comboName
    this.setData({
      combo: combo
    }) 


  },
  
  /**
   * 删除当前Combno
   */
  onDeleteCombo: function(e){
    let that = this
    wx.cloud.callFunction({
      name: 'removeCombo',
      data: {
        comboId: that.data.comboId
      },
      success: res => {
        debugLog('removeCombo.success.res', res)
        wx.showToast({
          title: '套餐删除成功',
          duration: 1500,
        })
        wx.navigateBack({
          delta: 1
        })
      },
      fail: err => {
        wx.showToast({
          title: '套餐删除失败',
        })
        console.error('[云函数] 调用失败：', err)
      }
    })
  },

  /**
   * 当套餐价格发生变化
   */
  onPriceChange: function(e){
    // debugLog('onPriceChange.e', e)
    let comboPrice = e.detail.value
    let combo = this.data.combo
    combo.price = comboPrice
    this.setData({
      combo: combo
    }) 
  }
})