// pages/checkIn/checkIn.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabState:0,
    header_type: 'hour',
    select_bottom: '3',
    CHOOSE_HOUR: 3,
    CHOOSE_DAY: 1,
    ROOM_PRICE: null,
    BASIC_HOUR_PRICE: null,
    DAY_PRICE: null,
    time:0,
    moretimeState:0,
    array: ["1小时", "2小时", "3小时", "4小时"],
    index: 0,
  },

  onLoad: function(options){
    var app = getApp();
    var roomDetail = app.globalData.ROOM_DATA;
    var self = this;
    app.globalData.ROOM_DATA.BOOK_TYPE = '0'; //默认钟点房
    app.globalData.ROOM_DATA.DURATION = self.data.CHOOSE_HOUR;

    self.setData({
      ROOM_PRICE: roomDetail.BASIC_HOUR_PRICE,
      BASIC_HOUR_PRICE: roomDetail.BASIC_HOUR_PRICE,
      DAY_PRICE: Math.round(roomDetail.PRICE),
      PRICE_DAY_1: Math.round(roomDetail.PRICE),
      PRICE_DAY_2: Math.round(roomDetail.PRICE * 1.8),
      PRICE_DAY_3: Math.round(roomDetail.PRICE * 2.4),
      PRICE_HOUR_3: Math.round(roomDetail.BASIC_HOUR_PRICE),
      PRICE_HOUR_4: Math.round(roomDetail.BASIC_HOUR_PRICE * 1.5),
      PRICE_HOUR_6: Math.round(roomDetail.BASIC_HOUR_PRICE * 2),
      FROM_WHERE: options.origin?options.origin:""
    });
  },


  
  /**
   * 设置房类型
   */
  chooseRoomType: function (event) {
    var where = event.currentTarget.dataset.index;
    var that = this;
    var app = getApp();

    that.setData({
      tabState: where
    })
    if (where==0){
      that.setData({
        //array: ["1小时", "2小时", "3小时", "4小时"],
        ROOM_PRICE: that.data.BASIC_HOUR_PRICE,
        header_type: 'hour',
        select_bottom: '3'
      })
      app.globalData.ROOM_DATA.BOOK_TYPE = '0'; //默认钟点房
      app.globalData.ROOM_DATA.DURATION = that.data.CHOOSE_HOUR;
    } else if (where == 1){
      that.setData({
        //array: ["4天", "5天", "6天", "7天"],
        ROOM_PRICE: that.data.DAY_PRICE,
        header_type: 'day',
        select_bottom: '1'
      })
      app.globalData.ROOM_DATA.BOOK_TYPE = '1'; //默认钟点房
      app.globalData.ROOM_DATA.DURATION = that.data.CHOOSE_DAY;
    }
    
  },
  /**
  * 设置钟点房时间
  */
 chooseHour: function (event) {
    var time = event.currentTarget.dataset.time;
   var index = event.currentTarget.dataset.index;
    var that = this;
    var app = getApp();
    var basicPrice = that.data.BASIC_HOUR_PRICE;
    var price = basicPrice * (1 + (index - 1) * 0.5);
    
    that.setData({
      time: time,
      ROOM_PRICE: price,
      CHOOSE_HOUR: time,
      select_bottom: time
    });
    app.globalData.ROOM_DATA.BOOK_TYPE = '0'; //钟点房
    app.globalData.ROOM_DATA.DURATION = time;
  },
  /**
  * 设置钟点房时间
  */
 chooseDay: function (event) {
    var time = event.currentTarget.dataset.time;
    var that = this;
    var app = getApp();
    var basicPrice = that.data.DAY_PRICE;
   var price = Math.round(basicPrice * time * (1 - 0.1 * (time -1 )));
    
    that.setData({
      time: time,
      ROOM_PRICE: price,
      CHOOSE_DAY: time,
      select_bottom: time
    });
    app.globalData.ROOM_DATA.BOOK_TYPE = '1'; //按日入住
    app.globalData.ROOM_DATA.DURATION = time;
  },
  /**
  * 设置钟点房时间
  */
 selfDefine: function (event) {
    var that = this;
    
    that.setData({
      moretimeState: !that.data.moretimeState
    })
    if (that.data.moretimeState == 0) {
      that.setData({
        tab2State:1
      })
    }
  },
  gourlnt: function (e) {
    var url = e.currentTarget.dataset.url;
    wx.redirectTo({//保留当前页面，跳转到应用内的某个页面
      url: '../index/index'
    })
  },

  submitCheckIn: function(e) {
    var that = this; 
    that.data.ROOM_PRICE = '0.01';
    var app = getApp();
    var signature = app.getSign();
    app.globalData.ROOM_PRICE = that.data.ROOM_PRICE;
    wx.login({
      success: function (res) {
        //如果小程序登录成功，获取了登录code，利用登录code发起统一订单接口
        if (res.code) {
          wx.request({
            url: 'https://www.southtradeservice.com/hotel/rest/wechat/order',
            data: {
              sign: signature,
              code: res.code,
              roomprice: that.data.ROOM_PRICE,
              mobile: app.globalData.CUST_DATA.MOBILE,
              openid: app.globalData.openid,
              roomid: app.globalData.ROOM_DATA.ROOM_ID,
              hotelid: app.globalData.ROOM_DATA.HOTEL_ID,
              origin: that.data.FROM_WHERE
            },
            //将查询到的未支付订单信息放到订单页面，方便进行支付
            success: function (res) {
              var payment = {
                timeStamp: res.data.timeStamp,
                nonceStr: res.data.nonceStr,
                pack: res.data.package,
                signType: res.data.signType,
                paySign: res.data.paySign,
                //endTime: res.data.END_TIME,
                //startTime: res.data.START_TIME,
                transId: res.data.TRANS_ID
              };
              app.globalData.PAYMENT_DATA = payment;
              that.confirmPayRoom();
            }
          })
        }
      }
    }); 
  },

  //确认支付，微信支付最后一步
  confirmPayRoom: function () {
    var self = this
    var app = getApp();
    var signature = app.getSign();
    //从缓存中读取支付参数信息
    let paymentParam = app.globalData.PAYMENT_DATA;
    let custDetail = app.globalData.CUST_DATA;
    let roomDetail = app.globalData.ROOM_DATA;
    var mobileNo = custDetail.MOBILE;
    var origin = self.data.FROM_WHERE;


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
            starttime: roomDetail.END_TIME,
            origin: origin,
            sign: signature
          },
          success: function (res) {
            var current = new Date();
            var duration = "";
            var durationtype = roomDetail.BOOK_TYPE;
            if (durationtype == '0') {
              duration = roomDetail.DURATION + "小时";
            } else {
              duration = roomDetail.DURATION + "天";
            }
            var params = "time:" + formatDate(current)
              + ",room:" + roomDetail.HOTEL_NAME + "" + roomDetail.ROOM_NO
              + ",duration:" + duration
              + ",service:朝月科技";
            console.log('sms>>>>>>>>>'+ mobileNo + '|' +params);
            //发送短信到客户
            wx.request({
              url: 'https://www.southtradeservice.com/hotel/rest/service/sms',
              data: {
                sign: signature,
                mobile: mobileNo,
                params: params,
                template: 'TP1904044'
              },
              success: function (res) {
                
              }
            });
            console.log(app.globalData.ROOM_DATA);
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
  }
})

function formatDate(date){
  return (date.getMonth()+1) + '-' + date.getDate() + ' ' + date.getHours() + ':' + date.getMinutes(); 
}