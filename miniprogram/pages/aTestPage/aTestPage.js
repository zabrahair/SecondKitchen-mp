const app = getApp()
const globalData = app.globalData

const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');
const payment = require('../../utils/payment.js')
const TABLES = require('../../const/collections.js')
const USER_ROLE = require('../../const/userRole.js')
const dbApi = require('../../api/db.js')

Page({
  /**
   * 页面的初始数据
   */
  data: {

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
   * 点击按钮的事件处理路由
   */
  onTapAction: function(e){
    let that = this
    let value = utils.getEventDetailValue(e)
    let dataset = utils.getEventDataset(e)
    let orderObj = that.getSampleOrder()
    payment.toPay(orderObj, res=>{
      debugLog('toPay', res)
    })
  },

  getSampleOrder: function(){
    let orderObj = {
      "comboId": "309effef-3540-426c-a456-dd696f9fd134",
      "comboName": "测试用不删除",
      "userId": "oJb-B4m9WY4Udq3OvtgRUiWa1EO8",
      "companyName": "振瀚信息",
      "companyId": "14b0baea-4e5e-4857-98e0-8e2b60c76b1e",
      "realName": "弗勒不花",
      "shipDate": 1583812193785,
      "shipDateString": "2020/03/10",
      "dishes": [
        {
          "_id": "1318fb8e-be67-45cc-9343-0869877009b9",
          "category": [
            "大荤"
          ],
          "imageUrl": "https://7365-second-kitchen-backend-1300928495.tcb.qcloud.la/%E7%BE%8E%E6%9E%81%E7%83%A7%E9%B8%AD%E7%BF%85.jpg?sign=10c9a2f29e20dc1acce135d8fe952263&t=1576650692",
          "name": "美极烧鸭翅",
          "price": 15
        },
        {
          "_id": "17e3a0db-378d-423d-b2b2-52cc8f22c84b",
          "category": [
            "小荤",
            "大荤"
          ],
          "imageUrl": "https://7365-second-kitchen-backend-1300928495.tcb.qcloud.la/%E6%89%81%E5%B0%96%E8%80%81%E9%B8%AD%E7%85%B2%EF%BC%8C18.9%E5%85%83.jpeg?sign=4bbaaa530e563d0e5ccd4032d536f46c&t=1576653211",
          "name": "扁尖老鸭煲",
          "price": 18.9
        },
        {
          "_id": "07627f4a-fc08-44b1-a365-150729e44793",
          "category": [
            "小荤"
          ],
          "imageUrl": "https://7365-second-kitchen-backend-1300928495.tcb.qcloud.la/%E9%B1%BC%E9%A6%99%E9%B8%A1%E4%B8%9D.jpg?sign=65abd15f2cd335cd33b014d1db81f2d1&t=1576650341",
          "name": "鱼香鸡丝",
          "price": 9
        },
        {
          "_id": "294f7e6a-4a1c-49a6-b7fe-da0efcd87b42",
          "category": [
            "素菜"
          ],
          "imageUrl": "https://7365-second-kitchen-backend-1300928495.tcb.qcloud.la/%E5%9B%9B%E5%96%9C%E7%83%A4%E9%BA%B8.jpg?sign=57af12be204382f7d50f9662df753461&t=1576650514",
          "name": "四喜烤麸",
          "price": 5
        }
      ],
      "status": "已下单",
      "price": "0.01",
      "orderNo": "202003101150014749"
    }
    return orderObj;
  }
})