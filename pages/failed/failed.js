// pages/failed/failed.js
Page({
  data: {
    alertstate:0
  },
  onLoad: function (options) {
  },
  setalertstate: function () {
    this.setData({
      alertstate: !this.data.alertstate
    })
  },

  redirectToIndex: function(){
    wx.redirectTo({
      url: '../index/index'
    })
  },

  payOnceMore: function(){
    //从缓存中读取支付参数信息
    let paymentParam = wx.getStorageSync("PaymentParam");
    //调用微信的支付接口，最终支付
    wx.requestPayment({
      'timeStamp': paymentParam.timeStamp,  //时间戳,由后台在客户选择并生成订单时候生成的
      'nonceStr': paymentParam.nonceStr,  //随机串，有后台组装的
      'package': paymentParam.pack, //package，由后台生成的
      'signType': 'MD5', //签名方式
      'paySign': paymentParam.paySign, //签名，由后台生成
      //调用微信支付确认接口后，如果返回成功，则跳转到成功页面展示成功信息和动态密码
      'success': function (res) {
        wx.redirectTo({
          url: '../success/success'
        })
      },
      //调用微信支付确认接口后，如果返回失败，则跳转到失败页面，提醒客户到我的订单中查询再付款
      'fail': function (res) {
        console.log("-----fail------")
        wx.setStorageSync('xxx', res)
        console.log("-----fail------" + res.detail)
        wx.redirectTo({
          url: '../failed/failed'
        })
      },
      'complete': function (res) { }
    })
  }
})