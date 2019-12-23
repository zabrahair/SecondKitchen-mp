// pages/selectMealCombo/selectMealCombo.js
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
const defaultShipDate = new Date()
defaultShipDate.setDate(defaultShipDate.getDate()+1)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shipDate: utils.formatDate(defaultShipDate),
    combo: null,
    orderObj: {
      "comboId": "",
      "comboName": "振瀚A套餐",
      "userId": "",
      "companyName": "振瀚信息",
      "companyId": "",
      "realName": "王祖权",
      "shipDate": defaultShipDate.getTime(),
      "shipDateString": utils.formatDate(defaultShipDate),
      "dishes": [
        
      ],  
      "status": gConst.orderStatus.ORDERED 
    },
    isOrderFinished: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let comboId = options.comboId
    let userInfo = wx.getStorageSync(storeKeys.userInfo)


    dbApi.query(
      TABLES.COMBO
      , {_id: comboId}
      , res=>{
        let combo = res[0]
        // debugLog('combo', res)
        let dishesCnt = res[0].dishes.length
        // debugLog('dishesCnt', dishesCnt)
        let orderObj = this.data.orderObj
        // debugLog('orderObj', orderObj)
        orderObj.dishes = new Array(dishesCnt)
        orderObj.comboId = combo._id
        orderObj.comboName = combo.name
        orderObj.userId = userInfo._id ? userInfo._id : userInfo.openId
        orderObj.realName = userInfo.realName ? userInfo.realName : userInfo.nickName
        orderObj.companyId = userInfo.companyId ? userInfo.companyId : ''
        orderObj.companyName = userInfo.companyName ? userInfo.companyName : ''
        orderObj.price = combo.price
        orderObj.shipDate = defaultShipDate.getTime()
        orderObj.shipDateString = utils.formatDate(new Date(defaultShipDate))
        this.setData({
          combo: combo,
          orderObj: orderObj
        })
    })
  },

  /**
   * 当送餐日期发生变化
   */
  selShipDate: function(e){
    let shipDate = e.detail.value
    shipDate = new Date(shipDate);
    let orderObj = this.data.orderObj
    orderObj.shipDate = shipDate.getTime()
    orderObj.shipDateString = utils.formatDate(new Date(shipDate))
    this.setData({
      shipDate: utils.formatDate(shipDate),
      orderObj: orderObj
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
   * 当选择Dish的Option的时候
   */
  onDishSelect: function(event){
    debugLog('onDishSelect.event', event)
    let dishIdx = event.target.dataset.dishIdx
    let optionIdx = event.detail.value
    debugLog('dishIdx', dishIdx)
    debugLog('optionIdx', optionIdx)
    let orderObj = this.data.orderObj
    orderObj.dishes[dishIdx] = this.data.combo.dishes[dishIdx].options[optionIdx]
    this.setData({
      orderObj: orderObj
    })
    debugLog('orderObj', orderObj)

  },

  /**
   * 发送订单
   */
  onSendOrder: function(event){
    // debugLog('event', event)
    let orderObj = this.data.orderObj
    let dishes = orderObj.dishes
    // debugLog('dishes', dishes)
    this.setData({
      isOrderFinished: true
    })
    for(let i = 0; i < dishes.length; i++){
      // debugLog('dish', dishes[i])
      if (!dishes[i]){
        wx.showToast({
          title: MSG.COMBO_NOT_SELECT_ALL,
          icon: 'success',
          duration: 1500,
        })
        this.setData({
          isOrderFinished: false
        })
      }
    }

    if(this.data.isOrderFinished){
      debugLog('orderObj', orderObj)
      dbApi.query(TABLES.ORDER, {
        userId: orderObj.userId,
        shipDateString: orderObj.shipDateString
      }, res=>{
        debugLog('check order per day', res)
        if(res.length < gConst.maxOrdersPerDay){
          dbApi.create(TABLES.ORDER, this.data.orderObj, res => {
            debugLog('res', res)
            wx.switchTab({
              url: '../orders/orders',
            })
          })
        }else{
          wx.showToast({
            title: MSG.REACH_MAX_ORDERS_PER_ORDER,
            icon: 'success',
            duration: 1500,
          })
          this.setData({
            isOrderFinished: false
          })          
        }
      })
    }

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
})