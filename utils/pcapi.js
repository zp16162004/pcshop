//根据配置信息
var app=getApp();
function get_config(config,func)
{
  wx.request({
    url: app.globalData.host+"/Service/get_config",
    data:{
      config:config,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      func(res);
    }
  })
}
//根据code获取member信息
function do_login(code,func)
{
    wx.request({
      url: app.globalData.host+"/Service/get_code",
      header: {
        'content-type': 'application/x-www-form-urlencoded',
      },
      data:{
        code:code,
        nickname:app.globalData.userinfo.nickName,
        img:app.globalData.userinfo.avatarUrl,
        psaler:app.globalData.userinfo.psaler,
      },
      method:'Post',
      dataType:'json',
      success:function(res)
      {
        func(res);
      }
    })
}
function refresh_member(func)
{
  wx.request({
    url: app.globalData.host+"/Service/refresh_member",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:app.globalData.row_member.id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      func(res);
    }
  })
}
// 获取商城动态
function get_notice(count,func)
{
  wx.request({
    url: app.globalData.host+"/Service/get_notice",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      count:count,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      func(res);
    }
  })
}
//获取分类信息

function get_category(func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_category",
    data:{
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      func(res);
      // thiss.setData(
      //   {
      //     rows_category:res.data.data,
      //   }
      // );
      // console.log(thiss.data.rows_category);
    }
  })
}
function get_category_by_id(id,func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_category_by_id?id="+id,
    data:{
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      func(res);
      // thiss.setData(
      //   {
      //     rows_category:res.data.data,
      //   }
      // );
      // console.log(thiss.data.rows_category);
    }
  })
}
function get_home(func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_home",
    data:{
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      func(res);
    }
  })
}

