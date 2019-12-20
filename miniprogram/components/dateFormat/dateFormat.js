// components/dateFormat/dateFormat.js
const MSG = require('../../const/message.js')
const debugLog = require('../../utils/log.js').debug;
const errorLog = require('../../utils/log.js').error;
const gConst = require('../../const/global.js');
const storeKeys = require('../../const/global.js').storageKeys;
const utils = require('../../utils/util.js');
const TABLES = require('../../const/collections.js')

Component({
  /**
   * 组件的属性列表
   */
  properties: {
    date: {
      type: Number,
      value: 0
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    formatedDate: utils.formatDate(new Date())
  },

  /**
   * 
   */
  attached: function(){
    debugLog('date', this.data.date)
    this.setData({
      formatedDate: utils.formatDate(new Date(this.data.date))
    })
  },

  /**
   * 组件的方法列表
   */
  methods: {

  }
})
