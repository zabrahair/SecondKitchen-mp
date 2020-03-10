// pages/selectMealCombo/selectMealCombo.js
const app = getApp()
const globalData = app.globalData

const MSG = require('../../const/message.js')
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');
const payment = require('../../utils/payment.js')
const TABLES = require('../../const/collections.js')

const USER_ROLE = require('../../const/userRole.js')
const dbApi = require('../../api/db.js')
const orderApi = require('../../api/order.js')
const companyApi = require('../../api/company.js')
const defaultShipDate = new Date()
defaultShipDate.setDate(defaultShipDate.getDate() + 0)

Page({

  /**
   * 页面的初始数据
   */
  data: {
    shipDate: utils.formatDate(defaultShipDate),
    combo: null,
    companyType: null,
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
    startDate: utils.formatDate(new Date()),
    userInfo: null,
    userRole: USER_ROLE.NORMAL,
    weekDayCn: new Date().getDay(),
    insistSelectWeekend: 0,
    isProcessOrder: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    // debugLog('options', options)
    // debugLog('defaultShipDate', defaultShipDate)
    this.checkWeekEnd(defaultShipDate);
    // debugLog('weekDayCn', this.data.weekDayCn)
    let comboId = options.comboId
    let userInfo = utils.getUserInfo(globalData)
    that.setDefaultDate(that, ()=>{
      that.setData({
        userInfo: userInfo,
        userRole: userInfo.userRole,
        weekDayCn: that.data.weekDayCn,
        insistSelectWeekend: 0,
      })
      dbApi.query(
        TABLES.COMBO
        , { _id: comboId }
        , 0
        , res => {
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
          orderObj.realName = userInfo.contactName ? userInfo.contactName : userInfo.nickName
          orderObj.companyId = userInfo.companyId ? userInfo.companyId : ''
          orderObj.companyName = userInfo.companyName ? userInfo.companyName : ''
          orderObj.price = combo.price
          // orderObj.shipDate = defaultShipDate.getTime()
          // orderObj.shipDateString = utils.formatDate(new Date(defaultShipDate))
          that.setData({
            combo: combo,
            orderObj: orderObj
          })
        })
    })

  },

  setDefaultDate: function(that, callback){
    let userInfo = utils.getUserInfo(globalData)
    let innerDefaultShipDate = defaultShipDate
    let orderObj = that.data.orderObj
    try{
      companyApi.getCompanyType({_id:userInfo.companyId}, companyType=>{
        // debugLog('companyType', companyType)
        that.setData({
          companyType: companyType
        })
        if (companyType == USER_ROLE.RESTAURANT) {
          innerDefaultShipDate = new Date()
          // 如果希望默认时间是当前，就把1改成0
          innerDefaultShipDate.setDate(innerDefaultShipDate.getDate() + 0)
          if (that.data.orderObj) {
            orderObj.shipDate = innerDefaultShipDate.getTime()
            orderObj.shipDateString = utils.formatDate(innerDefaultShipDate)
          }
          that.checkWeekEnd(innerDefaultShipDate)
          that.setData({
            orderObj: orderObj,
            shipDate: utils.formatDate(innerDefaultShipDate),
            shipDateString: utils.formatDate(innerDefaultShipDate),
          }, () => {
            callback()
          })

        }
      })

    } catch (err) { errorLog('setDefaultDate.err', err.stack)}
    finally{
      that.checkWeekEnd(innerDefaultShipDate)
      that.setData({
        shipDate: utils.formatDate(innerDefaultShipDate),
        shipDateString: utils.formatDate(innerDefaultShipDate),
      }, () => {
        callback()
      })
    }
  },

  /**
   * 当送餐日期发生变化
   */
  selShipDate: function(e){
    let shipDate = utils.getEventDetailValue(e)
    shipDate = new Date(shipDate);
    // 如果是周末，加到周一
    shipDate = this.checkWeekEnd(shipDate)

    let weekDayCn = gConst.WEEK_DAYS[shipDate.getDay()].cn;
    let shipDateString = utils.formatDate(shipDate)
    let defaultShipDateStr = utils.formatDate(defaultShipDate)
    // debugLog('shipDate', shipDateString)
    // debugLog('defaultShipDate', defaultShipDateStr)
    if (shipDateString < defaultShipDateStr && that.data){
      wx.showToast({
        title: MSG.DATE_SELECTED_NOT_CORRECT,
        icon: 'success',
        duration: 1500,
      })
      return 
    }

    let orderObj = this.data.orderObj
    orderObj.shipDate = shipDate.getTime()
    orderObj.shipDateString = shipDateString
    this.setData({
      shipDate: utils.formatDate(shipDate),
      orderObj: orderObj,
      weekDayCn: weekDayCn,
    })

  },

  checkWeekEnd: function (pShipDate){
    let swiftDays = 0
    let shipDate = pShipDate
    try{
      // debugLog('typeof(shipDate)', Object.prototype.toString.call(shipDate));
      if (Object.prototype.toString.call(shipDate) != '[object Date]') {
        // debugLog('shipDate', shipDate)
        shipDate = new Date(pShipDate);
      }
      // debugLog('typeof(shipDate)', shipDate.getDay())
      // Sunday swift to Monday,如果用户坚持选了两次周末就让他选吧。
      if (shipDate.getDay() == 0 && this.data.insistSelectWeekend < 1) {
        wx.showToast({
          title: MSG.ONLY_WEEKDAY_CAN_ORDER,
          icon: 'success',
          duration: 1500,
        })
        swiftDays = 1
        shipDate.setDate(shipDate.getDate() + swiftDays)
        this.setData({
          insistSelectWeekend: this.data.insistSelectWeekend + 1
        })
      }
      // Saturday swift to Monday，如果用户坚持选了两次周末就让他选吧。
      if (shipDate.getDay() == 6 && this.data.insistSelectWeekend < 1) {
        wx.showToast({
          title: MSG.ONLY_WEEKDAY_CAN_ORDER,
          icon: 'success',
          duration: 1500,
        })
        swiftDays = 2
        shipDate.setDate(shipDate.getDate() + swiftDays)
        this.setData({
          insistSelectWeekend: this.data.insistSelectWeekend + 1
        })
      }
      // debugLog('shipDate.getDay()', gConst.WEEK_DAYS[shipDate.getDay()]);
      this.setData({
        shipDate: shipDate,
        weekDayCn: gConst.WEEK_DAYS[shipDate.getDay()].cn,
        shipDateString: utils.formatDate(shipDate),
      })
      return shipDate
    }catch(e){
      return ''
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
    that.setDefaultDate(that, ()=>{
      that.setData({
        userInfo: userInfo,
        insistSelectWeekend: 0,
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
   * 当选择Dish的Option的时候
   */
  onDishSelect: function(event){
    // debugLog('onDishSelect.event', event)
    let dishIdx = event.target.dataset.dishIdx
    let optionIdx = event.detail.value
    // debugLog('dishIdx', dishIdx)
    // debugLog('optionIdx', optionIdx)
    let orderObj = this.data.orderObj
    orderObj.dishes[dishIdx] = this.data.combo.dishes[dishIdx].options[optionIdx]
    this.setData({
      orderObj: orderObj
    })
    // debugLog('orderObj', orderObj)
  },

  /**
   * 订单生成中
   */
  generatingOrder: function(){
    let that = this
    wx.showLoading({
      title: '订单生成中',
    })
    that.setData({
      isProcessOrder: true,
    })
  },

  /**
   * 订单生成完成
   */
  finishGenOrder: function(){
    let that = this
    wx.hideLoading()
    that.setData({
      isProcessOrder: false,
    })
  },

  /**
   * 发送订单
   */
  onSendOrder: function(event){
    debugLog('onSendOrder start')
    let that = this
    // 开始生成订单，关闭按钮再按
    that.generatingOrder()
    setTimeout(() => {
      that.finishGenOrder()
    }, 10000)

    // 如果没有登陆
    let userInfo = utils.getUserInfo(globalData)
    if (userInfo == undefined || userInfo.openId == undefined) {
      wx.showToast({
        title: MSG.REGISTER_AND_ORDER,
        icon: 'success',
        duration: 1500,
      })
      wx.redirectTo({
        url: '/pages/index/index',
      })
      that.finishGenOrder()
      return
    }

    // 检查订单完整性
    // debugLog('event', event)
    let orderObj = that.data.orderObj
    let dishes = orderObj.dishes
    // debugLog('dishes', dishes)
    let userRole = that.data.userInfo.userRole
    that.setData({
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
        that.finishGenOrder()
        that.setData({
          isOrderFinished: false
        })
      }
    }

    // 根据金额判断支付是否需要
    try{
      // 生成订单号
      // debugLog('orderObj',orderObj)
      utils.genOrderNoDT(orderObj.companyName, utils.formatTime(new Date()), orderNo => {
        // debugLog('genOrderNoDT', orderNo)
        orderObj.orderNo = orderNo
        if (that.data.isOrderFinished) {
          let price = parseFloat(orderObj.price)
          if(price > 0){
        //    如果需要
            // debugLog('orderObj', orderObj)
            payment.toPay(orderObj, orderIsPaid => {
              debugLog('orderIsPaid', orderIsPaid)

              if(orderIsPaid){
        //      支付成功的情况
                wx.showToast({
                  title: MSG.ORDER_PAYMENT_SUCCESS,
                  icon: 'success',
                  duration: 1500,
                })
                that.generateOrder(that, orderObj, (res, createdOrder)=>{
                  debugLog('generateOrder.res', res)

                })
              }else{
        //      支付失败的情况
                wx.showToast({
                  title: MSG.ORDER_PAYMENT_FAILED,
                  icon: 'none',
                  duration: 1500,
                })
              }

            })
          }else{
        //    如果不需要
            that.generateOrder(that, orderObj, (res, createdOrder) => {
              debugLog('generateOrder.res', res)

            })
          }
        }
      })
    }catch(err ){
      errorLog('onSendOrder.err', err.stack)
    }

    
  },

  /**
   * 生成订单号码
   */
  generateOrder: function (that, orderObj, callback){
    // 计算已经下单的数量，如果超量就不下单了。
    // debugLog('orderObj.shipDateString', orderObj.shipDateString)
    orderApi.countUserOrdered({
      _openid: that.data.userInfo._openid,
      shipDateString: orderObj.shipDateString
    }, count => {
      // debugLog('check order per day', count)
      if (count < gConst.maxOrdersPerDay
        || userRole == USER_ROLE.ADMIN
        || userRole == USER_ROLE.COMPANY
        || userRole == USER_ROLE.RESTAURANT) {
        // debugLog('create.orderObj', orderObj)
        dbApi.create(TABLES.ORDER, orderObj, res => {
          // debugLog('res', res)
          utils.runCallback(callback)(res, orderObj)
          wx.switchTab({
            url: '../orders/orders',
          })

        })
      } else {
        that.finishGenOrder()
        utils.runCallback(callback)(null, null)
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