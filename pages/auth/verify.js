// pages/auth/verify.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    cameraPos: "front",
    showCamera: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },
  verfiyPerson: function () {
    var self = this
    const ctx = wx.createCameraContext()
    ctx.takePhoto({
      quality: 'high',
      success: function (res) {
        wx.showLoading({
          title: '正在核验身份...',
        })
        //-----------------------------------------------
        var filePath = res.tempFilePaths[0];
        var base64img = this.urlTobase64(filePath)
        wx.request({
          url: 'https://www.southtradeservice.com/hotel/rest/service/verify',
          data: {
            base64Img: base64img,
            personName: that.data.personName,
            personId: that.data.personId
          },
          //查询酒店房间信息后将房间信息放在页面数据中，显示在页面中
          success: function (res) {
            if (res.data.resultCode == 0) {
              wx.hideLoading()
              wx.showToast({
                title: '身份验证成功',
              })
            } else {
              wx.showToast({
                title: '身份验证失败',
              })
            }
          },
          //如果失败，在页面显示错误信息
          fail: function (res) {
            //console.log(res.data)
          },
          complete: function (res) {
            self.setData({
              showCamera: 0
            })
          }
        })
        //-----------------------------------------------
      },
      fail: function (res) {

      }
    })
  },

  urlTobase64: function (url) {
    request({
      url: url,
      responseType: 'arraybuffer', //最关键的参数，设置返回的数据格式为arraybuffer
      success: res => {
        let base64 = wx.arrayBufferToBase64(res); //把arraybuffer转成base64
        base64 = 'data:image/jpeg;base64,' + base64　//不加上这串字符，在页面无法显示的哦
        console.log(base64)　//打印出base64字符串，可复制到网页校验一下是否是你选择的原图片呢
        return base64
      },
      fail: res => {
        return ""
      }
    })
  },

  cameraError: function () {
    wx.showToast({
      title: '摄像头未授权',
    })
  }
})