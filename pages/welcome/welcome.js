// pages/welcome/welcome.js
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
    
  },

  
  gourlnt: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({//保留当前页面，跳转到应用内的某个页面
      url: '../' + url + '/' + url,//url里面就写上你要跳到的地址
    })
  },

  /**
   * 在欢迎界面继续到注册界面
   */
  continueToReg: function(e){
    wx.redirectTo({//保留当前页面，跳转到应用内的某个页面
      url: '../reg/reg'//url里面就写上你要跳到的地址
    })
  }
})