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
    show_pay_way:false,
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
  cancel_order:function(e)
  {
    var order_id=e.currentTarget.dataset.id;
    var thiss=this;
    pcapi.change_order_state(
      thiss.data.row_member.id,
      order_id,
      9,
      function(res)
      {
        if(res.data.code==0)
        {
          util.show_model(res.data.msg);
        }
        else{
          if(res.data.ids_template!=null)
          {
            util.apply_template(thiss.data.systeminfo,res.data.ids_template,
              function()
              {
                console.log("请求权限完成");
                wx.showToast({
                  title: res.data.msg,
                });
                thiss.refresh_member();
                thiss.get_order();
              }
            );
          }
          else
          {
            wx.showToast({
              title: res.data.msg,
            });
            thiss.refresh_member();
            thiss.get_order();
          }
        }
      }
    );
  },
  pay_order:function(e)
  {
    var order_id=e.currentTarget.dataset.id;
    var thiss=this;
    thiss.setData(
      {
        order_id:order_id,
        show_pay_way:true,
      }
    );
    // thiss.get_prepay_id();
  },
  do_pay:function(e)
  {
    var thiss=this;
    thiss.setData(
      {
        show_pay_way:false,
      }
    );
    if(e.detail.code==1)
    {
      var pay_type=parseInt(e.detail.pay_type);
      if(pay_type==0)
      {
        thiss.get_prepay_id();
      }
      else
      {
        thiss.pay_with_money();//使用余额支付
      }
    }
  },
  view_order:function(e)
  {
    var order_id=e.currentTarget.dataset.id;
    var thiss=this;
    wx.navigateTo({
      url: '/pages/order/order?order_id='+order_id,
    })
  },
  get_prepay_id:function()
  {
    var thiss=this;
    pcapi.get_prepay_id(
      thiss.data.order_id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              prepay_id:res.data.prepay_id,
              nonceStr:res.data.nonceStr,
              timeStamp:res.data.timeStamp,
              sign:res.data.sign,
            }
          );
          thiss.to_pay();
        }
        else{
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
  //去付款
  to_pay:function()
  {
    var thiss=this;
    pcapi.do_pay(
      thiss.data.nonceStr,
      thiss.data.prepay_id,
      thiss.data.timeStamp,
      thiss.data.sign,
      function(res)
      {
        console.log(res);
      },
      function(res)
      {
        console.log(res);
      },
      function(res)
      {
        //获取订单状态
        thiss.get_order();
      }
    );
  },
  pay_with_money:function()
  {
    var thiss=this;
    pcapi.pay_with_money(
      thiss.data.row_member.id,
      thiss.data.order_id,
      function(res)
      {
        if(res.data.code==1)
        {
          if(res.data.ids_template!=null)
          {
            util.apply_template(thiss.data.systeminfo,res.data.ids_template,
              function()
              {
                console.log("请求权限完成");
                wx.showToast({
                  title: res.data.msg,
                })
                thiss.setData(
                  {
                    p:1,
                  }
                );
                thiss.get_order();
              }
            );
          }
          else
          {
            wx.showToast({
              title: res.data.msg,
            })
            thiss.setData(
              {
                p:1,
              }
            );
            thiss.get_order();
          }
        }
        else{
          util.show_model(res.data.msg);
        }
      }
    );
  }
})