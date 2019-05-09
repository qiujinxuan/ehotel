//app.js
var aes = require('./utils/aes.js')
App({
  globalData: {
    userInfo: null,
    location: null,
    hotelID: "",
    hotelName: "",
    roomNum: "",
    openid: "",
    ROOM_ID: "",
    HOTEL_ID: "",
    RETURN_HOME: 0,
    ROOM_PRICE: "",
    ROOM_DATA: null,
    HOTEL_DATA: null,
    CUST_DATA: null,
    PAYMENT_DATA: null,
    POSITION: null,
    systeminfo: {}
  },

  onLaunch: function () {
    this.globalData.systeminfo = wx.getSystemInfoSync()
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var app = this;
    var signature = app.getSign();
    
  },

  onready: function(){
    
  },

  encrypt: function(s){
    return aes.encrypt(s)
  },

  getSign: function(){
    var timestamp = new Date().getTime();
    return aes.encrypt(timestamp);
  },

  decrypt: function(s){
    return aes.decrypt(s)
  }
})