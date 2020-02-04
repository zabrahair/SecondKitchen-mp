// components/dishSelector/dishSelector.js
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
const dishApi = require('../../api/dish.js')
const DISH_PREFIX = 'dish_image_'

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    isShown: {
      type: Boolean,
      value: false,
    },
    dishId: {
      type: String,
      value: ''
    },
    dish: {
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
    dish: gConst.EMPTY_DISH,
  },

  lifetimes: {
    attached: function () {
      // debugLog('lifetimes.attached', this.properties)
      let that = this
      // dishApi.queryDishes({}, result => {
      //   // // debugLog('Dish Page onLoad', JSON.stringify(result), 2);
      //   // that.setData({
      //   //   dishes: result
      //   // })
      // })
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
    'isShown': function(isShown){
      debugLog('observers.isShown', isShown)
      // debugLog('observers.properties', this.properties)
    },
    'dishId': function (dishId) {
      // debugLog('observers.dishId', dishId)
    },
    'dish': function (dish) {
      // debugLog('observers.dish', dish)
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
    onDishUpdate: function(e){
      let that = this
      wx.showModal({
        title: MSG.UPDATE_CONFIRM_TITLE,
        content: MSG.UPDATE_CONFIRM_MESSAGE,
        success(res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'updateDish',
              data: {
                dishId: that.properties.dishId,
                dish: that.properties.dish
              },
              success: res => {
                that.triggerEvent('updateDish')
                debugLog('updateDish.success.res', res)
                wx.showToast({
                  title: '菜品更新成功',
                  duration: 1500,
                })
                // wx.navigateBack({
                //   delta: 1
                // })
              },
              fail: err => {
                that.triggerEvent('updateDish')
                wx.showToast({
                  title: '菜品更新失败',
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
     * 菜品添加
     */
    onDishCreate: function (e) {
      let that = this
      wx.showModal({
        title: MSG.CREATE_CONFIRM_TITLE,
        content: MSG.CREATE_CONFIRM_MESSAGE,
        success(res) {
          if(res.confirm){
            wx.cloud.callFunction({
              name: 'createDish',
              data: {
                dish: that.properties.dish
              },
              success: res => {
                that.triggerEvent('createDish')
                debugLog('createDish.success.res', res)
                wx.showToast({
                  title: '菜品创建成功',
                  duration: 1500,
                })
                // wx.navigateBack({
                //   delta: 1
                // })
              },
              fail: err => {
                that.triggerEvent('createDish')
                wx.showToast({
                  title: '菜品创建失败',
                })
                console.error('[云函数] 调用失败：', err)
              }
            })
          } else if(res.cancel) {
            debugLog('用户点击取消')
          }

        }
      })
    },

    /**
     * 菜品删除
     */
    onDishDelete: function (e) {
      let that = this
      wx.showModal({
        title: MSG.REMOVE_CONFIRM_TITLE,
        content: MSG.REMOVE_CONFIRM_MESSAGE,
        success(res) {
          if (res.confirm) {
            wx.cloud.callFunction({
              name: 'removeDish',
              data: {
                dishId: that.properties.dishId
              },
              success: res => {
                that.triggerEvent('deleteDish')
                debugLog('removeDish.success.res', res)
                wx.showToast({
                  title: '菜品删除成功',
                  duration: 1500,
                })
                // wx.navigateBack({
                //   delta: 1
                // })
              },
              fail: err => {
                that.triggerEvent('deleteDish')
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
    upLoadDishImage: function () {
      let that = this
      let dish = this.properties.dish
      if(dish.name != undefined && dish.name != ''){
        // 选择图片
        wx.chooseImage({
          count: 1,
          sizeType: ['original'],
          sourceType: ['album', 'camera'],
          success: function (res) {
            console.log('image:' + JSON.stringify(res, 4));
            wx.showLoading({
              title: '上传中',
            })

            const filePath = res.tempFilePaths[0]
            const fileInfo = utils.extractFileInfo(filePath)
            const cloudPath = DISH_PREFIX + dish.name + "_" + utils.formatDate(new Date(),'-') + fileInfo.extension
            debugLog('cloudPath', cloudPath)
            // 上传图片
            wx.cloud.uploadFile({
              cloudPath,
              filePath,
              success: res => {
                debugLog('uploadFile', res)
                wx.cloud.getTempFileURL({
                  fileList: [res.fileID]
                }).then(res => {
                  // get temp file URL
                  debugLog('upload http url', res)
                  const dishImageUrl = res.fileList[0].tempFileURL
                  dish.imageUrl = dishImageUrl
                  debugLog('dishImageUrl', dishImageUrl)
                  that.setData({
                    dish: dish
                  })
                  debugLog('data.dish', that.data.dish)
                }).catch(error => {
                  // handle error
                })
              },
              fail: e => {
                console.error('DISH[上传文件] 失败：', e)
                wx.showToast({
                  icon: 'none',
                  title: '上传失败',
                })
              },
              complete: () => {
                wx.hideLoading()
              }
            })
            }
            ,fail: e => {
              console.error(e)
            }
        })
      }else{
        wx.showToast({
          icon: 'none',
          title: '请先输入单品信息',
          duration: 1500,
        })
      }
    },
    onNameInputBlur: function(e){
      debugLog('onNameInputBlur.e', e)
      let dish = this.data.dish
      dish.name = e.detail.value
      this.setData({
        dish: dish
      })
      debugLog('onNameInputBlur.NOW.DISH', this.data.dish)
    },
    onCategoryInputBlur: function(e){
      debugLog('onCategoryInputBlur.e', e)
      let dish = this.data.dish
      dish.category = e.detail.value
      this.setData({
        dish: dish
      })
      debugLog('onCategoryInputBlur.NOW.DISH', this.data.dish)
    },
    onPriceInputBlur: function(e){
      debugLog('onPriceInputBlur.e', e)
      let dish = this.data.dish
      dish.price = e.detail.value
      this.setData({
        dish: dish
      })
      debugLog('onPriceInputBlur.NOW.DISH', this.data.dish)
    }
  },
})
