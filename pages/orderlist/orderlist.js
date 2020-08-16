// pages/orderlist/orderlist.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_login:false,
    state:0,//
    row_member:null,
    p:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.state!=null)
    {
      this.setData(
        {
          state:parseInt(options.state),
        }
      );
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
                thiss.get_order();
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
    thiss.get_order();
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

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
        thiss.get_order();
      }
    );
  },
  change_state:function(e)
  {
    var state=e.currentTarget.dataset.state;
    var thiss=this;
    thiss.setData(
      {
        p:1,
        state:state,
      }
    );
    thiss.get_order();
  },
  get_order:function()
  {
    var thiss=this;
    pcapi.get_order(
      thiss.data.row_member.id,
      thiss.data.state,
      thiss.data.p,
      function(res)
      {
        console.log(res);
        if(res.data.code==1)
        {
          if(thiss.data.p==1)
          {
            thiss.setData(
              {
                rows_order:res.data.data,
              }
            );
          }
          else
          {
            thiss.setData(
              {
                rows_order:thiss.data.rows_order.concat(res.data.data),
              }
            );
          }
        }
        else
        {
          util.show_model(res.data.msg);
        }
      }
    );
  },
})