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
    dishes: {},
  },

  lifetimes: {
    attached: function () {
      debugLog('lifetimes.attached', this.properties)
      let that = this
      dishApi.queryDishes({}, result => {
        // debugLog('Dish Page onLoad', JSON.stringify(result), 2);
        that.setData({
          dishes: result
        })
      })
    },

    show: function () {
      debugLog('lifetimes.show')
    }
  },

  pageLifetimes: {
    show: function () {
      debugLog('pageLifetimes.show')
    }
  },

  observers: {
    'dishEnName, dishIdx': function (dishEnName, dishIdx) {
      debugLog('observers.dishEnName', dishEnName)
    }
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClose: function (e) {
      // debugLog('onClose.event', e)
      this.triggerEvent('close', { a: 1 }, { b: 2 }, { c: 3 })
    },

    onTapDish: function (e) {
      let that = this
      debugLog('onTapDish.event', e)
      let optionIdx = e.currentTarget.dataset.optionIdx
      let dishOption = this.data.dishes[optionIdx]
      debugLog('onTapDish.optionIdx', optionIdx)
      debugLog('onTapDish.dishOption', dishOption)
      this.triggerEvent('tapNewDishOption', {
        dishIdx: that.properties.dishIdx,
        dishEnName: that.properties.dishEnName,
        dishOption: dishOption,
      })
    },

    tapUpdateDish: function(e){

    },
    tapCreateDish: function (e) {

    },
    tapDeleteDish: function (e) {

    }
  },

})
