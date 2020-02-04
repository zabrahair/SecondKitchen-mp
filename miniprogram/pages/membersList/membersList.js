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
    members: null,
    curMemberId: '',
    curMember: {},

    isShownMemberEditor: false,
    operatorType: gConst.OPERATION.UPDATE,

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
  refreshMemberes: function () {

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
    that.refreshUserInfo()
    let companyId = that.data.userInfo.companyId
    let userRole = that.data.userInfo.userRole
    that.getUsers(companyId, userRole);
  },

  /**
   * 获得用户列表
   */
  getUsers: function(companyId, userRole){
    let that = this
    let filters = {}
    if(companyId){
      if (userRole != USER_ROLE.ADMIN){
        filters = {
          companyId: companyId
        }
      }

      wx.cloud.callFunction({
        name: 'queryUsers',
        data: {
          filters: filters
        },
        success: res => {
          debugLog('queryUsers.success.res', res)
          that.setData({
            members: res.result.data
          })
        },
        fail: err => {
          wx.showToast({
            title: '用户列表获取失败',
          })
          errorLog('[云函数] 调用失败：', err)
        }
      }) 
    }else{
      wx.showToast({
        title: '请登陆后再试。',
        duration: 1000,
      })
      return;
    }
     
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
   * on click edit Member button
   */
  onEditMember: function (e) {
    debugLog('onEditMember.e', e)
    let memberId = e.currentTarget.dataset.memberId
    let memberIdx = e.currentTarget.dataset.memberIdx
    let curMember = this.data.members[memberIdx]
    this.setData({
      curMemberId: memberId,
      curMember: curMember,
      isShownMemberEditor: true,
      operatorType: gConst.OPERATION.UPDATE
    })
  },

  /**
   * Update Member
   */
  onMemberUpdate: function (e) {
    debugLog('onMemberUpdate', e)
    this.onShow();
    this.setData({
      isShownMemberEditor: false
    })
  },


  /**
   * Delete Member
   */
  onMemberDelete: function (e) {
    debugLog('onMemberDelete', e)
    this.onShow();
    this.setData({
      isShownMemberEditor: false
    })
  },

  /**
   * Close Member Editor
   */
  closeMemberEditor: function (e) {
    // debugLog('closeMemberEditor.event', e)
    this.setData({
      isShownMemberEditor: false
    })
  },
})