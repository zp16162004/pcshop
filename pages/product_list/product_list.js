// pages/product_list/product_list.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    name:"",
    p:1,
    sort_price:0,
    sort_sale:0,
    is_new:0,
    view_type:0,//0:列表 1：网格
    rows_product:[],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id;
    if(id!=null)
    {
      console.log(id);
      this.setData(
        {
          id:id,
        }
      );
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    wx.getSystemInfo({
      success: (result) => {
        console.log(result);
        this.data.systeminfo=result;
      },
    });
    this.data.menu_rect=wx.getMenuButtonBoundingClientRect();
    this.setData(
      this.data
    );
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    //获取分类信息
    this.get_category_by_id(this.data.id);
    //获取商品信息
    this.get_product();
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
  get_product:function()
  {
    //
    var thiss=this;
    pcapi.get_product(
      thiss.data.id,
      thiss.data.name,
      thiss.data.p,
      thiss.data.sort_price,
      thiss.data.sort_sale,
      thiss.data.is_new,
      function(res)
      {
        if(thiss.data.p==1)
        {
          thiss.setData(
            {
              rows_product:res.data.data,
            }
          );
        }
        else
        {
          thiss.setData(
            {
              rows_product:thiss.data.rows_product.concat(res.data.data),
            }
          );
        }
        console.log(thiss.data.rows_product);
      }
    );
  },
  get_category_by_id:function()
  {
    var thiss=this;
    if(thiss.data.id==0)
    {
      var row_category=new Object();
      row_category.name="全部";
      thiss.setData(
        {
          row_category:row_category,
        }
      );
    }
    else
    {
      pcapi.get_category_by_id(
        thiss.data.id,
        function(res)
        {
          thiss.setData(
            {
              row_category:res.data.data,
            }
          );
        }
      );
    }
  },
  goto_product:function(e)
  {
    var id=e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/product/product?id='+id,
    })
  },
  change_view_type:function()
  {
    var thiss=this;
    if(thiss.data.view_type==0)
    {
      thiss.data.view_type=1;
    }
    else{
      thiss.data.view_type=0;
    }
    thiss.setData(
      thiss.data
    );
  },
  change_name:function(e)
  {
    var thiss=this;
    console.log(e);
    var val=e.detail.value;
    thiss.setData(
      {
      name:val,
      p:1,
      }
    );
    thiss.get_product();
  },
  change_is_new:function()
  {
    var thiss=this;
    if(thiss.data.is_new==0)
    {
      thiss.data.is_new=1;
    }
    else
    {
      thiss.data.is_new=0;
    }
    thiss.data.p=1;
    thiss.setData(
      thiss.data
    );
    thiss.get_product();
  },
  change_sort_price:function()
  {
    var thiss=this;
    if(thiss.data.sort_price==0)
    {
      thiss.data.sort_price=1;
    }
    else if(thiss.data.sort_price==1)
    {
      thiss.data.sort_price=-1;
    }
    else
    {
      thiss.data.sort_price=0;
    }
    thiss.data.p=1;
    thiss.setData(
      thiss.data
    );
    thiss.get_product();
  },
  change_sort_sale:function()
  {
    var thiss=this;
    if(thiss.data.sort_sale==0)
    {
      thiss.data.sort_sale=1;
    }
    else if(thiss.data.sort_sale==1)
    {
      thiss.data.sort_sale=-1;
    }
    else
    {
      thiss.data.sort_sale=0;
    }
    thiss.data.p=1;
    thiss.setData(
      thiss.data
    );
    thiss.get_product();
  },
})