// pages/authentication/authentication.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
     sxtState:0,
     verifyCount: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var origin = options.origin?options.origin:'';
    var self = this;
    var app = getApp();
    var roomDetail = app.globalData.ROOM_DATA;
    var custDetail = app.globalData.CUST_DATA;

    self.setData({
      FROM_WHERE: origin,
      CUST_NAME: custDetail.CUST_NAME,
      IDENTITY: custDetail.IDENTITY
    });
  },

  grant: function(){
    wx.getSetting({
      success(res) {
        //validate user information permission
        if (!res.authSetting['scope.camera']) {
          wx.showModal({
            title: '未授权',
            content: '请重新安装该小程序并授权摄像头',
            showCancel: false
          })
        }
      }
    })
  },

  verifyFace: function(e){
    const ctx = wx.createCameraContext()
    var app = getApp();
    var self = this;

    var custDetail = app.globalData.CUST_DATA;
    var signature = app.getSign();

    ctx.takePhoto({
      quality: 'normal',
      success: function (res) {
        wx.showLoading({
          title: '正在核验身份...',
        })
        wx.uploadFile({
          url: 'https://www.southtradeservice.com/hotel/rest/service/verify',
          filePath: res.tempImagePath,
          name: 'file',
          formData: {
            'realName': custDetail.CUST_NAME,
            'idCardNum': custDetail.IDENTITY,
            'sign': signature
          },
          success: function (res) {
            var jsn = JSON.parse(res.data)
            //如果验证成功，将
            if (jsn.Code == 0) {
              wx.hideLoading()
              if (parseFloat(jsn.Data) > 70) { 
                //注册客户
                wx.request({
                  url: 'https://www.southtradeservice.com/hotel/rest/service/cust',
                  data: {
                    type: 'new',
                    sign: signature,
                    openid: app.globalData.openid,
                    mobile: custDetail.MOBILE,
                    identity: custDetail.IDENTITY,
                    custname: custDetail.CUST_NAME,
                    addres: custDetail.ADDRESS
                  },
                  success: function(res){
                    //如果没有插入成功，提示错误，停留在当前页面
                    var result = res.data.RESULT_CODE;
                    if (result != null){
                      wx.showToast({
                        title: '注册失败，请重新注册！'
                      })
                    }
                    //如果已经注册，则跳转到首页
                    else{
                      wx.redirectTo({
                        url: '../reg/reg-success'
                      }) 
                    }
                  } 
                });
              } 
              else {
                wx.hideLoading()
                wx.showModal({
                  title: '验证失败',
                  content: '头像和身份证信息不匹配',
                  showCancel: false
                })
              }
            } else {
              wx.hideLoading()
              wx.showModal({
                title: '验证失败',
                content: jsn.Msg == null ? '校验身份系统错误' : jsn.Msg,
                showCancel: false
              })
            }
          },
          fail: function (res) {
            wx.hideLoading()
            wx.showToast({
              title: '验证身份系统错误',
            })
            self.setData({
              showOrder: 1,
              buttonFlag: 0,
              editable: 1
            })
          },
          complete: function (res){
            wx.hideLoading()
            self.setData({
              verifyCount: self.data.verifyCount + 1,
              totalCount: self.data.totalCount + 1
            })
          }
        })
      },
      fail: function (res) {
        wx.showToast({
          title: '摄像头照相失败',
        })
      }
    })
  },


  

  setSxtState: function() {
    var that = this;
    that.setData({
      sxtState: !that.data.sxtState
    })
  },
  
  gourlnt: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({//保留当前页面，跳转到应用内的某个页面
      url: '../chekIn/checkIn'
    })
  },

})