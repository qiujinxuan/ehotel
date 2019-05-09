// pages/expire/expire.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var app = getApp();
    var roomDetail = app.globalData.ROOM_DATA;
    var signature = app.getSign();

    self.setData({
      ROOM_NO: roomDetail.ROOM_NO,
      HOTEL_NAME: roomDetail.HOTEL_NAME,
      END_TIME: (roomDetail.END_TIME).substr(0, 19)
    });

    //查询客户注册信息
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/service/cust',
      data: {
        type: 'openid',
        openid: app.globalData.openid,
        sign: signature
      },
      success: function (res) {
    
        app.globalData.CUST_DATA = res.data[0];
      }
    });
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
  gourlnt: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({//保留当前页面，跳转到应用内的某个页面
      url: '../' + url + '/' + url,//url里面就写上你要跳到的地址
    })
  },

  /**
   * 续房，跳转到checkin
   */
  renew: function(){
    wx.redirectTo({
      url: '../checkIn/checkIn?origin=inner'
    })
  },

  /**
   * 新开房
   */
  checkOut: function(){
    var self = this;
    var app = getApp();
    var signature = app.getSign();
    var roomDetail = app.globalData.ROOM_DATA;
    console.log(roomDetail);
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/mgr/mgr',
      data: {
        roomId: roomDetail.ROOM_ID,
        roomStatus: '1',
        currentStatus: '1',
        sign: signature
      },
      success: function(res){
        wx.redirectTo({
          url: '../index/index?origin=inner'
        }) 
      }
    });
  },

  callService: function () {
    var app = getApp();
    var mobile = app.globalData.ROOM_DATA.HOTEL_PHONE;

    wx.showModal({
      title: '联系方式',
      content: '客房服务，请联系酒店服务；\r\n投诉建议，请联系平台客服。',
      confirmText: '酒店服务',
      cancelText: '平台客服',
      success(res) {
        if (res.confirm) {
          wx.makePhoneCall({
            phoneNumber: mobile
          })
        } else if (res.cancel) {
          wx.makePhoneCall({
            phoneNumber: '13618495170'
          })
        }
      }
    });
  }
})