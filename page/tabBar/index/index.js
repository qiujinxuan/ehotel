const app = getApp();
import utill from '../../../utils/util.js';

Page({

  /**
   * 页面的初始数据
   */
  data: {
    loginSuccess:true, //是否登陆
    showInfo:false,
    markers: [{
      iconPath: '/image/index/fenzu3_2.png',
      id: 0,
      latitude: 23.099994,
      longitude: 113.324520,
      width: 31,
      height: 34
    },{
      iconPath: '/image/index/fenzu3_4.png',
      id: 0,
      latitude: 23.019994,
      longitude: 113.384520,
      width: 31,
      height: 34
    }]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      height:app.data.systeminfo.windowHeight
    })
   setTimeout(() => {
      // this.setData({loginSuccess:true})  //模拟登陆成功
      //  wx.reLaunch({
      //   url: '/page/tabBar/index/register/index',
      // });                                   //模拟登陆不成功
   }, 1000);
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
  navigate(){
    wx.navigateTo({
      url: '/page/tabBar/person/index',
    });
  },
  navigateScen(){
    wx.navigateTo({
      url: '/page/tabBar/index/detail/index',
    });
  },
  markertap(){
    const showInfo = !this.data.showInfo
    this.setData({
      showInfo:showInfo
    })
  }
})
