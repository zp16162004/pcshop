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
      product_id:row_orderlist.member_id,
      productspec_id:row_orderlist.product_id,
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

module.exports = {
  get_config: get_config,
  do_login: do_login,
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
}