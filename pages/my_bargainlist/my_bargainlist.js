// pages/my_bargainlist/my_bargainlist.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show_login:false,
    p:1,
    rows_bargain:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    setInterval(
      function()
      {
        thiss.check_time_to_end();
      },
      1000
    )
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
      this.get_my_bargainlist();
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
                this.get_my_bargainlist();
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
  get_my_bargainlist:function()
  {
    var thiss=this;
    pcapi.get_my_bargainlist(
      app.globalData.row_member.id,
      thiss.data.p,
      function(res)
      {
        if(res.data.code==1)
        {
          if(thiss.data.p==1)
          {
            thiss.setData(
              {
                rows_bargain:res.data.data,
              }
            );
          }
          else
          {
            thiss.setData(
              {
                rows_bargain:thiss.data.rows_bargain.concat(res.data.data),
              }
            );
          }
        }
        else{
          util.show_model_and_back(res.data.msg);
        }
      }
    );
  },
  
  check_time_to_end:function()
  {
    var thiss=this;
    for(var i=0;i<thiss.data.rows_bargain.length;i++)
    {
      var row_bargain=thiss.data.rows_bargain[i];
      var edate=new Date(row_bargain.edate).getTime()/1000;
      var now=new Date().getTime()/1000;
      var day=parseInt((edate-now)/86400);
      var hour=parseInt((edate-now)%86400/3600);
      var minute=parseInt((edate-now)%3600/60);
      var second=parseInt((edate-now)%3600%60);
      var time2end="";
      if(day>0)
      {
        time2end+=(day+"天");
      }
      if(hour>0)
      {
        time2end+=(day+"时");
      }
      if(minute>0)
      {
        time2end+=(minute+"分");
      }
      if(second>0)
      {
        time2end+=(second+"秒");
      }
      thiss.data.rows_bargain[i].time2end=time2end;
    }
    thiss.setData(
      {
        rows_bargain:thiss.data.rows_bargain,
      }
    );
  },
  
  goto_activity_bargain:function()
  {
    wx.navigateTo({
      url: '/pages/activity_bargain/activity_bargain',
    })
  },
  
  goto_product_bargain:function(res)
  {
    console.log(res);
    var thiss=this;
    var index=parseInt(res.currentTarget.dataset.index);
    var row_bargain=thiss.data.rows_bargain[index];
    wx.navigateTo({
      url: '/pages/product_bargain/product_bargain?id='+row_bargain.id+"&bargainlist_id="+row_bargain.now_row_bargainlist.id,
    })
  },
  cancel_bargainlist:function(res)
  {
    console.log(res);
    var index=parseInt(res.currentTarget.dataset.index);
    var row_bargain=thiss.data.rows_bargain[index];
    var thiss=this;
    pcapi.get_my_bargainlist(
      app.globalData.row_member.id,
      row_bargan.now_row_bargainlist.id,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              p:1,
            }
          );
          thiss.get_my_bargainlist();
        }
        else{
          util.show_model(res.data.msg);
        }
      }
    );
  }
})