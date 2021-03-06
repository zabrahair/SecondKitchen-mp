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
    combos: [],
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
    let that = this
    let userInfo = utils.getUserInfo(globalData)
    this.setData({
      userInfo: userInfo,
      userRole: userInfo.userRole,
    })
    let companyId = userInfo.companyId;
    let companyName = userInfo.companyName
    if (userInfo == undefined || userInfo.openId == undefined) {
      companyId = gConst.NO_COMPANY_ID;
      companyName = gConst.NO_COMPANY_NAME;
    }
    that.setData({
      combos: []
    },()=>{
      if (companyName == gConst.ALL_COMPANIES) {
        debugLog('companyName', companyName)
        utils.loadPagesData((pageIdx, loadTimer) => {
          dbApi.query(TABLES.COMBO
            , {}
            , pageIdx
            , res => {
              // debugLog('res', res)
              if (res.length > 0) {
                let combos = that.data.combos ? that.data.combos : []
                this.setData({
                  combos: combos.concat(res)
                })
              } else {
                clearInterval(loadTimer)
              }
            })
        })
      } else {
        debugLog('companyName', companyName)
        utils.loadPagesData((pageIdx, loadTimer) => {
          dbApi.query(TABLES.COMBO
            , {
              companyId: companyId
            }
            , pageIdx
            , res => {
              // debugLog('res', res)
              if (res.length > 0) {
                let combos = that.data.combos ? that.data.combos : []
                this.setData({
                  combos: combos.concat(res)
                })
              } else {
                clearInterval(loadTimer)
              }

            })
        })
      }
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

  onClickMenu: function(e){
    let userInfo = utils.getUserInfo(globalData)
    if (userInfo == undefined || userInfo.openId == undefined) {
      // return
    }
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