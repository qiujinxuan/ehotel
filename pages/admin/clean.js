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
    var self = this
    self.setData({userId: options.userId})
    self.setData({ userType: options.userType })
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/service/queryroombystaff',
      data: {
        userId: options.userId
      },
      success: function (res) {
        self.setData({rooms:res.data})
      },
      fail: function (res) {
        wx.showToast({
          title: '查询员工对应酒店房间失败',
        })
      }
    })
  },

  completeCleaning: function(e){
    var self = this
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/mgr/mgr',
      data: {
        roomId: e.currentTarget.dataset.room.ROOM_ID,
        roomStatus: '0',
        currentStatus: '1'
      },
      success: function (res) {
        wx.showToast({
          title: '成功',
        })
        var selectedIndex = e.currentTarget.dataset.index

        var selectedRoom = 'rooms[' + selectedIndex +"].ROOM_STATUS"
        self.setData({
          [selectedRoom]: 0
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '失败，请重新提交',
        })
      }
    })
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