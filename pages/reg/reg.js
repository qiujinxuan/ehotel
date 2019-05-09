// pages/reg/reg.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CUST_NAME: "",
    IDENTITY: "",
    MOBILE: "",
    VERIFY_CODE_SMS: "",
    VERIFY_CODE_INPUT: "",
    ADDRESS: "",
    IDENTITY_CLASS: "one-li",
    MOBILE_CLASS: "one-li",
    VERIFY_CONTENT: '获取验证码'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  inputMobile: function(e){
    var self = this;
    self.setData({
      MOBILE: e.detail.value
    });
  },

  inputVerifyCode: function(e){
    var self = this;
    self.setData({
      VERIFY_CODE_INPUT: e.detail.value
    });
  },

  inputCustName: function(e){
    var self = this;
    self.setData({
      CUST_NAME: e.detail.value
    });
  },

  inputIdentity: function(e){
    var self = this;
    self.setData({
      IDENTITY: e.detail.value
    });
  },

  submitReg: function(e){
    var that = this;
    var app = getApp();
    var signature = app.getSign();
    var flag = that.data.NEED_NEW_VERIFY_CODE;
    if (flag == 1){
      wx.showToast({
        title: '请重新获取验证码！'
      })
      return;
    }
    console.log('>>>>>>>>' + that.data.VERIFY_CODE_SMS);
    console.log('>>>>>>>>' + that.data.VERIFY_CODE_INPUT);
    if (that.data.VERIFY_CODE_INPUT == '' || that.data.VERIFY_CODE_SMS != that.data.VERIFY_CODE_INPUT){
      that.setData({
        MOBILE_CLASS: "one-li red-bbk"
      });
      wx.showToast({
        title: '验证码错误！'
      })
      return;
    }

    var regMobile = /^1[34578]\d{9}$/;
    if (regMobile.test(that.data.MOBILE) === false) {
      that.setData({
        MOBILE_CLASS: "one-li red-bbk"
      });
      wx.showToast({
        title: '手机号码格式错误！'
      })
      return;
    }else{
      that.setData({
        MOBILE_CLASS: "one-li"
      });
    }
    var regIdentity = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
    if (regIdentity.test(that.data.IDENTITY) === false) {
      that.setData({
        IDENTITY_CLASS: "one-li red-bbk"
      });
      wx.showToast({
        title: '身份证号码格式错误！'
      })
      return;
    }else{
      that.setData({
        MOBILE_CLASS: "one-li"
      });
    }
    var custData = {
        OPEN_ID: app.globalData.openid,
        MOBILE: that.data.MOBILE,
        IDENTITY: that.data.IDENTITY,
        CUST_NAME: that.data.CUST_NAME,
        ADDRESS: that.data.ADDRESS
    };
    app.globalData.CUST_DATA = custData;

    wx.redirectTo({
      url: '../face/face'
    });   
  },

  /**
   * 短信验证码
   */
  getVerifyCode: function(e){
    var app = getApp();
    var that = this;
    var mobileNo = that.data.MOBILE;
    var signature = app.getSign();

    var regMobile = /^1[34578]\d{9}$/;
    if (regMobile.test(that.data.MOBILE) === false) {
      that.setData({
        MOBILE_CLASS: "one-li red-bbk"
      });
      return;
    }
    var code  = Math.round(Math.random()*10000);
    var params = "code:"+code;

    //获取验证码
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/service/sms',
      data: {
        sign: signature,
        mobile: mobileNo,
        params: params,
        template: 'TP1904043'
      },
      success: function(res){
    
        that.setData({
          VERIFY_CODE_SMS: code,
          NEED_NEW_VERIFY_CODE: 0
        });
        countdown(that, 60);
      }
    });
  },

  gourlnt: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({//保留当前页面，跳转到应用内的某个页面
      url: '../index/index'
    })
  }
})

function countdown(that,second) {
  if (second == 0) {
    that.setData({
      VERIFY_CONTENT: '获取验证码',
      NEED_NEW_VERIFY_CODE: 1
    });
    return;
  }
  var time = setTimeout(function () {
    that.setData({
      VERIFY_CONTENT: second + 's'
    });
    second = second -1;
    countdown(that, second);
  }
    , 1000)
}