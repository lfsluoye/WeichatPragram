var util = require('../../utils/util.js');
var app = getApp();
Page({
	data: {
		freight_hash: ''
	},
	onLoad : function(options) {
		var self = this;
		self.gooodsInfo(options);					//	渲染商品信息
	},
	gooodsInfo: function(options) {
		var self = this;
		var goods_id = options.goods_id;
		var buyNum = options.buynum;

		var key = app.loginData.key;
		var cart_id = goods_id +'|'+ buyNum;

		wx.request({
		  url: 'https://www.zouzoubar.com/mobile/index.php?act=member_buy_buy&op=buy_step1',
		  header: { "content-type": "application/x-www-form-urlencoded" },
		  data: util.json2Form({key:key,cart_id:cart_id}),
		  method: "POST",
		  success: function(res) {

		    var data = res.data.datas;

		    self.setData({
		    	freight_hash: data.freight_hash, 
		    	goods_info: data.store_cart_list,
		    	cart_id: cart_id,
		    	key: key,
		    	address_id: data.address_info.address_id,
		    	vat_hash: data.vat_hash,
		    	city_id: data.address_info.city_id,
		    	area_id: data.address_info.area_id,
		    	address_info: data.address_info
		    })
		  },
		  complete: function() {
		  		self.changeAddress();		//	等待商品信息数据渲染完成后调用计算运费函数
		  }
		})
	},
	changeAddress: function() {
		var self = this;
		var data = {};
		data.key = self.data.key;
		data.area_id = self.data.area_id;
		data.city_id = self.data.city_id;
		data.freight_hash = self.data.freight_hash;

		wx.request({
		  url: 'https://www.zouzoubar.com/mobile/index.php?act=member_buy&op=change_address',
		  header: { "content-type": "application/x-www-form-urlencoded" },
		  data: util.json2Form(data),
		  method: "POST",
		  success: function(res) {
		    var data = res.data.datas;
		    self.setData({
		    	offpay_hash: data.offpay_hash,
		    	offpay_hash_batch: data.offpay_hash_batch
		    })
		  }
		})
	},
	buyStep: function() {
		var self = this;
		var data = {};
		data.key = self.data.key;
		data.cart_id = self.data.cart_id;
		data.address_id = self.data.address_id;
		data.vat_hash = self.data.vat_hash;
		data.offpay_hash = self.data.offpay_hash;
		data.offpay_hash_batch = self.data.offpay_hash_batch;
		data.pay_name = 'online';
		data.invoice_id = '';
		data.voucher = '';
		data.rcb_pay = 0;
		data.pd_pay = 0;

		wx.request({
		  url: 'https://www.zouzoubar.com/mobile/index.php?act=member_buy_buy&op=buy_step2',
		  header: { "content-type": "application/x-www-form-urlencoded" },
		  data: util.json2Form(data),
		  method: "POST",
		  success: function(res) {
		    var data = res.data.datas;
		    	if(data.pay_sn){
				    wx.navigateTo({
						url: '../order/index'
					})
			    }
		  }
		})
			

	}
})