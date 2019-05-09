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
    var origin = options.origin?optinos.origin:'';
    var self = this;
    var app = getApp();
    var roomDetail = app.globalData.ROOM_DATA;
    var custDetail = app.globalData.CUST_DATA;
    console.log('ppppppppppppay');
    console.log(roomDetail);
    self.setData({
      FROM_WHERE: origin,
      HOTEL_NAME: roomDetail.HOTEL_NAME,
      ROOM_NO: roomDetail.ROOM_NO,
      CUST_NAME: custDetail.CUST_NAME,
      IDENTITY: custDetail.IDENTITY,
      ROOM_PRICE: app.globalData.ROOM_PRICE
    });
  },

 
  //确认支付，微信支付最后一步
  confirmPayRoom: function (options) {
    var self = this
    var app = getApp();
    var signature = app.getSign();
    //从缓存中读取支付参数信息
    let paymentParam = app.globalData.PAYMENT_DATA;
    let custDetail = app.globalData.CUST_DATA;
    let roomDetail = app.globalData.ROOM_DATA;
    var mobileNo = custDetail.MOBILE;
  
    
    //调用微信的支付接口，最终支付
    wx.requestPayment({
      'timeStamp': paymentParam.timeStamp,  //时间戳,由后台在客户选择并生成订单时候生成的
      'nonceStr': paymentParam.nonceStr,  //随机串，有后台组装的
      'package': paymentParam.pack, //package，由后台生成的
      'signType': 'MD5', //签名方式
      'paySign': paymentParam.paySign, //签名，由后台生成
      //调用微信支付确认接口后，如果返回成功，则跳转到成功页面展示成功信息和动态密码
      'success': function (res) {
        //注册登记记录
        //查询客户注册信息
        wx.request({
          url: 'https://www.southtradeservice.com/hotel/rest/service/complete',
          data: {
            transId: paymentParam.transId,
            openid: wx.getStorageSync('OPEN_ID'),
            roomno: roomDetail.ROOM_NO,
            roomprice: app.globalData.ROOM_PRICE,
            hotelid: roomDetail.HOTEL_ID,
            durationtype: roomDetail.BOOK_TYPE,
            duration: roomDetail.DURATION,
            paytimestamp: paymentParam.timeStamp,
            paysign: paymentParam.paySign,
            custname: custDetail.CUST_NAME,
            identity: custDetail.IDENTITY,
            roomid: roomDetail.ROOM_ID,
            mobileno: custDetail.MOBILE,
            custaddress: "",
            sign: signature
          },
          success: function(res){
            var current = new Date();
            var duration = "";
            var durationtype = roomDetail.BOOK_TYPE;
            if (durationtype == '0'){
              duration = roomDetail.DURATION + "小时";
            }else{
              duration = roomDetail.DURATION + "天";
            }
            var params ="time:"+ current.toLocaleTimeString
                        + ",room:"+roomDetail.HOTEL_NAME+""+roomDetail.ROOM_NO
                        + ",duration:" + duration
                        + ",service:朝月科技";
            //发送短信到客户
            wx.request({
              url: 'https://www.southtradeservice.com/hotel/rest/service/sms',
              data: {
                sign: signature,
                mobile: mobileNo,
                params: params,
                template: 'TP1904044'
              },
              success: function(res){
            
                that.setData({
                  VERIFY_CODE_SMS: code
                });
              }
            });

            app.globalData.ROOM_DATA.END_TIME = res.data.END_TIME;
            //如果没有登记成功则提示，但是依然跳转到我的界面,毕竟客户已经支付
            wx.redirectTo({
              url: '../my/my'
            })
          }
        });
        
      },
      //调用微信支付确认接口后，如果返回失败，则跳转到失败页面，提醒客户到我的订单中查询再付款
      'fail': function (res) {
        wx.redirectTo({
          url: '../failed/failed'
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