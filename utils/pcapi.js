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

module.exports = {
  get_config: get_config,
  do_login: do_login,
  get_notice: get_notice,
  get_category:get_category,
}