var API_URL = 'http://v.juhe.cn/movie/index?smode=&pagesize=&offset=&dtype=&key=e3897a22e97b1ea1585fd0938ed067e2'
Page({
	data:{
		movies:[]
	},
	search:function(e){
		if(!e.detail.value){
			return;
		}
		wx.showToast({
			title:"加载中..",
			icon:"loading",
			duration:10000
		});
		var that = this;
		wx.request({

		    url: API_URL + "&title=" + e.detail.value, //仅为示例，并非真实的接口地址
		    data: {},
		    header: {
		    	'content-type': 'application/json'
		    },
		    success: function(res) {
		    	wx.hideToast();
		   		console.log(res.data);
		   		that.setData({
		   			movies: res.data.result
		   		})
		    }
		})
	}
})