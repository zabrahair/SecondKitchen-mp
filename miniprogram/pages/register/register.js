// pages/register/register.js
const app = getApp()
const globalData = app.globalData

const MSG = require('../../const/message.js')
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');
const TABLES = require('../../const/collections.js')


const dbApi = require('../../api/db.js')
const companyApi = require('../../api/company.js')
const db = wx.cloud.database()
const $ = db.command.aggregate
const _ = db.command

const USER_ROLE = require('../../const/userRole.js')
const userApi = require('../../api/user');


Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    userRole: USER_ROLE.NORMAL,
    phoneNumber: '',
    companiesPickerObj: {},
    companiesPicker: [],
    selectCompanyIndex: 0,
    isValueCorrect: gConst.valueCSS.CORRECT,
    contactName: '',
    isVertified: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let userInfo = utils.getUserInfo(globalData)
    debugLog('globalData.userInfo', userInfo);
    this.setData({ userInfo: userInfo })
    
    debugLog('this.data.userInfo', this.data.userInfo)
    
    // debugLog('options', options)
    this.setData({
      userRole: options.userRole
    });
    this.setData({
      contactName: this.data.userInfo.nickName
    })

    // Company Picker List Get
    companyApi.query({}, res => {
      let companiesPickerAllInfo = utils.pickerMaker(res, 'name')
      // debugLog('companiesPickerAllInfo', companiesPickerAllInfo)
      this.setData({
        companiesPickerObj: companiesPickerAllInfo.pickerObjs,
        companiesPicker: companiesPickerAllInfo.pickerList
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
   * 点击注册后创建用户
   */
  onRegister: function(e){
    // debugLog('event', e);
    let that = this
    // Show form values
    let formValues = e.detail.value
    // debugLog('onRegister.formValue', formValues);
    var userInfo = utils.getUserInfo(globalData)
    // debugLog('userInfo', userInfo)
    formValues['userRole'] = that.data.userRole
    Object.assign(userInfo, formValues)
    delete userInfo['_openid']
    globalData.userInfo = userInfo
    wx.setStorageSync('userInfo', userInfo)
    this.setData({
      userInfo: userInfo
    })
    // debugLog('userInfo', userInfo)

    let companyName = this.data.companiesPicker[this.data.selectCompanyIndex];
    let companyId = this.data.companiesPickerObj[companyName]._id


    this.vertifyCompany(companyName, formValues.companyVertify, res => {
      delete formValues['companyVertify']
      if (res.isVertified == true) {
        // debugLog('openId', userInfo.openId)
        formValues['companyName'] = res.vertifiedCompany.name
        formValues['companyId'] = res.vertifiedCompany._id
        formValues['userRole'] = res.userRole
        Object.assign(userInfo, formValues)
        utils.setUserInfo(userInfo, globalData)
        // create or update user
        userApi.queryUser({
          _id: userInfo.openid
        }, result => {
          // debugLog('queryUserResult', result)
          // If not found the user insert a new one.
          if (result.length <= 0) {
            userInfo = utils.getUserInfo(globalData);
            userInfo['_id'] = userInfo.openid
            userInfo['companyName'] = formValues['companyName']
            userInfo['companyId'] = formValues['companyId']
            userInfo['userRole'] = formValues['userRole']
            // debugLog('create a new user', userInfo)
            userApi.createUser(userInfo, result => {
              // debugLog('insertResult', result)
              utils.setUserInfo(userInfo, globalData)
              wx.switchTab({
                url: '../menuList/menuList'
              })
            })
          } else {
            userInfo = result[0]
            // else updat the user info with login time
            // debugLog('else updat the user info with login time','')
            // debugLog('updateUser', formValues)
            userApi.updateUser(userInfo._id,
              formValues,
              result => {
                // debugLog('updateResult', result)
                // globalData.userInfo = userInfo
                // wx.setStorageSync(storeKeys.userInfo, userInfo)
                wx.switchTab({
                  url: '../menuList/menuList'
                })
              })
          }

          // set storage
          let userInfo = globalData[storeKeys.userInfo]
          userInfo['userRole'] = that.data.userRole
          userInfo['companyName'] = formValues['companyName']
          userInfo['companyId'] = formValues['companyId']
          userInfo['contactName'] = formValues['contactName']
          userInfo['contactMobile'] = formValues['contactMobile']
          globalData[storeKeys.userInfo] = userInfo

        })
      }else{
        wx.showToast({
          icon: 'none',
          title: '验证码不正确'
        })
        return
      }
    })
  },

  /**
   * Reset Form
   */
  formReset: function(){

  },

  /**
   * Get phone number from weixin
   */
  getPhoneNumber: function(e){
    // debugLog('event', e);
    let cloudId = e.detail.cloudID
    let that = this
       
    wx.cloud.callFunction({
      name: 'getPhoneNumber',
      data: {
        phoneNumber: wx.cloud.CloudID(cloudId), 
        obj: {
          shareInfo: wx.cloud.CloudID(cloudId), 
        }
      }
      ,success: res => {
        // debugLog('getPhoneNumber', res)
        that.setData({
          phoneNumber: res.result.phoneNumber
        })

      },
      fail: err => {
        // console.error('[云函数] [login] 调用失败', err)
      }
    })    
  },

  /**
   * Select company
   */
  onCompanyChange: function (e) {
    this.setData({
      selectCompanyIndex: e.detail.value
    })
  },

  vertifyCompany: function(companyName, vertifyCode, callback){
    let that = this
    // let companyId = this.data.companiesPickerObj[companyName]._id
    // debugLog('companyName', companyName)
    // debugLog('vertifyCode', vertifyCode)
    // debugLog('companyId', companyId)
    // debugLog('userRole', that.data.userRole)
    wx.cloud.callFunction({
      name: 'companyVertify',
      data: {
        // companyId: companyId,
        vertifyCode: vertifyCode,
        // userRole: that.data.userRole
      }
      ,success: res => {
        debugLog('companyVertify', res)
        that.setData({
          isVertified: res.result.isVertified,
          vertifiedCompany: res.result.vertifiedCompany
        })
        callback(res.result)
      }
      ,fail: err => {

      }
    })
  },

  formReset: function () {
    console.log('form发生了reset事件')
  },
})