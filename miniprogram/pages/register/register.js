// pages/register/register.js
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
    userInfo: wx.getStorageSync(storeKeys.userInfo),
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
    let userInfo = wx.getStorageSync(storeKeys.userInfo)
    // debugLog('userInfo', userInfo)
    formValues['userRole'] = that.data.userRole
    Object.assign(userInfo, formValues)
    wx.setStorageSync(storeKeys.userInfo, userInfo)
    // debugLog('userInfo', userInfo)

    let companyName = this.data.companiesPicker[this.data.selectCompanyIndex];
    let companyId = this.data.companiesPickerObj[companyName]._id
    formValues['companyName'] = companyName
    formValues['companyId'] = companyId

    this.vertifyCompany(companyName, formValues.companyVertify, res => {
      delete formValues['companyVertify']
      if (that.data.isVertified == false) {
        wx.showToast({
          icon: 'none',
          title: '验证码不正确'
        })
        return
      }

      // create or update user
      userApi.queryUser({
        _id: userInfo.openId
      }, result => {
        // debugLog('queryUserResult', result)
        // If not found the user insert a new one.
        if (result.length <= 0) {
          userApi.createUser(userInfo, result => {
            // debugLog('insertResult', result)
            wx.switchTab({
              url: '../menuList/menuList'
            })
          })
        } else {
          userInfo = result[0]
          // else updat the user info with login time
          // debugLog('else updat the user info with login time','')
          userApi.updateUser(userInfo._id,
            formValues,
            result => {
              // debugLog('updateResult', result)
              // wx.setStorageSync(storeKeys.userInfo, userInfo)
              wx.switchTab({
                url: '../menuList/menuList'
              })
            })
        }

        // set storage
        let userInfo = wx.getStorageSync(storeKeys.userInfo)
        userInfo['userRole'] = that.data.userRole
        userInfo['companyName'] = formValues['companyName']
        userInfo['companyId'] = formValues['companyId']
        userInfo['contactName'] = formValues['contactName']
        userInfo['contactMobile'] = formValues['contactMobile']
        wx.setStorageSync(storeKeys.userInfo, userInfo)

      })
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
    let companyId = this.data.companiesPickerObj[companyName]._id
    // debugLog('companyName', companyName)
    // debugLog('vertifyCode', vertifyCode)
    // debugLog('companyId', companyId)
    // debugLog('userRole', that.data.userRole)
    wx.cloud.callFunction({
      name: 'companyVertify',
      data: {
        companyId: companyId,
        vertifyCode: vertifyCode,
        userRole: that.data.userRole
      }
      ,success: res => {
        // debugLog('companyVertify', res)
        that.setData({
          isVertified: res.isVertified
        })
        callback(res)
      }
      ,fail: err => {

      }
    })
  },

  formReset: function () {
    console.log('form发生了reset事件')
  }

})