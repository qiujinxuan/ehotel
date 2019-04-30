// page/tabBar/index/detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    header_type:'time',
    select_bottom:'1'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  headerOp(e){
    const type = e.currentTarget.dataset.type
    if(type !=this.data.header_type) {
      this.setData({
        header_type:type,
        select_bottom:'1'
      })
    }
    
  },
  onLoad: function (options) {

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
  navigateTo(){
    wx.reLaunch({
      url: '/page/tabBar/index/detail/result',
    });
  },
  switchact(e){
    const index = e.currentTarget.dataset.index
    if(index!=this.data.select_bottom){
      this.setData({
        select_bottom:index
      })
    }
  }
})