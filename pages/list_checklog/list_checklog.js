// pages/list_checklog/list_checklog.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows_checklog:null,
    p:1,
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
      this.get_checklog();
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
                thiss.get_checklog();
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
    var thiss=this;
    thiss.setData(
      {
        p:thiss.data.p+1,
      }
    );
    thiss.get_checklog();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  get_checklog:function()
  {
    var thiss=this;
    pcapi.get_checklog(
      app.globalData.row_member.id,
      thiss.data.p,
      function(res)
      {
        if(thiss.data.p==1)
        {
          thiss.setData(
            {
              rows_checklog:res.data.data,
            }
          );
        }
        else
        {
          thiss.setData(
            {
              rows_checklog:thiss.data.rows_checklog.concat(res.data.data),
            }
          );
        }
      }
    );
  },
})