// pages/bill_build/bill_build.js
var util=require("../../utils/util.js");
var pcapi=require("../../utils/pcapi.js");
var md5=require("../../utils/md5.js");
const app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    config:[],
    detail_id:0,
    type:0,
    fare_id:0,
    rows_orderlist:app.globalData.rows_orderlist,
    row_bargain:null,//如果是砍价订单，完善这个
    all_number:0,
    deliver_type:0,
    all_money:0,//商品总金额
    diliver_money:0,//运费
    integral:0,//花费积分
    exchange_integral:0,
    integral_discount:0,//积分抵扣
    coupon_discount:0,//优惠券优惠
    need_pay:0,//需要支付
    pay_type:0,//0：微信支付，1：余额支付
    row_address:null,
    row_shop:null,
    row_couponlist:null,
    rows_address:null,
    rows_shop:null,
    mobile:"",
    contact:"",
    fnote:"",
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
    if(options.type!=null)
    {
      thiss.setData(
        {
          type:parseInt(options.type),
        }
      );
    }
    if(options.detail_id!=null)
    {
      thiss.setData(
        {
          detail_id:parseInt(options.detail_id),
        }
      );
    }
    if(options.fare_id!=null)
    {
      thiss.setData(
        {
          fare_id:parseInt(options.fare_id),
        }
      );
    }
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
    this.get_config();
    if(thiss.data.type==3)
    {
      //砍价订单
      thiss.get_bargainlist_detail();
    }
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
          console.log("获取orderlist_info");
          console.log(thiss.data.rows_orderlist[index]);
          thiss.setData(
            thiss.data
          );
          //计算价格
          thiss.ini_price();
        }
      }
    );
  },
  get_bargainlist_detail:function()
  {
    var thiss=this;
    pcapi.get_bargainlist_detail(
      thiss.data.detail_id,
      function(res)
      {
        if(res.data.code==0)
        {
          util.show_model_and_back(res.data.msg);
        }
        else
        {
          thiss.setData(
            {
              row_bargain:res.data.data,
            }
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
        thiss.ini_price();
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
    for(var i=0;i<thiss.data.rows_orderlist.length;i++)
    {
      var row_orderlist=thiss.data.rows_orderlist[i];
      if(row_orderlist.row_productspec!=null)
      {
        if(thiss.data.type==0)
        {
          console.log(row_orderlist.row_productspec.price);
          console.log(row_orderlist.number);
          console.log(parseFloat(row_orderlist.row_productspec.price)*parseInt(row_orderlist.number));
          all_money+=(parseFloat(row_orderlist.row_productspec.price)*parseInt(row_orderlist.number));
        }
        else
        {
          all_money+=(parseFloat(row_orderlist.price)*parseInt(row_orderlist.number));
        }
      }
    }
    thiss.setData(
      {
        all_money:all_money,
      }
    );
    //计算运费
    var deliver_money=0;
    //可积分兑换的最大金额
    var max_maybe_integral_discount=0;
    for(var i=0;i<thiss.data.rows_orderlist.length;i++)
    {
      var row_orderlist=thiss.data.rows_orderlist[i];
      var orderlist_money=0;
      var orderlist_weight=0;
      var orderlist_size=0;
      //计算总金额
      if(row_orderlist.row_productspec!=null&&thiss.row_address!=null)
      {
        if(thiss.data.type==0)
        {
          orderlist_money=(parseFloat(row_orderlist.row_productspec.price)*parseInt(row_orderlist.number));
        }
        else
        {
          orderlist_money=(parseFloat(row_orderlist.price)*parseInt(row_orderlist.number));
        }
      }
      //计算总重量
      if(row_orderlist.row_productspec!=null&&thiss.row_address!=null)
      {
        orderlist_weight=(parseFloat(row_orderlist.row_productspec.weight)*parseInt(row_orderlist.number));
      }
      // 计算总体积
      if(row_orderlist.row_productspec!=null&&thiss.row_address!=null)
      {
        orderlist_size=(parseFloat(row_orderlist.row_productspec.size)*parseInt(row_orderlist.number));
      }
      console.log(row_orderlist);
      console.log("计算邮费先决条件:"+(thiss.data.row_address!=null&&row_orderlist.row_product.row_fare!=null));
      if(thiss.data.row_address!=null&&((thiss.data.type==0&&row_orderlist.row_product.row_fare!=null)||(thiss.data.type==3&&thiss.data.row_bargain.row_fare!=null)))
      {
        console.log("开始计算邮费");
        var row_fare=null;
        if(thiss.data.type==0)
        {
          row_fare=row_orderlist.row_productspec.row_fare;
        }
        else if(thiss.data.type==3)
        {
          row_fare=thiss.data.row_bargain.row_fare;
        }
        var city_id=thiss.data.row_address.city_id;
        //首先判断保留列表
        var in_free=0;
        var in_list=0;
        if(parseInt(row_fare.has_free)==1)
        {
          console.log("存在has_free");
          var rows_farefree=row_fare.rows_farefree;
          for(var j=0;j<rows_farefree.length&&in_free==0;j++)
          {
            var row_farefree=rows_farefree[j];
            var row_city_code=row_farefree.citycodes.split(',');
            if(row_city_code.indexOf(thiss.data.row_address.row_city.code)>=0)
            {
              //所选地址在citycodes里面
              if(parseInt(row_fare.type)==1&&parseInt(row_orderlist.number)>=parseInt(row_farefree.limit)&&orderlist_money>=parseFloat(row_farefree.money))
              {
                //按照件数
                in_free=1;
                console.log("符合包邮条件");
              }
              else if(parseInt(row_fare.type)==2&&parseInt(orderlist_weight)>=parseInt(row_farefree.limit)&&orderlist_money>=parseFloat(row_farefree.money))
              {
                in_free=1;
              }
              else if(parseInt(row_fare.type)==3&&parseInt(orderlist_size)>=parseInt(row_farefree.limit)&&orderlist_money>=parseFloat(row_farefree.money))
              {
                in_free=1;
              }
            }
          }
        }
        if(row_fare.rows_farelist.length>0)
        {
          console.log("开始farelist判断：in_free="+in_free);
          if(in_free==0)
          {
            console.log("开始farelist判断");
            var rows_farelist=row_fare.rows_farelist;
            for(var j=0;j<rows_farelist.length&&in_list==0;j++)
            {
              var row_farelist=rows_farelist[j];
              var row_city_code=row_farelist.citycodes.split(',');
              if(row_city_code.indexOf(thiss.data.row_address.row_city.code)>=0)
              {
                //所选地址在citycodes里面
                if(parseInt(row_fare.type)==1)
                {
                  //按照件数
                  in_list=1;
                  var yushu=parseFloat(row_orderlist.number)-parseFloat(row_farelist.first);
                  var d_money=yushu>0?(parseFloat(row_farelist.first)+(yushu%parseFloat(row_farelist.step)>0?parseFloat(row_farelist.step_fare)*(1+parseInt(yushu/parseFloat(row_farelist.step))):parseFloat(row_farelist.step_fare)*parseInt(yushu/parseFloat(row_farelist.step)))):parseFloat(row_farelist.first);
                  deliver_money+=(d_money);
                  console.log("计算list邮费");
                }
                else if(parseInt(row_fare.type)==2)
                {
                  in_list=1;
                  var yushu=parseFloat(orderlist_weight)-parseFloat(row_farelist.first);
                  var d_money=yushu>0?(parseFloat(row_farelist.first)+(yushu%parseFloat(row_farelist.step)>0?parseFloat(row_farelist.step_fare)*(1+parseInt(yushu/parseFloat(row_farelist.step))):parseFloat(row_farelist.step_fare)*parseInt(yushu/parseFloat(row_farelist.step)))):parseFloat(row_farelist.first);
                  deliver_money+=(d_money);
                  console.log("计算list邮费");
                }
                else if(parseInt(row_fare.type)==3)
                {
                  in_list=1;
                  var yushu=parseFloat(orderlist_size)-parseFloat(row_farelist.first);
                  var d_money=yushu>0?(parseFloat(row_farelist.first)+(yushu%parseFloat(row_farelist.step)>0?parseFloat(row_farelist.step_fare)*(1+parseInt(yushu/parseFloat(row_farelist.step))):parseFloat(row_farelist.step_fare)*parseInt(yushu/parseFloat(row_farelist.step)))):parseFloat(row_farelist.first);
                  deliver_money+=(d_money);
                  console.log("计算list邮费");
                }
              }
            }
          }
        }
        if(in_free==0&&in_list==0)
        {
          var row_farelist=row_fare;
          //所选地址在citycodes里面
          if(parseInt(row_fare.type)==1)
          {
            //按照件数
            var yushu=parseFloat(row_orderlist.number)-parseFloat(row_farelist.first);
            var d_money=yushu>0?(parseFloat(row_farelist.first)+(yushu%parseFloat(row_farelist.step)>0?parseFloat(row_farelist.step_fare)*(1+parseInt(yushu/parseFloat(row_farelist.step))):parseFloat(row_farelist.step_fare)*parseInt(yushu/parseFloat(row_farelist.step)))):parseFloat(row_farelist.first);
            deliver_money+=(d_money);
          }
          else if(parseInt(row_fare.type)==2)
          {
            var yushu=parseFloat(orderlist_weight)-parseFloat(row_farelist.first);
            var d_money=yushu>0?(parseFloat(row_farelist.first)+(yushu%parseFloat(row_farelist.step)>0?parseFloat(row_farelist.step_fare)*(1+parseInt(yushu/parseFloat(row_farelist.step))):parseFloat(row_farelist.step_fare)*parseInt(yushu/parseFloat(row_farelist.step)))):parseFloat(row_farelist.first);
            deliver_money+=(d_money);
          }
          else if(parseInt(row_fare.type)==3)
          {
            var yushu=parseFloat(orderlist_size)-parseFloat(row_farelist.first);
            var d_money=yushu>0?(parseFloat(row_farelist.first)+(yushu%parseFloat(row_farelist.step)>0?parseFloat(row_farelist.step_fare)*(1+parseInt(yushu/parseFloat(row_farelist.step))):parseFloat(row_farelist.step_fare)*parseInt(yushu/parseFloat(row_farelist.step)))):parseFloat(row_farelist.first);
            deliver_money+=(d_money);
          }
        }
      }
      //计算总体积
      //计算可积分兑换的总金额
      if(row_orderlist.row_product!=null)
      {
        max_maybe_integral_discount+=(parseInt(row_orderlist.number)*parseFloat(row_orderlist.row_product.integral_discount));
      }
    }
    if(thiss.data.deliver_type==0)
    {
    thiss.setData(
      {
        deliver_money:deliver_money,
      }
    );
    }
    else
    {
      thiss.setData(
        {
          deliver_money:0,
        }
      );
    }
    //计算积分抵扣
    if(thiss.data.row_member!=null&&thiss.data.config!=null)
    {
      var max_integral_discount=(thiss.data.row_member.integral/thiss.data.config.integral_rate).toFixed(2);
      console.log("最多抵扣:"+max_integral_discount);
      if(thiss.data.exchange_integral==1)
      {
        thiss.data.integral_discount=max_integral_discount>max_maybe_integral_discount?max_maybe_integral_discount:max_integral_discount;
        thiss.data.integral=parseInt(thiss.data.integral_discount*thiss.data.config.integral_rate);
      }
      else
      {
        thiss.data.integral_discount=0;
        thiss.data.integral=0;
      }
      thiss.setData(
        {
          integral_discount:thiss.data.integral_discount,
          integral:thiss.data.integral,
        }
      );
    }
    //计算优惠券
    if(thiss.data.row_couponlist!=null)
    {
      if(thiss.data.row_couponlist.can_use==1)
      {
        thiss.data.coupon_discount=parseFloat(thiss.data.row_couponlist.discount);
      }
    }
    thiss.setData(
      {
        coupon_discount:thiss.data.coupon_discount,
      }
    );
    //计算need_pay
      var need_pay=(thiss.data.all_money+thiss.data.deliver_money-thiss.data.integral_discount-thiss.data.coupon_discount).toFixed(2);
      thiss.setData(
        {
          need_pay:need_pay,
        }
      );
  },
  change_exchange_integral:function(e)
  {
    var val=parseInt(e.currentTarget.dataset.val);
    this.setData(
      {
        exchange_integral:val,
      }
    );
    this.ini_price();
  },
  change_pay_type:function(e)
  {
    var val=parseInt(e.currentTarget.dataset.val);
    this.setData(
      {
        pay_type:val,
      }
    );
  },
  change_contact:function(e)
  {
    var thiss=this;
    thiss.setData(
      {
        contact:e.detail.value,
      }
    );
  },
  change_mobile:function(e)
  {
    var thiss=this;
    thiss.setData(
      {
        mobile:e.detail.value,
      }
    );
  },
  change_fnote:function(e)
  {
    var thiss=this;
    thiss.setData(
      {
        fnote:e.detail.value,
      }
    );
  },
  submit:function()
  {
    var thiss=this;
    //提交订单并且付款
    if(thiss.data.deliver_type==0)
    {
      //收货地址不为空
      if(thiss.data.row_address==null)
      {
        util.show_model("请选择收货地址");
        return;
      }
    }
    else if(thiss.data.deliver_type==1)
    {
      //选择门店
      if(thiss.data.row_shop==null)
      {
        util.show_model("请选择门店");
        return;
      }
      //mobile，contact不为空
      if(thiss.data.mobile.length==0)
      {
        util.show_model("请填写联系电话");
        return;
      }
      if(thiss.data.contact.length==0)
      {
        util.show_model("请填写联系人");
        return;
      }
    }
    //如果余额支付，余额必须大于need_pay
    if(this.data.pay_type==1&&parseInt(thiss.data.row_member.money)<thiss.data.need_pay)
    {
      util.show_model("余额不足");
      return;
    }
    pcapi.add_order(
      app.globalData.row_member.id,
      thiss.data.type,
      thiss.data.deliver_type,
      thiss.data.pay_type,
      thiss.data.row_address,
      thiss.data.row_shop,
      thiss.data.contact,
      thiss.data.mobile,
      thiss.data.fnote,
      thiss.data.all_money,
      thiss.data.diliver_money,
      thiss.data.integral,
      thiss.data.integral_discount,
      thiss.data.row_couponlist==null?0:thiss.data.row_couponlist.id,
      thiss.data.coupon_discount,
      thiss.data.need_pay,
      thiss.data.detail_id,
      thiss.data.rows_orderlist,
      function(res)
      {
        if(res.data.code==1)
        {
          thiss.setData(
            {
              order_id:res.data.order_id,
              state:parseInt(res.data.state),
            }
          );
          if(thiss.data.state==0)
          {
            thiss.get_prepay_id();
          }
          else
          {
            app.globalData.rows_orderlist=null,
            util.show_model_and_back(res.data.msg);
          }
        }
        else
        {
          util.show_model(res.data.msg);
        }
      }
    );
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
        thiss.get_order_info();
      }
    );
  },
  get_order_info:function()
  {
    var thiss=this;
    pcapi.get_order_info(
      thiss.data.order_id,
      function(res)
      {
        if(res.data.code==0)
        {
          util.show_model_and_back(res.data.msg);
        }
        else
        {
          var row_order=res.data.data;
          if(row_order.state==0)
          {
            util.show_model_and_back("订单付款失败");
          }
          else
          {
            util.show_model_and_back("订单付款成功");
          }
        }
      }
    );
  },
})