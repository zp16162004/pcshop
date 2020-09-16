const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}
function ftime (number, format) {
  let time = new Date(number)
  let newArr = []
  let formatArr = ['Y', 'M', 'D', 'h', 'm', 's']
  newArr.push(time.getFullYear())
  newArr.push(formatNumber(time.getMonth() + 1))
  newArr.push(formatNumber(time.getDate()))
  
  newArr.push(formatNumber(time.getHours()))
  newArr.push(formatNumber(time.getMinutes()))
  newArr.push(formatNumber(time.getSeconds()))
  
  for (let i in newArr) {
   format = format.replace(formatArr[i], newArr[i])
  }
  return format;
 }
//提示框并返回
function show_model_and_back(msg)
{
  wx.showModal({
    title:"提示",
    content:msg,
    success:function()
    {
      wx.navigateBack({
        delta: 1,
      });
    }
  })
}
function show_model(msg)
{
  wx.showModal({
    title:"提示",
    content:msg,
    success:function()
    {
    }
  })
}
function alert(msg,func1,func2)
{
  wx.showModal({
    title:"提示",
    content:msg,
    success:function(res)
    {
      if(res.confirm)
      {
        func1();
      }
      else
      {
        func2();
      }
    }
  })
}
//rpx2px
function rpx2px(r,systeminfo)
{
  return parseInt((r/750)*systeminfo.windowWidth);
}
//比较版本号
function compare_version(curV,reqV){
  if(curV && reqV){
     //将两个版本号拆成数字
     var arr1 = curV.split('.'),
         arr2 = reqV.split('.');
     var minLength=Math.min(arr1.length,arr2.length),
         position=0,
         diff=0;
     //依次比较版本号每一位大小，当对比得出结果后跳出循环（后文有简单介绍）
     while(position<minLength && ((diff=parseInt(arr1[position])-parseInt(arr2[position]))==0)){
         position++;
     }
     diff=(diff!=0)?diff:(arr1.length-arr2.length);
     //若curV大于reqV，则返回true
     return diff>0;
  }else{
     //输入为空
     console.log("版本号不能为空");
     return false;
  }
}
//申请订阅消息权限
function apply_template(systeminfo,ids_template,func)
{
  var times=0;
  var max_count=1;
  if((systeminfo.system.toLowerCase().indexOf('ios')>=0&&compare_version(systeminfo.version,'7.0.6')>=0)||(systeminfo.system.toLowerCase().indexOf('android')>=0&&compare_version(systeminfo.version,'7.0.7')>=0))
  {
    max_count=3;
  }
  var list_ids_template=new Array();
  for(var i=0;i<ids_template.length;i+=max_count)
  {
    var end=i+max_count;
    if(end>=ids_template.length)
    {
      end=ids_template.length;
    }
    console.log(ids_template);
    console.log(i+":"+end);
    console.log(ids_template.slice(i,end));
    list_ids_template.push(ids_template.slice(i,end));
  }
  for(var i=0;i<list_ids_template.length;i++)
  {
    wx.requestSubscribeMessage({
      tmplIds: list_ids_template[i],
      success:function(res)
      {
        console.log(res);
      },
      fail:function(res)
      {
        console.log(res);
      },
      complete:function()
      {
        times++;
        console.log('请求订阅消息次数:'+times);
        if(times==list_ids_template.length)
        {
          func();
        }
      }
    })
  }
}

module.exports = {
  formatTime: formatTime,
  ftime:ftime,
  show_model_and_back: show_model_and_back,
  show_model:show_model,
  rpx2px: rpx2px,
  alert:alert,
  compare_version:compare_version,
  apply_template:apply_template,
}
