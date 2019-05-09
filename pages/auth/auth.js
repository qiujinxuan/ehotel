
Page({
  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function () {

  },
  redirecToIndex: function (e) {
    var app = getApp();
    wx.getUserInfo({
      success: function (res) {
        app.globalData.userInfo = res.userInfo
        wx.redirectTo({
          url: '../index/index'
        })
      }
    })
  },

  redirectToReg: function (e) {
    var app = getApp();
    wx.getUserInfo({
      success: function (res) {
        app.globalData.userInfo = res.userInfo
        wx.redirectTo({
          url: '../reg/reg'
        })
      }
    })
  }
})