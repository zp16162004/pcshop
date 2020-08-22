// pages/refund/refund.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_login:false,
    domain:'',
    orderrefund_id:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    var thiss=this;
    if(options.orderrefund_id!=null)
    {
      thiss.setData(
        {
          orderrefund_id:options.orderrefund_id,
        }
      );
    }
    thiss.setData(
      {
        domain:app.globalData.domain,
      }
    );
    if(app.globalData.row_member==null)
    {
      this.setData(
        {
          show_login:true,
        }
      );
    }
    else{
      this.refresh_member();
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
                thiss.setData(
                  {
                    p:1,
                    row_member:res.data.data,
                  }
                );
                thiss.get_orderrefund_detail();
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
  refresh_member:function()
  {
    var thiss=this;
    pcapi.refresh_member(
      function(res)
      {
        console.log(res);
        thiss.setData(
          {
            p:1,
            row_member:res.data.data,
          }
        );
        thiss.get_orderrefund_detail();
      }
    );
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
  get_orderrefund_detail:function()
  {
    var thiss=this;
    pcapi.get_orderrefund_detail(
      thiss.data.orderrefund_id,
      function(res)
      {
        if(res.data.code==1)
        {
            thiss.setData(
              {
                row_orderrefund:res.data.data,
              }
            );
        }
        else{
          util.show_model(res.data.msg);
        }
      }
    );
  },
})