// pages/bill_build/bill_build.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:[],
    rows_orderlist:app.globalData.rows_orderlist,
    deliver_type:1,
    row_address:null,
    row_shop:null,
    rows_address:null,
    rows_shop:null,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var thiss=this;
    console.log(app.globalData.rows_orderlist);
    thiss.setData(
      {
        rows_orderlist:app.globalData.rows_orderlist,
      }
    );
    //获取商品的详细信息，包含运费模板
    for(var i=0;i<thiss.data.rows_orderlist.length;i++)
    {
      thiss.get_orderlist_info(i);
    }
    //获取收货地址
    thiss.get_address();
    //获取门店地址
    thiss.get_shop();
  },
  get_orderlist_info:function(index)
  {
    var thiss=this;
    var row_orderlist=thiss.data.rows_orderlist[index];
    pcapi.get_orderlist_info(
      row_orderlist,
      function(res)
      {
        if(res.data.code==0)
        {
          util.show_model_and_back(res.data.msg);
        }
        else
        {
          thiss.data.rows_orderlist[index].row_product=res.data.row_product;
          thiss.data.rows_orderlist[index].row_productspec=res.data.row_productspec;
          thiss.data.rows_orderlist[index].row_fare=res.data.row_fare;
          thiss.setData(
            thiss.data
          );
        }
      }
    );
  },
  get_address:function()
  {
    var thiss=this;
    pcapi.get_address(
      app.globalData.row_member.id,
      function(res)
      {
        thiss.setData(
          {
            rows_address:res.data.data,
          }
        );
        //如果存在默认收货地址的话，就选中
        for(var i=0;i<thiss.data.rows_address.length;i++)
        {
          var row_address=thiss.data.rows_address[i];
          if(parseInt(row_address.is_default)==1)
          {
            thiss.setData(
              {
                row_address:row_address,
              }
            );
          }
        }
      }
    );
  },
  get_shop:function()
  {
    var thiss=this;
    pcapi.get_shop(
      function(res)
      {
        thiss.setData(
          {
            rows_shop:res.data.data,
          }
        );
        if(thiss.data.rows_shop.length>0)
        {
          thiss.setData(
            {
              row_shop:thiss.data.rows_shop[0],
            }
          );
        }
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
    wx.getSystemInfo({
      success: (result) => {
        // console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    console.log(this.data.systeminfo);
    console.log(this.data.menu_rect);
    this.setData(
      this.data
    );
    this.get_config();
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
    wx.request({
      url: app.globalData.host+"/Service/get_config",
      data:{
        config:null,
      },
      method:'Post',
      dataType:'json',
      success:function(res)
      {
        thiss.setData(
          {
            config:res.data.data,
          }
        );
        console.log(thiss.data.config);
        console.log(thiss.data.config.navigate_pic1);
      }
    })
  },
  change_deliver_type:function(e)
  {
    var thiss=this;
    console.log(e);
    thiss.setData(
      {
        deliver_type:parseInt(e.currentTarget.dataset.type),
      }
    );
  },
  pick_address:function()
  {
    wx.navigateTo({
      url: '/pages/pick_address/pick_address',
    })
  },
  pick_shop:function()
  {
    wx.navigateTo({
      url: '/pages/pick_shop/pick_shop',
    })
  },
})