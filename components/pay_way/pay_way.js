// components/pay_way/pay_way.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    row_member:Object,
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cancel:function(e)
    {
      var id=e.currentTarget.dataset.id;
      this.triggerEvent("confirm",
        {
          code:0,
          msg:'success',
          pay_type:id,
        },
        {}
      );
    },
    pick_pay_way:function(e)
    {
      var id=e.currentTarget.dataset.id;
      this.triggerEvent("confirm",
        {
          code:1,
          msg:'success',
          pay_type:id,
        },
        {}
      );
    }
  }
})
