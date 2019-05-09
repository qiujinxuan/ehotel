// pages/admin/mgr.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    status: ['空闲','有人在住']
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
  },

  completeCleaning: function(e){
    
  },

  defaultTap: function(e){
    console.log('==============');
  },

  unlock: function(e){
    var self = this;
    var app = getApp();
    var roomDetail = app.globalData.ROOM_DATA;
    var signature = app.getSign();
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/iot/locker',
      data: {
        type: 'open_lock',
        lockId: e.currentTarget.dataset.room.LOCK_ID,
        skip: 1,
        sign: signature
      },
      success: function (res) {
        var resultCode = res.data.error;
    
        if (resultCode != 0){
          wx.showModal({
            title:  '错误',
            content: '请联系酒店管理员'
          })
        }
      },
    })
  },
})