// pages/couponlist/couponlist.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    in_order:0,
    show_login:false,
    rows_couponlist:[],
    rows_orderlist:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    if(options.in_order!=null)
    {
      thiss.setData(
        {
          in_order:parseInt(options.in_order),
        }
      );
    }
    thiss.setData(
      {
        rows_orderlist:app.globalData.rows_orderlist,
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
    if(app.globalData.row_member==null)
    {
      this.setData(
        {
          show_login:true,
        }
      );
    }
    else{
      this.get_couponlist();
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
  get_couponlist:function()
  {
    var thiss=this;
    pcapi.get_couponlist(
      app.globalData.row_member.id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              rows_couponlist:res.data.data,
            }
          );
          if(thiss.data.in_order==1)
          {
            thiss.check_orderlist();
          }
        }
        else{
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
  //判断哪些row_couponlist可以使用
  check_orderlist:function()
  {
    //
    var thiss=this;
    for(var i=0;i<thiss.data.rows_couponlist.length;i++)
    {
      var row_couponlist=thiss.data.rows_couponlist[i];
      var type=parseInt(row_couponlist.row_coupon.type);
      console.log("type:"+type);
      if(type==0)
      {
        //通用券
        //获取总金额
        var all_money=0;
        for(var j=0;j<thiss.data.rows_orderlist.length;j++)
        {
          var row_orderlist=thiss.data.rows_orderlist[j];
          all_money+=(parseFloat(row_orderlist.price)*parseInt(row_orderlist.number));
        }
        if(all_money>=parseFloat(row_couponlist.row_coupon.limit))
        {
          thiss.data.rows_couponlist[i].can_use=1;
        }
        else{
          thiss.data.rows_couponlist[i].can_use=0;
        }
        console.log(all_money);
      }
      else if(type==1)
      {
        //品类券
        //获取总金额
        var all_money=0;
        var row_id=row_couponlist.row_coupon['ids'].split(',');
        for(var j=0;j<thiss.data.rows_orderlist.length;j++)
        {
          var row_orderlist=thiss.data.rows_orderlist[j];
          console.log(thiss.data.rows_orderlist);
          console.log((parseFloat(row_orderlist.price)*parseInt(row_orderlist.number)));
          if(row_id.indexOf(row_orderlist.category_id)>=0)
          {
            all_money+=(parseFloat(row_orderlist.price)*parseInt(row_orderlist.number));
          }
        }
        if(all_money>=parseFloat(row_couponlist.row_coupon.limit))
        {
          thiss.data.rows_couponlist[i].can_use=1;
        }
        else{
          thiss.data.rows_couponlist[i].can_use=0;
        }
        console.log(all_money);
      }
      else if(type==2)
      {
        //商品券
        var all_money=0;
        var row_id=row_couponlist.row_coupon['ids'].split(',');
        for(var j=0;j<thiss.data.rows_orderlist.length;j++)
        {
          var row_orderlist=thiss.data.rows_orderlist[j];
          if(row_id.indexOf(row_orderlist.product_id)>=0)
          {
            all_money+=(parseFloat(row_orderlist.price)*parseInt(row_orderlist.number));
          }
        }
        if(all_money>=parseFloat(row_couponlist.row_coupon.limit))
        {
          thiss.data.rows_couponlist[i].can_use=1;
        }
        else{
          thiss.data.rows_couponlist[i].can_use=0;
        }
        console.log(all_money);
      }
    }
    thiss.setData(
      {
        rows_couponlist:thiss.data.rows_couponlist,
      }
    );
  },
  do_select:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    var row_couponlist=thiss.data.rows_couponlist[index];
    let pages = getCurrentPages();
    let prevPage = pages[pages.length - 2];
    prevPage.setData({
      row_couponlist:row_couponlist,
    })
    prevPage.ini_price();
    wx.navigateBack({
          delta: 1,
    })
  },
})