//index.js
Page({
    data: {
      SHOW_BOX:0,
      SHOW_MAP: true,
      scale:15,
      currentlatitude: 28.207128,
      currentlongitude: 113.073051 
  },

  /**
   * 地区区发生变化的事件
   */
  regionchange(e) { 
    var self = this;

    var actionType = e.type;
    var actionCause = e.causedBy;
    if (actionType == 'end' && (actionCause == 'drag' || actionCause == 'scale')){
      //刷新地图标记
      self.refreshMapMarkers();
    }
  },

  /**
   * 点击地图中的图标
   */
  markertap(e) {
    var hotelId = e.markerId;
    var self = this;
    var app = getApp();
    var signature = app.getSign();
    //根据酒店ID查询酒店详情
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/service/queryhotelbyID',
      data: {
        hotelId: hotelId,
        sign: signature
      },
      success: function(res){
        var d = res.data[0];
        self.setData({
          SHOW_BOX: 1,
          HOTEL_ADDRESS: d.HOTEL_ADDR,
          HOTEL_PRICE: d.BASIC_PRICE,
          HOTEL_PHONE: d.HOTEL_PHONE,
          HOTEL_NAME: d.HOTEL_NAME,
          HOTEL_IMG: d.IMG_SRC,
          HOTEL_LATITUDE: d.LATITUDE,
          HOTEL_LONGITUDE: d.LONGITUDE
        });
      }
    });
    console.log('markertap>>>>>>>>>>>>>>'+hotelId)
  },

/**
 * 导航按钮点击
 */
