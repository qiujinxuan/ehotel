// pages/admin/login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userTypes: ['管理员','特约商户','服务员'],
    items: [
      {value: '1', name: '管理员'},
      {value: '2', name: '特约商户'},
      {value: '3', name: '服务员', checked: 'true'}
    ],
    USER_TYPE: 3
  },

  inputUserId : function(e){
    var self = this
    self.setData({userId: e.detail.value});
  },

  inputUserPwd: function (e) {
    var self = this
    self.setData({ userPwd: e.detail.value });
  },

  selectUserType: function(e){
    var self = this
    self.setData({userType: e.detail.value})
  },

  radioChange(e) {
    var app = getApp();
    app.globalData.USER_TYPE=e.detail.value;
  },

  submitLogin: function(){
    var self = this
    var app = getApp();
    var userType = app.globalData.USER_TYPE;
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/service/staff',
      data: {
        userId: self.data.userId,
        userPwd: self.data.userPwd,
        userType: userType
        //userType: self.data.userType
      },
      //查询酒店房间信息后将房间信息放在页面数据中，显示在页面中
      success: function (res) {
        
        if (res.data.RESULT_CODE == '0'){
          //如果是管理员，则跳转到最高级智能锁管理界面
          if (userType == '1'){
            wx.redirectTo({
              url: '../admin/mgr?userType='+userType+'&userId='+self.data.userId
            });
          }
          //如果是特约商户，则跳转到只有该酒店的智能锁管理界面
          else if (userType == '2'){
            wx.redirectTo({
              url: '../admin/locker?userType='+userType+'&userId='+self.data.userId
            });
          }
          //如果是，则跳转到只有该酒店的智能锁管理界面
          else if (userType == '3'){
            wx.redirectTo({
              url: '../admin/clean?userType='+userType+'&userId='+self.data.userId
            });
          }
          
        }else{
          self.setData({error: '用户名或者密码错误'})
        }
      },
      //如果失败，在页面显示错误信息
      fail: function (res) {
        wx.showToast({
          title: '系统错误',
        })
      }
    })
  }


})