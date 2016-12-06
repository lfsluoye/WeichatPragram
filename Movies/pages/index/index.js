//index.js
//获取应用实例
var app = getApp()
var API_URL = 'http://v.juhe.cn/movie/movies.today?cityid=2&dtype=&key=e3897a22e97b1ea1585fd0938ed067e2'
Page({
  data: {
  	moviesInfo: []
  },

  onLoad: function () {
  	var that = this;
  	wx.showToast({
  		title:'加载中...',
  		icon:'loading',
  		duration:10000
  	})

  	wx.request({
	  url: API_URL, //仅为示例，并非真实的接口地址
	  data: {},
	  header: {
	      'content-type': 'application/json'
	  },
	  success: function(res) {
	  	wx.hideToast()
	    console.log(res.data)
	    that.setData({
	    	moviesInfo: res.data.result
	    })
	  }
	})
  }
  
})
