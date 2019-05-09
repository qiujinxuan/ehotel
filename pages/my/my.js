// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    openState:0,
    DISPLAY: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var self = this;
    var app = getApp();
    var signature = app.getSign();
    var roomDetail = app.globalData.ROOM_DATA;
    console.log('------roomdetail');
    console.log(roomDetail);
    var userDetail = wx.getStorageSync("USER_DATA");
    if (!userDetail){
      wx.getSetting({
        success(res) {
          //validate user information permission
          if (res.authSetting['scope.userInfo']) {
            wx.getUserInfo({
              success: function (res) {
                console.log(res);
                userDetail = res.userInfo;
                self.setData({
                  AVATAR: userDetail.avatarUrl,
                });
                app.globalData.USER_DATA = res.userInfo;
                wx.setStorageSync("USER_DATA", res.userInfo);
              }
            })
          }
        }
      });
    }else{
      wx.getUserInfo({
        success: function (res) {
          console.log(res);
          userDetail = res.userInfo;
          self.setData({
            AVATAR: userDetail.avatarUrl,
          });
          app.globalData.USER_DATA = res.userInfo;
          wx.setStorageSync("USER_DATA", res.userInfo);
        }
      })
    }
 
  
    self.setData({
      HOTEL_NAME: roomDetail.HOTEL_NAME,
      ROOM_NO: roomDetail.ROOM_NO,   
      END_TIME: (roomDetail.END_TIME).substr(0,19)
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
  /**
   * 设置开锁状态
   */
  setOpenState: function () {
    var that = this;
    that.setData({
      openState: !that.data.openState
    })
    setTimeout(function(){
      that.setData({
        openState: !that.data.openState
      })
    },200)
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
        lockId: roomDetail.LOCK_ID,
        skip: 0,
        sign: signature
      },
      //将查询到的未支付订单信息放到订单页面，方便进行支付
      success: function (res) {
        var resultCode = res.data.error;
        if (res.data.RESULT_CODE != null && res.data.RESULT_CODE == 15){
          wx.showToast({
            title: '房间已经到期！'
          })
        }
        if (resultCode != 0){
          self.setData({
            DISPLAY: "错误编码"+resultCode+"，请联系酒店"
          });
        }else{
          self.setData({
            DISPLAY: '开锁信息已发送，请听到滴滴声后打开门锁',
            infoShow: true
          });
          wx.showToast({
            title: '请求成功！',
            image: '/image/old/icon_yes.png',
            duration: 3000,
            mask: true
          });
        }
      },
    })
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
        }else if (res.cancel){
          wx.makePhoneCall({
            phoneNumber: '13618495170'
          })
        }
      }
    });
  },

 //退房
  checkout: function(){
    var app = getApp();
    var roomDetail = app.globalData.ROOM_DATA;
    var self = this; 
    var signature = app.getSign();
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/service/room',
      data: {
        type: 'checkout',
        roomid: roomDetail.ROOM_ID,
        sign: signature
      },
      //退房成功后，返回首页
      success: function (res) {
        wx.showToast({
          title: '退房成功！',
          image: '/image/old/icon_yes.png',
          duration: 1500,
          mask: true,
          success: function(res){
            wx.redirectTo({
              url: '../index/index?origin=inner',
            })
          }
        });
      }
    });
  },

  renew: function(){
    wx.redirectTo({
      url: '../checkIn/checkIn?origin=inner',
    })
  },

  gourlnt: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({//保留当前页面，跳转到应用内的某个页面
      url: '../index/index?origin=inner'
    })
  },

  closeInfo() {
    var self = this;
    self.setData({
      infoShow: false
    })
  }
})