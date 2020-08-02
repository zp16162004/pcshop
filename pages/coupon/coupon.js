// pages/coupon/coupon.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_login:false,
    rows_coupon:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
    if(app.globalData.row_member==null)
    {
      this.setData(
        {
          show_login:true,
        }
      );
    }
    else{
      this.get_coupon();
    }
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
  //获取用户信息权限
  do_login:function(res)
  {
    this.setData(
      {
        show_login:false,
      }
    );
    console.log(res);
    wx.login({
      success:function(res)
      {
        console.log(res.code);
        pcapi.do_login(res.code,
            function(res)
            {
              console.log(res);
              if(res.data.code==1)
              {
                app.globalData.row_member=res.data.data;
                app.save_data();
                //重新获取商品详情
                this.get_coupon();
              }
              else{
                util.show_model_and_back(res.data.msg);
              }
            }
          );
      },
      fail:function(res)
      {
        util.show_model_and_back('登录失败');
      }
    })
  },
  get_coupon:function()
  {
    var thiss=this;
    pcapi.get_coupon(
      app.globalData.row_member.id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              rows_coupon:res.data.data,
            }
          );
        }
        else{
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
  add_couponlist:function(e)
  {
    var thiss=this;
    var coupon_id=e.currentTarget.dataset.id;
    pcapi.add_couponlist(
      app.globalData.row_member.id,
      coupon_id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.get_coupon();
        }
        else
        {
          util.show_model(res.data.msg);
        }
      }
    );
  }
})