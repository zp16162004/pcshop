// pages/order/order.js
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
    domain:'',
    line_left:0,
    line_width:0,
    order_id:0,
    row_member:null,
    get_order_detail:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    //domain
    var thiss=this;
    thiss.data.domain=app.globalData.domain;
    thiss.setData(thiss.data);
    //窗口信息
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    console.log("menu_rect");
    console.log(this.data.menu_rect);
    if(options.order_id!=null)
    {
      thiss.setData(
        {
          order_id:options.order_id,
        }
      );
    }
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
    var thiss=this;
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
    // thiss.get_order_detail();
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
                thiss.get_order_detail();
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
        thiss.get_order_detail();
      }
    );
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
  get_order_detail:function()
  {
    var thiss=this;
    pcapi.get_order_detail(
      thiss.data.order_id,
      function(res)
      {
        console.log(res);
        if(res.data.code==1)
        {
          thiss.setData(
            {
              row_order:res.data.data,
            }
          );
          //初始化别的信息，类似line_left
          thiss.ini_extra_info();
        }
        else
        {
          util.show_model(res.data.msg);
        }
      }
    );
  },
  ini_extra_info:function()
  {
    //
    var thiss=this;
    if(parseInt(thiss.data.row_order.deliver_type)==0)
    {
      thiss.data.line_width=util.rpx2px((750/5)-40,thiss.data.systeminfo);
      thiss.data.line_left=util.rpx2px((750/10)+20,thiss.data.systeminfo);
      thiss.setData(
        {
          line_left:thiss.data.line_left,
          line_width:thiss.data.line_width,
        }
      );
    }
    else if(parseInt(thiss.data.row_order.deliver_type)==1)
    {
      thiss.data.line_width=util.rpx2px(parseInt((750/4)-40),thiss.data.systeminfo);
      thiss.data.line_left=util.rpx2px(parseInt((750/8)+20),thiss.data.systeminfo);
      thiss.setData(
        {
          line_left:thiss.data.line_left,
          line_width:thiss.data.line_width,
        }
      );
    }
  },
  cancel_order:function(e)
  {
    var thiss=this;
    pcapi.change_order_state(
      thiss.data.row_member.id,
      thiss.data.order_id,
      9,
      function(res)
      {
        if(res.data.code==0)
        {
          util.show_model(res.data.msg);
        }
        else{
          wx.showToast({
            title: res.data.msg,
          });
          thiss.get_order_detail();
        }
      }
    );
  },
  do_recieve:function()
  {
    var thiss=this;
    pcapi.change_order_state(
      thiss.data.row_member.id,
      thiss.data.order_id,
      3,
      function(res)
      {
        if(res.data.code==0)
        {
          util.show_model(res.data.msg);
        }
        else{
          wx.showToast({
            title: res.data.msg,
          });
          thiss.get_order_detail();
        }
      }
    );
  },
  copy:function(e)
  {
    var thiss=this;
    wx.setClipboardData({
      data: thiss.data.row_order.orderno,
      success:function()
      {
        wx.showToast({
          title: '订单编号复制成功',
        })
      }
    })
  },
  comment:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    console.log('/pages/add_comment/add_comment?order_id='+thiss.data.order_id+"&orderlist_id="+thiss.data.row_order.rows_orderlist[index].id);
    wx.navigateTo({
      url: '/pages/add_comment/add_comment?order_id='+thiss.data.order_id+"&orderlist_id="+thiss.data.row_order.rows_orderlist[index].id,
    })
  },
  add_orderrefund:function()
  {
    var thiss=this;
    wx.navigateTo({
      url: '/pages/add_orderrefund/add_orderrefund?order_id='+thiss.data.order_id,
    })
  },
  pay_order:function(e)
  {
    var thiss=this;
    thiss.setData(
      {
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
        thiss.get_order_detail();
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
          wx.showToast({
            title: res.data.msg,
          })
          thiss.setData(
            {
              p:1,
            }
          );
          thiss.get_order_detail();
        }
        else{
          util.show_model(res.data.msg);
        }
      }
    );
  },
  show_express_info:function()
  {
    var thiss=this;
    wx.navigateTo({
      url: '/pages/express_info/express_info?order_id='+thiss.data.row_order.id,
    })
  },
  show_order_qrcode:function()
  {
    var thiss=this;
    wx.navigateTo({
      url: '/pages/qrcode_order/qrcode_order?orderno='+thiss.data.row_order.orderno,
    })
  }
})