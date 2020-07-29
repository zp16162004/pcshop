// pages/product_list/product_list.js

const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id:0,
    name:"",
    p:1,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var id=options.id;
    console.log(id);
    this.setData(
      {
        id:id,
      }
    );
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
    wx.request({
      url: app.globalData.host+"/Service/get_product",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        typeid:thiss.data.id,
        name:thiss.data.name,
        p:thiss.data.p,
      },
      method:'Post',
      dataType:'json',
      success:function(res)
      {
        thiss.setData(
          {
            rows_product:res.data.data,
          }
        );
        console.log(thiss.data.rows_product);
      }
    })
  },
  goto_product:function(e)
  {
    var id=e.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/product/product?id='+id,
    })
  }
})