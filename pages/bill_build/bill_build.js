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
    all_number:0,
    deliver_type:0,
    all_money:0,//商品总金额
    diliver_money:0,//运费
    integral:0,//花费积分
    integral_discount:0,//积分抵扣
    coupon_discount:0,//优惠券优惠
    need_pay:0,//需要支付
    row_address:null,
    row_shop:null,
    row_couponlist:null,
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
    var all_number=0;
    for(var i=0;i<thiss.data.rows_orderlist.length;i++)
    {
      all_number+=thiss.data.rows_orderlist[i].number;
      thiss.get_orderlist_info(i);
    }
    thiss.setData(
      {
        all_number:all_number,
      }
    );
    //获取收货地址
    thiss.get_address();
    //获取门店地址
    thiss.get_shop();
    //刷新用户信息
    thiss.refresh_member();
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
          //计算价格
          thiss.ini_price();
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
            thiss.ini_price();
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
          thiss.ini_price();
        }
      }
    );
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
            row_member:res.data.data,
          }
        );
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
    console.log(this.data);
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
    thiss.ini_price();
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
  pick_couponlist:function()
  {
    wx.navigateTo({
      url: '/pages/couponlist/couponlist?in_order=1',
    })
  },
  //获取到优惠券
  get_couponlist:function()
  {
    //
    var thiss=this;
    var row_couponlist=thiss.data.row_couponlist;
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
        thiss.data.row_couponlist.can_use=1;
      }
      else{
        thiss.data.row_couponlist.can_use=0;
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
        thiss.data.row_couponlist.can_use=1;
      }
      else{
        thiss.data.row_couponlist.can_use=0;
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
        thiss.data.row_couponlist.can_use=1;
      }
      else{
        thiss.data.row_couponlist.can_use=0;
      }
      console.log(all_money);
    }
    thiss.setData(
    {
      row_couponlist:row_couponlist,
    }
    );
    //计算价格信息
  },
  ini_price:function()
  {
    //
    var thiss=this;
    console.log('ini_price');
    //计算商品总金额
    var all_money=0;
    for(var i=0;i<thiss.data.rows_orderlist;i++)
    {
      var row_orderlist=thiss.data.rows_orderlist[i];
      if(row_orderlist.row_productspec!=null)
      {
        all_money+=(parseFloat(row_orderlist.row_productspec.price)*parseInt(row_orderlist.number));
      }
    }
    //计算运费
    var deliver_money=0;
    for(var i=0;i<thiss.data.rows_orderlist;i++)
    {
      var row_orderlist=thiss.data.rows_orderlist[i];
      if(row_orderlist.row_productspec!=null&&thiss.row_address!=null)
      {
        orderlist_money=(parseFloat(row_orderlist.row_productspec.price)*parseInt(row_orderlist.number));
      }
    }
    //计算积分抵扣
    //计算优惠券
    //计算need_pay
  },
})