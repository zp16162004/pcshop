// pages/sign/sign.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_login:false,
    row_check:null,
    count4:0,
    count3:0,
    count2:0,
    count1:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(app.globalData.row_member==null)
    {
      this.setData(
        {
          show_login:true,
        }
      );
    }
    else{
      this.get_check();
    }
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
                thiss.get_check();
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
  get_check:function()
  {
    var thiss=this;
    pcapi.get_check(
      app.globalData.row_member.id,
      7,
      7,
      function(res)
      {
        thiss.setData(
          {
            row_check:res.data.data,
          }
        );
        thiss.ini_count();
        thiss.refresh_member();
      }
    );
  },
  ini_count:function()
  {
    var thiss=this;
    var count_checklog=thiss.data.row_check.count_checklog;
    thiss.data.count4=parseInt(count_checklog/1000);
    thiss.data.count3=parseInt(count_checklog%1000/100);
    thiss.data.count2=parseInt(count_checklog%1000%100/10);
    thiss.data.count1=parseInt(count_checklog%10);
    thiss.setData(
      thiss.data
    );
  },
  refresh_member:function()
  {
    var thiss=this;
    pcapi.refresh_member(
      function(res)
      {
        console.log(res);
        thiss.setData(
          {
            row_member:res.data.data,
          }
        );
      }
    );
  },
  add_checklog:function()
  {
    
  },
})