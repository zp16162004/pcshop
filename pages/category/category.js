// pages/category/category.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows_category:[],
    selected_index:0,
    scroll_right_id:"",
    right_empty_height:0,
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
    this.get_category();
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
  get_category:function()
  {
    var thiss=this;
    pcapi.get_category(
      function(res)
      {
        thiss.setData(
          {
            rows_category:res.data.data,
          }
        );
        //计算右侧下方空白区域的高度
        var last_child_count=thiss.data.rows_category[thiss.data.rows_category.length-1].rows_child_category.length;
        var line_count=last_child_count%3>0?Math.floor(last_child_count/3)+1:Math.floor(last_child_count/3);
        var last_height=util.rpx2px(line_count*160+40,thiss.data.systeminfo);
        var right_height=thiss.data.systeminfo.windowHeight-thiss.data.menu_rect.height-10;
        console.log(right_height+":"+last_height);
        thiss.setData(
          {
            right_empty_height:right_height-last_height,
          }
        );
        console.log(thiss.data.rows_category);    
      }
    );
  },
  goto_product_list:function(event)
  {
    console.log(event);
    var id=event.currentTarget.dataset.id;
    console.log(id);
    wx.navigateTo({
      url: '/pages/product_list/product_list?id='+id,
    })
  },
  click_left:function(e)
  {
    var id=e.currentTarget.dataset.id;
    console.log("category_"+id);
    this.setData(
      {
        scroll_right_id:"category_"+id,
      }
    );
  },
  scroll_right:function(e)
  {
    var thiss=this;
    console.log(e);
    var top=e.detail.scrollTop+1;
    var all_height=0;
    var index=0;
    for(var i=0;i<thiss.data.rows_category.length;i++)
    {
      var last_child_count=thiss.data.rows_category[i].rows_child_category.length;
      var line_count=last_child_count%3>0?Math.floor(last_child_count/3)+1:Math.floor(last_child_count/3);
      var line_height=util.rpx2px(line_count*160+40,thiss.data.systeminfo);
      all_height+=line_height;
      if(top<all_height)
      {
        index=i;
        i=thiss.data.rows_category.length;
      }
    }
    thiss.setData(
      {
        selected_index:index,
      }
    );
  },
  change_keyword:function(e)
  {
    console.log(e);
    wx.navigateTo({
      url: '/pages/product_list/product_list?name='+e.detail.value,
    })
  }
})