function get_product(id,name,p,sort_price,sort_sale,is_new,func)
{
  //
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_product",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      typeid:id,
      name:name,
      p:p,
      sort_price:sort_price,
      sort_sale:sort_sale,
      is_new:is_new,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      func(res);
    }
  })
}
function get_product_info(product_id,member_id,func)
{
  //
  wx.request({
    url: app.globalData.host+"/Service/get_product_info?product_id="+product_id+"&member_id="+member_id,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function add_collection(product_id,member_id,func)
{
  wx.request({
    url: app.globalData.host+"/Service/add_collection?product_id="+product_id+"&member_id="+member_id,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function add_cart(member_id,product_id,productspec_id,number,func)
{
  wx.request({
    url: app.globalData.host+"/Service/add_cart",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
      product_id:product_id,
      productspec_id:productspec_id,
      number:number,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_orderlist_info(row_orderlist,func)
{
  wx.request({
    url: app.globalData.host+"/Service/get_orderlist_info",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      product_id:row_orderlist.product_id,
      productspec_id:row_orderlist.productspec_id,
      number:row_orderlist.number,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_address(member_id,func)
{
  wx.request({
    url: app.globalData.host+"/Service/get_address?member_id="+member_id,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_address_by_id(address_id,func)
{
  wx.request({
    url: app.globalData.host+"/Service/get_address_by_id?address_id="+address_id,
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_shop(func)
{
  wx.request({
    url: app.globalData.host+"/Service/get_shop",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_shop_and_distance(func,latitude,longitude)
{
  wx.request({
    url: app.globalData.host+"/Service/get_shop",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      latitude:latitude,
      longitude:longitude,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function add_address(member_id,name,mobile,region,address,is_default,func)
{
  wx.request({
    url: app.globalData.host+"/Service/add_address",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
      name:name,
      mobile:mobile,
      province:region[0],
      city:region[1],
      county:region[2],
      address:address,
      is_default:is_default,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function save_address(address_id,member_id,name,mobile,region,address,is_default,func)
{
  wx.request({
    url: app.globalData.host+"/Service/save_address",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      address_id:address_id,
      member_id:member_id,
      name:name,
      mobile:mobile,
      province:region[0],
      city:region[1],
      county:region[2],
      address:address,
      is_default:is_default,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function set_is_default(member_id,address_id,func)
{
  wx.request({
    url: app.globalData.host+"/Service/set_is_default",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
      address_id:address_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function delete_address(address_id,func)
{
  wx.request({
    url: app.globalData.host+"/Service/delete_address",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      address_id:address_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_coupon(member_id,func)
{
  wx.request({
    url: app.globalData.host+"/Service/get_coupon",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_couponlist(member_id,func)
{
  wx.request({
    url: app.globalData.host+"/Service/get_couponlist",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function add_couponlist(member_id,coupon_id,func)
{
  wx.request({
    url: app.globalData.host+"/Service/add_couponlist",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
      coupon_id:coupon_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function add_order(member_id,type,deliver_type,pay_type,row_address,row_shop,contact,mobile,fnote,money_product,money_fare,integral,integral_discount,couponlist_id,coupon_discount,need_pay,detail_id,rows_orderlist,func)
{
  var thiss=this;
  console.log(JSON.stringify(rows_orderlist));
  wx.request({
    url: app.globalData.host+"/Service/add_order",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
      type:type,
      deliver_type:deliver_type,
      pay_type:pay_type,
      shop_id:row_shop==null?0:row_shop.id,
      address_id:row_address==null?0:row_address.id,
      contact:contact,
      mobile:mobile,
      fnote:fnote,
      money_product:money_product,
      money_fare:money_fare,
      integral:integral,
      integral_discount:integral_discount,
      couponlist_id:couponlist_id,
      coupon_discount:coupon_discount,
      need_pay:need_pay,
      detail_id:detail_id,
      rows_orderlist:JSON.stringify(rows_orderlist),
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_prepay_id(order_id,func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_prepay_id",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      order_id:order_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function do_pay(nonce_str,prepay_id,timeStamp,sign,func_success,func_fail,func_complete)
{
  console.log(nonce_str);
  console.log(prepay_id);
  console.log(timeStamp);
  console.log(sign);
  wx.requestPayment({
    nonceStr: nonce_str,
    package: "prepay_id="+prepay_id,
    paySign: sign,
    timeStamp: timeStamp+"",
    signType:"MD5",
    success:function(res)
    {
      func_success(res);
    },
    fail:function(res)
    {
      func_fail(res);
    },
    complete:function()
    {
      func_complete();
    }
  })
}
function get_order_info(order_id,func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_order_info",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      order_id:order_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_group(func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_group",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{

    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_flashsection(func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_flashsection",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{

    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_bargain(func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_bargain",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{

    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_bargain_detail(bargain_id,member_id,bargainlist_id,func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_bargain_detail",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      bargain_id:bargain_id,
      member_id:member_id,
      bargainlist_id:bargainlist_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function create_bargainlist(member_id,bargain_id,func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/create_bargainlist",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
      bargain_id:bargain_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function add_bargainlist(member_id,bargainlist_id,func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/add_bargainlist",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
      bargainlist_id:bargainlist_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
function get_bargain_qrcode(member_id,bargainlist_id,func)
{
  var thiss=this;
  wx.request({
    url: app.globalData.host+"/Service/get_bargain_qrcode",
    header: {
      'content-type': 'application/x-www-form-urlencoded',
    },
    data:{
      member_id:member_id,
      bargainlist_id:bargainlist_id,
    },
    method:'Post',
    dataType:'json',
    success:function(res)
    {
      console.log(res);
      func(res);
    }
  })
}
module.exports = {
  get_config: get_config,
  do_login: do_login,
  refresh_member:refresh_member,
  get_notice: get_notice,
  get_category:get_category,
  get_home:get_home,
  get_product:get_product,
  get_category_by_id:get_category_by_id,
  get_product_info:get_product_info,
  add_collection:add_collection,
  add_cart:add_cart,
  get_orderlist_info:get_orderlist_info,
  get_address:get_address,
  get_shop:get_shop,
  get_shop_and_distance:get_shop_and_distance,
  add_address:add_address,
  set_is_default:set_is_default,
  delete_address:delete_address,
  get_address_by_id:get_address_by_id,
  save_address:save_address,
  get_coupon:get_coupon,
  get_couponlist:get_couponlist,
  add_couponlist:add_couponlist,
  add_order:add_order,
  get_prepay_id:get_prepay_id,
  do_pay:do_pay,
  get_order_info:get_order_info,
  get_group:get_group,
  get_flashsection:get_flashsection,
  get_bargain:get_bargain,
  get_bargain_detail:get_bargain_detail,
  create_bargainlist:create_bargainlist,
  add_bargainlist:add_bargainlist,
  get_bargain_qrcode:get_bargain_qrcode,
}