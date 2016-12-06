var util = require('../../utils/util.js');
var app = getApp();
Page({
  	data:{
  		classify: ['全部','待付款','待发货','待收货','待评价'],
  		has: true,
      curpage: [1,1,1,1,1],
      hasmore: [1,1,1,1,1]
  	},
    onLoad: function(options){
      var self = this;

      wx.getSystemInfo({
      success: function(res) {
        self.setData({
          winHeight: res.windowHeight  
        });
      }
    });

    	
    	var key = app.loginData.key;

    	var state = options.state;		//	订单状态

    	self.setData({
    		key: key,
    		state: state
    	})

    	/*判断状态来源(true:个人中心,false:购买流程为待付款)*/
    	if(!state){
    		self.setData({
    			state: 10
    		})
    	}

    	self.orderList();
    },
    orderItem: function(options){

    	this.setData({
    		state: options.currentTarget.dataset.id
    	}) 
    	this.orderList();

    },
    /* 下拉分页事件 */
    scrolltolower: function(){
        var curpage = this.data.curpage;
        var state = this.data.state;
        var index = state / 10;
        var hasmore = this.data.hasmore;

        /*判断是否有分页*/
        if(hasmore[index]){
          curpage[index] += 1
          this.pagination();
        }
    },
    /* 分页请求 */
    pagination: function() {
      var self = this;
      var key = self.data.key;
      var state = self.data.state;
      var index = state / 10;
      var curpage = self.data.curpage;
      var hasmore = this.data.hasmore;


      wx.request({
        url:'https://www.zouzoubar.com/mobile/index.php?act=member_order&op=order_list&page=10&curpage='+curpage[index]+'&getpayment=true&order_state='+state,
        header: { "content-type": "application/x-www-form-urlencoded" },
        method:"POST",
        data:util.json2Form({key:key}),
        success : function(res){
          var data = res.data.datas;

          self.setData({
            orderList: self.data.orderList.concat(data.order_group_list),     //  商品订单列表
            state: state                          //  订单状态
          })

          /* 判断是否有下一页 */
          if(!res.data.hasmore) {
              hasmore[index] = 0;
          }
          
         }
      })
    },
    /* 初始化请求 */
   	orderList: function(){
   		var self = this;
   		var key = self.data.key;
   		var state = self.data.state;
      var index = state / 10;
      var hasmore = this.data.hasmore;

   		wx.request({
	      url:'https://www.zouzoubar.com/mobile/index.php?act=member_order&op=order_list&page=10&curpage=1&getpayment=true&order_state='+state,
	      header: { "content-type": "application/x-www-form-urlencoded" },
        method:"POST",
        data:util.json2Form({key:key}),
	      success : function(res){
	        var data = res.data.datas;

	        self.setData({
	        	orderList: data.order_group_list,			//	商品订单列表
	        	state: state  								        //	订单状态
	        })

	        /* 判断是否有下一页 */
          if(!res.data.hasmore) {
              hasmore[index] = 0;
          }

          /* 判断是否有列表 */
	        if(!data.order_group_list.length){
	        	self.setData({
	        		has: false
	        	})
	        }else{
	        	self.setData({
	        		has: true
	        	})
	        }
	        
	       }
	    })
   	}
})