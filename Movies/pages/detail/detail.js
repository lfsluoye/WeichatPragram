var API_URL = "http://v.juhe.cn/movie/query?key=e3897a22e97b1ea1585fd0938ed067e2&movieid="
Page({
	data:{
		item:{}
	},
	onLoad:function(params){
		console.log(params);
		var movieid = params.id;
		var that = this;
		wx.showToast({
			title:'加载中...',
  			icon:'loading',
  			duration:10000
		})

		wx.request({
		    url: API_URL + movieid, //仅为示例，并非真实的接口地址
		  	data: {},
		  	header: {
		      'content-type': 'application/json'
		  	},
		  	success: function(res) {
		  		wx.hideToast()
		    	console.log(res.data)
		   	 	that.setData({
		    		item: res.data.result
		    	})
		  	}
		})
	}
})