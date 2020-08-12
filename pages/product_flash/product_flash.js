// pages/product/product.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    show_login:false,
    row_flash:null,
    row_productspec:null,
    state:0,//0：未开始 1：进行中 2：结束
    time_hour:0,
    time_minute:0,
    time_second:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    var id=options.id;
    console.log(id);
    this.setData(
      {
        id:id,
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
    setInterval(
      function()
      {
        thiss.check_time();
      },
      1000
    )
  },
  //获取用户信息权限
  do_login:function(res)
  {
    var thiss=this;
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
                thiss.get_flash_detail();
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
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    console.log(this.data);
    this.setData(
      this.data
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.get_flash_detail();
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
  get_flash_detail:function()
  {
    //
    var thiss=this;
    pcapi.get_flash_detail(
      thiss.data.id,
      app.globalData.row_member.id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              row_flash:res.data.data,
            }
          );
          thiss.ini_row_productspec();
        }
        else
        {
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
  ini_row_productspec:function()
  {
    var thiss=this;
    if(thiss.data.row_flash.productspec_ids=="0")
    {
      var row_productspec=thiss.data.row_flash.row_product;
      row_productspec.id=0;
      thiss.setData(
        {
          row_productspec:row_productspec,
        }
      );
    }
    else
    {
      for(var i=0;i<thiss.data.row_flash.row_product.rows_productspec.length;i++)
      {
        var row_productspec=thiss.data.row_flash.row_product.rows_productspec[i];
        console.log(thiss.data.row_flash.rows_productspec_id);
        console.log(row_productspec.id);
        if(thiss.data.row_flash.rows_productspec_id.indexOf(row_productspec.id+"")>=0)
        {
          console.log(row_productspec);
          thiss.setData(
            {
              row_productspec:row_productspec,
            }
          );
          i=thiss.data.row_flash.row_product.rows_productspec.length;
        }
      }
    }
  },
  check_time:function()
  {
    var thiss=this;
    if(thiss.data.row_flash!=null)
    {
      var now=new Date().getTime()/1000;
      var stime=new Date(thiss.data.row_flash.stime).getTime()/1000;
      var etime=new Date(thiss.data.row_flash.etime).getTime()/1000;
      if(now<stime)
      {
        thiss.data.state=0;
        //计算
        thiss.data.time_hour=parseInt((stime-now)/3600);
        thiss.data.time_minute=parseInt((stime-now)%3600/60)>9?parseInt((stime-now)%3600/60):"0"+parseInt((stime-now)%3600/60);
        thiss.data.time_second=parseInt((stime-now)%60)>9?parseInt((stime-now)%60):"0"+parseInt((stime-now)%60);
      }
      else if(now>=stime&&now<etime)
      {
        thiss.data.state=1;
        thiss.data.time_hour=parseInt((etime-now)/3600);
        thiss.data.time_minute=parseInt((etime-now)%3600/60)>9?parseInt((etime-now)%3600/60):"0"+parseInt((etime-now)%3600/60);
        thiss.data.time_second=parseInt((etime-now)%60)>9?parseInt((etime-now)%60):"0"+parseInt((etime-now)%60);
      }
      else
      {
        thiss.data.state=2;
      }
      thiss.setData(
        {
          state:thiss.data.state,
          time_hour:thiss.data.time_hour,
          time_minute:thiss.data.time_minute,
          time_second:thiss.data.time_second,
        }
      );
    }
  },
})