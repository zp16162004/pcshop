//index.js
//获取应用实例
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp()

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    gdata:app.globalData,
    rows_notice:[],
    rows_category:[],
    rows_detail_category:[],//底层分类
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onReady:function()
  {
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    console.log(this.data.systeminfo);
    console.log(this.data.menu_rect);
    this.setData(
      this.data
    );
  },
  onLoad: function () {
    console.log(this.data.gdata);
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShow:function()
  {
    //获取系统参数
    this.get_config();
    //获取商城动态
    this.get_notice()
    //获取分类信息
    this.get_category();
    //获取首页商品，精品，热门，新品，促销，
    this.get_home();
  },
  get_home:function()
  {
    var thiss=this;
    pcapi.get_home(
      function(res)
      {
        console.log(res.data);
        thiss.setData(
          {
            rows_hot:res.data.rows_hot,
            rows_new:res.data.rows_new,
            rows_promotion:res.data.rows_promotion,
            rows_good:res.data.rows_good,
          }
        );
      }
    );
  },
  get_category:function()
  {
    var thiss=this;
    pcapi.get_category(
      function(res)
      {
        console.log("get_category");
        console.log(res);
        var rows_detail_category=new Array();
        for(var i=0;i<res.data.data.length;i++)
        {
          var row_category=res.data.data[i];
          rows_detail_category=rows_detail_category.concat(row_category.rows_child_category);
        }
        thiss.setData(
          {
            rows_category:res.data.data,
            rows_detail_category:rows_detail_category,
          }
        );
      }
    );
  },
  get_notice:function()
  {
    var thiss=this;
    pcapi.get_notice(5,
      function(res)
      {
        thiss.setData(
          {
            rows_notice:res.data.data,
          }
        );
      }
    );
  },
  get_config:function()
  {
    var thiss=this;
    pcapi.get_config("",
      function(res)
      {
        thiss.setData(
          {
            config:res.data.data,
          }
        );
        console.log(thiss.data.config);
      }
    );
  },
  goto_product:function(e)
  {
    console.log(e);
    var id=e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/product/product?id='+id,
    })
  },
  goto_activity_group:function()
  {
    wx.navigateTo({
      url: '/pages/activity_group/activity_group',
    })
  },
  goto_activity_flash:function()
  {
    wx.navigateTo({
      url: '/pages/activity_flash/activity_flash',
    })
  },
  goto_activity_bargain:function()
  {
    wx.navigateTo({
      url: '/pages/activity_bargain/activity_bargain',
    })
  },
  goto_category:function()
  {
    wx.navigateTo({
      url: '/pages/pick_address/pick_address',
    })
  },
  goto_coupon:function()
  {
    wx.navigateTo({
      url: '/pages/coupon/coupon',
    })
  },
  goto_sign:function()
  {
    wx.navigateTo({
      url: '/pages/sign/sign',
    })
  },
})
