//获取应用实例
const app = getApp()
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');

const USER_ROLE = require('../../const/userRole.js')

Page({
  data: {
    USER_ROLE: USER_ROLE,
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  onLoad: function () {
  },



  onClickRoleButton: function (e) {
    let userRole = e.target.dataset.userRole
    wx.navigateTo({
      url: '../register/register?' 
      + gConst.pageParams.userRole + "=" + userRole 
    })

  },
})
