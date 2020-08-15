// pages/cart/cart.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
var md5=require("../../utils/md5.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    rows_cart:null,
    count_cart:0,
    all_money:0,
    select_all:0,
    is_editing:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
                thiss.get_cart();
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
      this.get_cart();
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
  get_cart:function()
  {
    var thiss=this;
    pcapi.get_cart(
      app.globalData.row_member.id,
      function(res)
      {
        if(res.data.code==0)
        {
          util.show_model(res.data.msg);
        }
        else{
          //设置selected
          thiss.setData(
            {
              rows_cart:res.data.data,
            }
          );
          for(var i=0;i<thiss.data.rows_cart.length;i++)
          {
            thiss.data.rows_cart[i].selected=1;
          }
          thiss.setData(
            {
              rows_cart:thiss.data.rows_cart,
            }
          );
          thiss.ini_extra_info();
        }
      }
    );
  },
  ini_extra_info:function()
  {
    //
    var thiss=this;
    var count_cart=thiss.data.rows_cart.length;
    var all_money=0;
    var select_all=1;
    for(var i=0;i<thiss.data.rows_cart.length;i++)
    {
      var row_cart=thiss.data.rows_cart[i];
      if(row_cart.selected==1)
      {
        all_money+=(parseFloat(row_cart.row_productspec.price)*parseInt(row_cart.number).toFixed(2));
      }
      else{
        select_all=0;
      }
    }
    all_money=(all_money.toFixed(2));
    thiss.setData(
      {
        count_cart:count_cart,
        all_money:all_money,
        select_all:select_all,
      }
    );
  },
  change_selected:function(e)
  {
    var index=e.currentTarget.dataset.index;
    var thiss=this;
    thiss.data.rows_cart[index].selected=thiss.data.rows_cart[index].selected==1?0:1;
    thiss.setData(
      {
        rows_cart:thiss.data.rows_cart,
      }
    );
    thiss.ini_extra_info();
  },
  change_select_all:function()
  {
    var thiss=this;
    var select_all=thiss.data.select_all;
    if(select_all==1)
    {
      for(var i=0;i<thiss.data.rows_cart.length;i++)
      {
        thiss.data.rows_cart[i].selected=0;
      }
    }
    else{
      for(var i=0;i<thiss.data.rows_cart.length;i++)
      {
        thiss.data.rows_cart[i].selected=1;
      }
    }
    thiss.setData(
      {
        rows_cart:thiss.data.rows_cart,
      }
    );
    thiss.ini_extra_info();
  },
  change_is_editing:function()
  {
    var thiss=this;
    thiss.data.is_editing=thiss.data.is_editing==1?0:1;
    thiss.setData(
      {
        is_editing:thiss.data.is_editing,
      }
    );
  },
  delete_cart:function()
  {
    var thiss=this;
    var ids="";
    for(var i=0;i<thiss.data.rows_cart.length;i++)
    {
      var row_cart=thiss.data.rows_cart[i];
      if(row_cart.selected==1)
      {
        if(ids!="")
        {
          ids+=(",");
        }
        ids+=(row_cart.id);
      }
    }
    if(ids=="")
    {
      util.show_model('请选择需要删除的商品');
    }
    else
    {
      pcapi.delete_cart(
        ids,
        function(res)
        {
          if(res.data.code==0)
          {
            util.show_model(res.data.msg);
          }
          else{
            thiss.get_cart();
          }
        }
      );
    }
  },
  add:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    console.log(thiss.data.rows_cart);
    console.log(index);
    var row_cart=thiss.data.rows_cart[index];
    var stock=parseInt(row_cart.row_productspec.stock);
    var number=parseInt(row_cart.number);
    var cart_id=row_cart.id;
    if(number+1<=stock)
    {
      number=number+1;
      //编辑cart
      thiss.edit_cart(cart_id,number);
    }
    else
    {
      util.show_model('库存不足');
    }
  },
  subduce:function(e)
  {
    var thiss=this;
    var index=parseInt(e.currentTarget.dataset.index);
    var row_cart=thiss.data.rows_cart[index];
    var stock=parseInt(row_cart.row_productspec.stock);
    var number=parseInt(row_cart.number);
    var cart_id=row_cart.id;
    if(number-1<=stock&&number-1>=1)
    {
      number=number-1;
      //编辑cart
      thiss.edit_cart(cart_id,number);
    }
    else if(number==1)
    {
      var ids=cart_id;
      pcapi.delete_cart(
        ids,
        function(res)
        {
          if(res.data.code==0)
          {
            util.show_model(res.data.msg);
          }
          else{
            thiss.get_cart();
          }
        }
      );
    }
  },
  edit_cart:function(cart_id,number)
  {
    var thiss=this;
    pcapi.edit_cart(
      cart_id,
      number,
      function(res)
      {
        if(res.data.code==0)
        {
          util.show_model(res.data.msg);
        }
        else{
          thiss.get_cart();
        }
      }
    );
  },
  build_bill:function()
  {
    var thiss=this;
    var rows_orderlist=new Array();
    for(var i=0;i<thiss.data.rows_cart.length;i++)
    {
      var row_cart=thiss.data.rows_cart[i];
      if(row_cart.selected==1)
      {
        var product_id=row_cart.product_id;
        var category_id=row_cart.row_product.category_id;
        var productspec_id=row_cart.row_productspec.id;
        var price=row_cart.row_productspec.price;
        var number=row_cart.number;
        var row_orderlist=new Object();
        row_orderlist.product_id=product_id;
        row_orderlist.category_id=category_id;
        row_orderlist.productspec_id=productspec_id;
        row_orderlist.price=price;
        row_orderlist.number=number;
        rows_orderlist.push(row_orderlist);
      }
    }
    if(rows_orderlist.length>0)
    {
      app.globalData.rows_orderlist=rows_orderlist;
      wx.navigateTo({
        url: '/pages/bill_build/bill_build',
      })
    }
    else
    {
      util.show_model('请选择商品');
    }
  },
})