// components/memberSelector/memberSelector.js
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

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShown: {
      type: Boolean,
      value: false,
    },
    memberId: {
      type: String,
      value: ''
    },
    member: {
      type: Object,
      value: {},
    },
    operatorType: {
      type: String,
      value: ''
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    OPERATION: gConst.OPERATION,
    member: {},
    contactName: '',
  },
  lifetimes: {
    attached: function () {
      // debugLog('lifetimes.attached', this.properties)
      let that = this
    },

    show: function () {
      // debugLog('lifetimes.show')
    }
  },

  pageLifetimes: {
    show: function () {
      // debugLog('pageLifetimes.show')
    }
  },

  observers: {
    'isShown': function (isShown) {
      debugLog('observers.isShown', isShown)
      // debugLog('observers.properties', this.properties)
    },
    'memberId': function (memberId) {
      // debugLog('observers.memberId', memberId)
    },
    'member': function (member) {
      // debugLog('observers.member', member)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose: function (e) {
      // debugLog('onClose.event', e)
      this.triggerEvent('close')
    },

    /**
     * 菜品更新
     */
    onMemberUpdate: function (e) {
      let that = this
      // debugLog('member', that.properties.member)
      wx.showModal({
        title: MSG.UPDATE_CONFIRM_TITLE,
        content: MSG.UPDATE_CONFIRM_MESSAGE,
        success(res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'updateUser',
              data: {
                id: that.properties.memberId,
                user: that.properties.member
              },
              success: res => {
                that.triggerEvent('updateMember')
                debugLog('updateMember.success.res', res)
                wx.showToast({
                  title: '成员更新成功',
                  duration: 1500,
                })
                // wx.navigateBack({
                //   delta: 1
                // })
              },
              fail: err => {
                that.triggerEvent('updateMember')
                wx.showToast({
                  title: '成员更新失败',
                })
                console.error('[云函数] 调用失败：', err)
              }
            })
          } else if (res.cancel) {
            debugLog('用户点击取消')
          }
        }
      }) 
    },


    /**
     * 菜品删除
     */
    onMemberDelete: function (e) {
      let that = this
      wx.showModal({
        title: MSG.REMOVE_CONFIRM_TITLE,
        content: MSG.REMOVE_CONFIRM_MESSAGE,
        success(res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'removeUser',
              data: {
                id: that.properties.memberId
              },
              success: res => {
                debugLog('removeMember.success.res', res)
                that.triggerEvent('deleteMember')
                wx.showToast({
                  title: '成员删除成功',
                  duration: 1500,
                })
                // wx.navigateBack({
                //   delta: 1
                // })
              },
              fail: err => {
                that.triggerEvent('deleteMember')
                wx.showToast({
                  title: '菜品删除失败',
                })
                console.error('[云函数] 调用失败：', err)
              }
            })
            
          } else if (res.cancel) {
            debugLog('用户点击取消')
          }
        }
      }) 
    },
    /**
     * 当名字输入获得焦点时
     */
    onNameInputFocus: function (e) {

    },
    /**
     * 当名字输入失去焦点时
     */
    onNameInputBlur: function (e) {
      debugLog('onNameInputBlur.e', e)
      let member = this.data.member
      member.contactName = e.detail.value
      this.setData({
        member: member
      })
      debugLog('onNameInputBlur.NOW.Member', this.data.member)
    },
  },
})