navigateTo: function(){
  var that = this;
  wx.getLocation({//获取当前经纬度
    type: 'wgs84', //返回可以用于wx.openLocation的经纬度，官方提示bug: iOS 6.3.30 type 参数不生效，只会返回 wgs84 类型的坐标信息  
    success: function (res) {
      var lat = Number(that.data.HOTEL_LATITUDE);
      var lon = Number(that.data.HOTEL_LONGITUDE);
      wx.openLocation({//​使用微信内置地图查看位置
        latitude: lat,//要去的纬度-地址
        longitude: lon,//要去的经度-地址
        name: that.data.HOTEL_NAME,
        address: that.data.HOTEL_ADDR
      })
    }
  })
},

  /**
   * 重新获取区域信息并刷新地图图标
   */
  refreshMapMarkers: function () {
    let mapCtx = wx.createMapContext("map");
    var app = getApp();
    var self = this;
    //查询地图区域
    mapCtx.getRegion({
      success(res) {
        var signature = app.getSign();
        //query hotel list and get location data for rendering in map
        wx.request({
          url: 'https://www.southtradeservice.com/hotel/rest/service/queryall',
          data: {
            nlat: res.northeast.latitude,
            slat: res.southwest.latitude,
            elon: res.northeast.longitude,
            wlon: res.southwest.longitude,
            sign: signature
          },
          //get hotel list and construts markers list for map
          success: function (res) {
            self.constructMarkers(res.data);
          },
          //如果查询失败的话，在页面显示错误,TBC
          fail: function (res) {

          }
        });
      }
    });
  },

  sleep: function(numberMillis) {    
    var now = new Date();    
    var exitTime = now.getTime() + numberMillis;   
    while (true) { 
      now = new Date();       
      if (now.getTime() > exitTime) 
      return;    
    } 
  },


  onUnload: function(options){

  },

  onHide: function(options){
    var self = this;
    self.onUnload();
  },

  onShow: function(options){
    var self = this;
    var app = getApp();
    if (!app.globalData.POSITION){
      wx.getLocation({
        type: 'wgs84',
        success(res) {
          console.log(res);
          self.setData({
            "currentlatitude": res.latitude,
            "currentlongitude": res.longitude
          });
        }
      })
    } 
  },

   /**
   * 生命周期函数--监听页面加载
   * 一共有三种方式打开首页
   * 1. 扫描二维码 origin = '' 但是q参数不为空
   * 2. 直接打开小程序 origin = '' q参数为空
   * 3. 程序内跳转 origin = 'inner'
   */
  onLoad: function (options) {
    
    var self = this
    self.refreshMapMarkers();
    var app = getApp()
    var signature = app.getSign();
    var fromWhere = options.origin? options.origin: "";   
    var roomId = '0000';
    var hotelId = '00000';
    var q = options.q? options.q: "";
    
    console.log(">>>>>>>>>>>>>>>"+q);

    var loginOpenId = "";
    self.setData({
      height: app.globalData.systeminfo.windowHeight
    })

    wx.getSetting({
      success(res) {
        //validate user information permission
        if (res.authSetting['scope.userInfo']) {
          wx.getUserInfo({
            success: function (res) {
              console.log(res);
              app.globalData.USER_DATA = res.userInfo;
              wx.setStorageSync("USER_DATA", res.userInfo);
            }
          })

          // 登录
          wx.login({
            success: function (res) {
              if (res.code) {
                //发起网络请求
                wx.request({
                  url: 'https://www.southtradeservice.com/hotel/rest/wechat/login',
                  data: {
                    code: res.code,
                    sign: signature
                  },
                  success: function (r) {
                    console.log("initiating app and get openid=" + r.data.openid);
                    app.globalData.openid = r.data.openid;
                    loginOpenId = r.data.openid;
                    wx.setStorageSync("OPEN_ID", r.data.openid);

                    // 如果小程序直接打开
                    if (fromWhere == '' && q == "") {
                      roomId = '-1';
                    }
                    // 如果是程序内跳转
                    else if (fromWhere == 'inner') {
                      return;
                    }
                    // 如果是通过扫描二维码打开
                    else if (q != null && q != "") {
                      let urlStr = decodeURIComponent(q);
                      var splits1 = urlStr.split("=");
                      var roomIdandHotelId = splits1[1];
                      var splits2 = roomIdandHotelId.split("A");
                      roomId = splits2[1];
                      hotelId = splits2[0];
                    }

                    self.initIndexPage(roomId, hotelId, loginOpenId, signature);
                  }
                })
              } else {
                console.log('登录失败！' + res.errMsg)
              }
            }
          })
        }
        else {
          wx.navigateTo({
            url: '../auth/auth'
          })
        }
      }
    })




    
    

    
    
  },

  updatelocation: function(){
    var app = getApp();
    wx.getLocation({
      type: 'wgs84',
      success(res) {
        var position = { LATITUDE: res.latitude, LONGITUDE: res.longitude };
        app.globalData.POSITION = position;
        console.log(app.globalData.POSITION);
      }
    })
  },

  /**
   * 从查询结果组装markers 
   */
  constructMarkers: function(datas){
    var self = this;
    var markers = [];
    var points = [];
    for (var i = 0; i<datas.length; i++){
      var d = datas[i];
      var o = {};
      o.iconPath = '/image/index/fenzu3_2.png';
      o.latitude = d.LATITUDE;
      o.longitude = d.LONGITUDE;
      o.id = d.HOTEL_ID;
      o.width = 30;
      o.height = 30;
      markers.push(o);
    }
    self.setData({
      markers: markers
    });
  },

  myOrder: function(e){
    console.log(e);
    wx.redirectTo({
      url: '../my/my'
    });
  },

  /**
   * scan the QR code in the door
   */
  scanQROpenDoor: function(e){
 
    var app = getApp();
    var signature = app.getSign();
    var self = this;
    var loginOpenId = wx.getStorageSync('OPEN_ID');
 
    wx.scanCode({
      onlyFromCamera: true,
      scanType: 'qrCode',
      success(res) {
        var urlStr = res.result;
        var splits1 = urlStr.split("=");
        var roomIdandHotelId = splits1[1];
        var splits2 = roomIdandHotelId.split("A");
        var roomId = splits2[1];
        var hotelId = splits2[0];
      
        self.initIndexPage(roomId, hotelId, loginOpenId, signature);
      }
    });
  },

  /**
   * 解析二维码得到的url，得到roomId
   */
  parseRoomId: function(url){
    var splits = url.split('/');
    var hotelId = splits[splits.length - 1];
    return hotelId;
  },

  callService: function () {
    var app = getApp();
    var self = this;
    var mobile = self.data.HOTEL_PHONE;
    if (mobile != "") {
      wx.makePhoneCall({
        phoneNumber: mobile
      })
    }
  },

  initIndexPage: function(roomId, hotelId, loginOpenId, signature){
    var app = getApp();
    var self = this;
    wx.request({
      url: 'https://www.southtradeservice.com/hotel/rest/service/room',
      data: {
        type: 'client',
        openid: loginOpenId,
        sign: signature
      },
      success: function (res) {
        var data = res.data;

        // 用户有房间，并且已经到期
        if (data.RESULT_CODE != null && data.RESULT_CODE == 11) {
          console.log('------11-------');
          app.globalData.ROOM_DATA = res.data.CONTENT[0];
          var myRoomId = res.data.CONTENT[0].ROOM_ID;
          //如果是直接打开小程序的话
          if (roomId == '-1'){
            console.log('------22-------');
            wx.redirectTo({
              url: '../expire/expire'
            });
            return;
          }
          //房号相同
          if (roomId == myRoomId){
            console.log('------22-------');
            wx.redirectTo({
              url: '../expire/expire'
            });
            return;
          }
          //房号不相同
          else{
            console.log('------33-------');
            wx.showModal({
              title: '提示',
              content: '您的房间号是' + res.data.CONTENT[0].ROOM_NO,
              showCancel: false,
              success(res){
                if (res.confirm){
                  wx.redirectTo({
                    url: '../expire/expire'
                  });
                  return;
                }
              }
            });
          } 
        }
        // 该用户有房间，并且房间在有效期内
        else if (data.RESULT_CODE == null) {
          app.globalData.ROOM_DATA = res.data[0];
          console.log('------55-------');
          console.log(res);
          

          var myRoomId = res.data[0].ROOM_ID;
          // wx.showModal({
          //   title: '提示',
          //   content: myRoomId + '|' + roomId,
          //   showCancel: false
          // });
          //如果是直接打开小程序的话
          if (roomId == '-1'){
            console.log('------22-------');
            wx.redirectTo({
              url: '../my/my'
            });
            return;
          }
          //如果刚好预定的房间就是扫描的房间，因为房间在有效期，则跳转到开锁界面
          else if (roomId == myRoomId){
            console.log('------66-------');
            wx.redirectTo({
              url: '../my/my'
            });
            return;
          }
          //如果预定的房间不是同一个则提示用户预定的房间号，并且直接跳转到首页
          else if (roomId != myRoomId){
            console.log('------77-------');
            wx.showModal({
              title: '提示',
              content: '您入住的房间号是' + res.data[0].ROOM_NO,
              showCancel: false
            });
          }
        }
        // 用户没有订任何房间
        else if (data.RESULT_CODE != null && data.RESULT_CODE == 10) {
          console.log('--------no room booked-----------------');
          console.log('--------' + loginOpenId);
          console.log('--------'+roomId);
          //查询客户注册信息
          wx.request({
            url: 'https://www.southtradeservice.com/hotel/rest/service/cust',
            data: {
              type: 'openid',
              openid: loginOpenId,
              sign: signature
            },
            success: function(res){
              app.globalData.CUST_DATA = res.data[0];
              //如果没有注册，跳转到欢迎界面
              var result = res.data.RESULT_CODE;
              console.log('--------' + result);
              if (result != null){
                wx.redirectTo({
                  url: '../reg/reg'
                })
                return;
              }
              //如果已经注册
              else{
                
                // 如果是直接打开小程序，room = -1, 则直接打开首页
                if (roomId == '-1'){
                  // wx.redirectTo({
                  //   url: '../index/index?origin=inner'
                  // });
                  // return;
                  
                  return;
                }
                if (roomId == '0'){
                  // 如果扫描的二维码是大厅的二维码，则推荐空闲房间并且跳转到首页

                    //查询空闲的房间
                    wx.request({
                      url: 'https://www.southtradeservice.com/hotel/rest/service/validrooms',
                      data: {
                        hotelId: hotelId,
                        sign: signature
                      },
                      success: function(res){
                        var size = res.data.length;
                        if (size == 0){
                          wx.showModal({
                            title: '提示',
                            content: '该酒店所有自助房间已经满了，请更换其他朝月自助酒店',
                            showCancel: false
                          });
                          return;
                        } else {
                          var randomNum = Math.random() * size;
                          var idx = Math.floor(randomNum);
                          var randomRoom = res.data[idx].ROOM_NO;
                          //如果是大厅的二维码，则提示推荐房间，但不提示房间已经有人入住
                          if (roomId == '0'){
                            wx.showModal({
                              title: '提示',
                              content: '推荐入住空闲房间： '+ randomRoom,
                              showCancel: false
                            });
                            return;
                          }
                          //如果是房间的二维码，则提示推荐房间
                          else if (roomId != '0' && roomId!='0000') {
                            wx.showModal({
                              title: '该房间已经有人入住',
                              content: '推荐入住空闲房间： '+ randomRoom,
                              showCancel: false
                            });
                            return;
                          }
                          
                        } 
                      }
                    });
                  
                }
                else if (roomId != '0000' && roomId != '' && roomId !='0'){
                  wx.request({
                    url: 'https://www.southtradeservice.com/hotel/rest/service/room',
                    data: {
                      type: 'id',
                      roomid: roomId,
                      sign: signature
                    },
                    success: function(res){
                      console.log(res);
                      app.globalData.ROOM_DATA = res.data;
                      var roomOpenId = res.data.OPEN_ID;
                      // 如果并且扫描的房间有人在住,则推荐空闲房间并且跳转到首页
                      if (roomOpenId != null && roomOpenId != ""){
                        //查询空闲的房间
                        wx.request({
                          url: 'https://www.southtradeservice.com/hotel/rest/service/validrooms',
                          data: {
                            hotelId: hotelId,
                            sign: signature
                          },
                          success: function(res){
                            var size = res.data.length;
                            if (size == 0){
                              wx.showModal({
                                title: '提示',
                                content: '该酒店所有自助房间已经满了，请更换其他朝月自助酒店',
                                showCancel: false
                              });
                              return;
                            } else {
                              var randomRoom = res.data[0].ROOM_NO;
                              //如果是大厅的二维码，则提示推荐房间，但不提示房间已经有人入住
                              if (roomId == '0'){
                                wx.showModal({
                                  title: '提示',
                                  content: '推荐入住空闲房间： '+ randomRoom,
                                  showCancel: false
                                });
                                return;
                              }
                              //如果是房间的二维码，则提示推荐房间
                              else {
                                wx.showModal({
                                  title: '该房间已经有人入住',
                                  content: '推荐入住空闲房间： '+ randomRoom,
                                  showCancel: false
                                });
                                return;
                              }
                            } 
                          }
                        });
                      }
                      //当前房间是空的,则跳转到入住办理界面
                      else {
                        wx.redirectTo({
                          url: '../checkIn/checkIn?origin=scan'
                        });
                      }
                    }
                  });
                }                
              }    
            }
          });
        }
      }
    });
  },

  /**
   * navigate to destination
   */
  navigateToDest: function(e){

  },

  redirectToMy: function(){
    wx.redirectTo({
      url: '../my/my'
    });
  },

  myLocation: function(){
    var self = this;
    var app = getApp();

    wx.getLocation({
      type: 'wgs84',
      success(res) {
        console.log(res);
        self.setData({
          "currentlatitude": res.latitude,
          "currentlongitude": res.longitude
        });
        self.refreshMapMarkers();
      }
    })
  },

  controltap: function () {
    let mpCtx = wx.createMapContext("map");
    mpCtx.moveToLocation();
    
  },
  hideMap: function () {
    let mpCtx = wx.createMapContext("map");
    mpCtx.moveToLocation();
    this.setData({
      showBox: 0
    })
  },

  touchstart: function(e){
    var self = this;
    self.setData({
      startpoint: [e.touches[0].pageX, e.touches[0].pageY]
    });
   
  },

  touchend: function(e){
    var self = this;
    var currentPoint = [e.changedTouches[0].pageX, e.changedTouches[0].pageY];
 
    var startPoint = self.data.startpoint;
    if (currentPoint[1]<startPoint[1]){
      self.setData({
        SHOW_BOX:0
      });
    }
  }

})
