var util = require('../../utils/util.js');
var app = getApp();
Page({
	data:{
		shengIndex: 0,			//	省默认键
		shiIndex: 0,			//	市默认键
		quIndex: 0,				//	区默认键
		shengList: '',			//	省数组
		shiList: ['请选择'],	//	市数组
		quList: ['请选择'],		//	区数组
		area_id: '',			//	选择的区县id
		city_id: '',			//	选择的城市id	
		freight_hash: ''
	},
	onLoad: function(options) {
		var self = this;
		var key = app.loginData.key;					//	初始化调用key
		var freight_hash = options.freight_hash;		//	初始化调用返回参数(计算运费)
		wx.request({
		  url: 'https://www.zouzoubar.com/mobile/index.php?act=member_address&op=area_list',
		  header: { "content-type": "application/x-www-form-urlencoded" },
		  data: util.json2Form({key:key}),
		  method: "POST",
		  success: function(res) {
		    var data = res.data.datas;
		    var shengList = [];
		    var shengId = [];
		    for(var i in data.area_list){
		    	shengList[i] = data.area_list[i].area_name;
		    	shengId[i] = data.area_list[i].area_id;
		    }
		    self.setData({
		    	shengList : shengList,
		    	shengId: shengId,
		    	freight_hash: freight_hash,
		    	key: key
		    })

		  }
		})
	},
	shengChange: function(options) {
		var self = this;
		var index = options.detail.value;
		var key = self.data.key;

		/*省份选中后得到省份Id*/
		var sheng_id = self.data.shengId[index];
		
		/*省份选中后得到省份名*/
		var shengName = self.data.shengList[index];

		/*选中后改变值*/
		self.setData({
			shengIndex: index
		})

		/*请求市区数据*/
		wx.request({
		  url: 'https://www.zouzoubar.com/mobile/index.php?act=member_address&op=area_list',
		  header: { "content-type": "application/x-www-form-urlencoded" },
		  data: util.json2Form({key:key,area_id:sheng_id}),
		  method: "POST",
		  success: function(res) {
		    var data = res.data.datas;
		    var shiList = [];
		    var shiId = [];

		    for(var i in data.area_list){
		    	shiList[i] = data.area_list[i].area_name;
		    	shiId[i] = data.area_list[i].area_id;
		    }
		    self.setData({
		    	shiList: shiList,
		    	shiId: shiId,
		    	shengName: shengName	//	保存省份名为新增地址做准备
		    })

		  }
		})

	},
	shiChange: function(options) {
		var self = this;
		var index = options.detail.value;
		var key = self.data.key;

		/*城市选中后得到城市Id*/
		var city_id = self.data.shiId[index];

		/*城市选中后得到城市名*/
		var shiName = self.data.shiList[index];

		/*选中后改变值*/
		self.setData({
			shiIndex: index
		})

		/*请求区县数据*/
		wx.request({
		  url: 'https://www.zouzoubar.com/mobile/index.php?act=member_address&op=area_list',
		  header: { "content-type": "application/x-www-form-urlencoded" },
		  data: util.json2Form({key:key,area_id:city_id}),
		  method: "POST",
		  success: function(res) {
		    var data = res.data.datas;
		    var quList = [];
		    var quId = [];
		    for(var i in data.area_list){
		    	quList[i] = data.area_list[i].area_name;
		    	quId[i] = data.area_list[i].area_id;
		    }
		    self.setData({
		    	quList: quList,					//	保存区县名称数组
		    	quId: quId,						//	保存区县Id数组(给下次获取区县选中id做准备)
		    	city_id: city_id,				//	保存城市Id(作为保存函数 参数使用)
		    	shiName: shiName				//	保存城市名为新增地址做准备
		    })

		  }
		})
	},
	quChange: function(options) {
		var self = this;
		var index = options.detail.value;		//	选中的index
		var area_id = self.data.quId[index];	//	通过获取全局quId和选中index，截获数据对应区县Id

		/*区县选中后得到区县名*/
		var quName = self.data.quList[index];	

		/*选中后改变值*/
		self.setData({
			quIndex: index,						//	选中的index传输到前台选中值
			area_id: area_id,					//	保存区县Id
			quName: quName						//	保存区县名为新增地址做准备
		})
	},
	/* 保存地址函数 (通过地址用于动态计算运费) */
	changeAddress: function() {
		var self = this;
		

		var data= {};
		data.key = self.data.key;
		data.city_id = self.data.city_id;
		data.area_id = self.data.area_id;
		data.freight_hash = self.data.freight_hash;
		
		wx.request({
		  url: 'https://www.zouzoubar.com/mobile/index.php?act=member_buy&op=change_address',
		  header: { "content-type": "application/x-www-form-urlencoded" },
		  data: util.json2Form(data),
		  method: "POST",
		  success: function(res) {
		    var data = res.data.datas;
		    

		  }
		})
	},
	/* 新增收货信息 (新增收货的信息)*/
	addressAdd: function(options) {
		var self = this;

		var data = {};
		data.key = self.data.key;
		data.true_name = options.detail.value.name;
		data.mob_phone = options.detail.value.phone;
		data.city_id = self.data.city_id;
		data.area_id = self.data.area_id;
		data.address = options.detail.value.address;
		data.area_info = self.data.shengName+' '+self.data.shiName+' '+self.data.quName;

		wx.request({
		  url: 'https://www.zouzoubar.com/mobile/index.php?act=member_address_buy&op=address_add',
		  header: { "content-type": "application/x-www-form-urlencoded" },
		  data: util.json2Form(data),
		  method: "POST",
		  success: function(res) {
		    var data = res.data.datas;
		    

		  }
		})
	},
	/* 保存Button调用函数 */
	save: function(options) {
		var self = this;
		self.changeAddress();	//	调用保存地址函数(计算运费)

		self.addressAdd(options);		//	调用新增收货信息(表单提交参数传入该函数作为参数)
		
	}
})