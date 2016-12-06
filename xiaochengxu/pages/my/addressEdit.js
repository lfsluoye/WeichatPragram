/** pages/my/addressEdit.js */
var util = require('../../utils/util.js');
var app = getApp();
Page({
    data: {
        address_id: '',
        address: '',
        contactsValue: '',    //联系人
        phoneValue: '',       //手机号
        addressValue: '',         //详细地址
        provinceList: '',      //省
        provinceIndex: 0,      //省默认键
        provinceName: '',
        cityList: ['请选择'],  //市
        cityIndex: 0,         //市默认键
        cityName: '',
        areaList: ['请选择'],   //区
        areaIndex: 0,
        areaName: '',
        areaqu_id: '',			//	选择的区县id
		cityshi_id: '',		   //	选择的城市id
        isdefault: 0,	           //switch是否为选中状态
        checked: ''           //获取默认switch
    },
    /** 页面初始化 */
    onLoad: function(options){
        console.log("222222");
        console.log("111111");
        console.log(options);
        var that = this;
        var index = options.id;
        console.log("333333333333333333333333");
        console.log(options);
        var key = app.loginData.key;
        wx.request({
            method: 'POST',
            url: "https://www.zouzoubar.com/mobile/index.php?act=member_address&op=address_list",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data:util.json2Form({key: key, address: 1}),
            success: function(res) {
                var data = res.data.datas;
                that.setData({
                    address: data.address[index],
                    provinceIndex: data.address[index].province_id,
                    cityIndex: data.address[index].city_id,
                    areaIndex: data.address[index].area_id,
                    address_id: data.address[index].address_id,
                    key: key
                })
                if(data.address[index].is_default == 1){
                    that.setData({
                        checked: true
                    })
                }else{
                    that.setData({
                        checked: false
                    })
                }
                console.log("fggggggggggggggggddddddddddd");
                console.log(data.address[index].province_id);
                console.log(data.address[index].city_id);
                console.log(data.address[index].area_id);
            }
        })
        wx.request({
            method: 'POST',
            url: "https://www.zouzoubar.com/mobile/index.php?act=member_address&op=area_list",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data:util.json2Form({key: key}),
            success: function(res) {
                var data = res.data.datas;
                var provinceList = [];
                var provinceId = [];
                for(var i in data.area_list){
                    provinceList[i] = data.area_list[i].area_name;
                    provinceId[i] = data.area_list[i].area_id;
                }
                that.setData({
                    provinceList : provinceList,
                    provinceId: provinceId,
                    key: key
                })
            }
        })
    },

    /* 联系人 */
    contacts: function(options){
        var self = this;
        self.setData({
            contactsValue: options.detail.value
        })
    },
    
    /** 手机号码 */
    phone: function(options){
        var self = this;
        self.setData({
            phoneValue: options.detail.value
        })
    },

    /** 详细地址 */
    detail: function(options){
        var self = this;
        self.setData({
            addressValue: options.detail.value
        })
    },

    /** 省 */
    bindProvinceChange: function(options){
        var self = this;
        var index = options.detail.value;
		var key = self.data.key;
		/*省份选中后得到省份Id*/
		var sheng_id = self.data.provinceId[index];
		/*省份选中后得到省份名*/
		var provinceName = self.data.provinceList[index];
		/*选中后改变值*/
		self.setData({
			provinceIndex: index
		})
        /** 请求市区数据 */
        wx.request({
            method: "GET",
            url: "https://www.zouzoubar.com/mobile/index.php?act=area&op=area_list",
            data: {key: key, area_id: sheng_id},
            success: function(res) {
                var data = res.data;
                var cityList = [];
                var cityId = [];
                for(var i in data){
                    cityList[i] = data[i].area_name;
                    cityId[i] = data[i].area_id;
                }
                self.setData({
                    cityList: cityList,
                    cityId: cityId,
                    provinceName: provinceName	//	保存省份名为新增地址做准备
                })
            }
        })
    },

    /** 市 */
    bindCityChange: function(options) {
        var self = this;
        var index = options.detail.value;
        var key = self.data.key;
        /*城市选中后得到城市Id*/
        var city_id = self.data.cityId[index];
        /*城市选中后得到城市名*/
        var cityName = self.data.cityList[index];
        /*选中后改变值*/
        self.setData({
            cityIndex: index
        })
        /*请求区县数据*/
        wx.request({
            method: "GET",
            url: 'https://www.zouzoubar.com/mobile/index.php?act=area&op=area_list',
            header: { "content-type": "application/x-www-form-urlencoded" },
            data: {key: key, area_id: city_id},
            success: function(res) {
                var data = res.data;
                var areaList = [];
                var areaId = [];
                for(var i in data){
                    areaList[i] = data[i].area_name;
                    areaId[i] = data[i].area_id;
                }
                self.setData({
                    areaList: areaList,					 //	保存区县名称数组
                    areaId: areaId,						//	保存区县Id数组(给下次获取区县选中id做准备)
                    city_id: city_id,				   //	保存城市Id(作为保存函数 参数使用)
                    cityName: cityName				  //	保存城市名为新增地址做准备
                })
            }
        })
    },

    /** 区/县 */
    bindAreaChange: function(options) {
        var self = this;
        var index = options.detail.value;		  //	选中的index
        var area_id = self.data.areaId[index];	  //	通过获取全局areaId和选中index，截获数据对应区县Id
        /*区县选中后得到区县名*/
        var areaName = self.data.areaList[index];	
        /*选中后改变值*/
        self.setData({
            areaIndex: index,						//	选中的index传输到前台选中值
            area_id: area_id,					    //	保存区县Id
            areaName: areaName						//	保存区县名为新增地址做准备
        })
    },

     /** switch是否选中 */
    switchChange: function(options){
        var that = this;
        if(options.detail=='false'){
            that.setData({
                isdefault : 0
            })
        }else{
            that.setData({
                isdefault : 1
            }) 
        }
    },

    editSave: function(){
        var that = this;
        var key = that.data.key;
        var data = {};
        data.key = that.data.key;
        data.true_name = that.data.contactsValue;
        data.mob_phone = that.data.phoneValue;
        data.city_id = that.data.city_id;
        data.area_id = that.data.area_id;
        data.address_id = that.data.address_id;
        data.address = that.data.addressValue;
        data.area_info = that.data.provinceName+' '+that.data.cityName+' '+that.data.areaName;
        console.log(data.area_info);
        data.isdefault = that.data.isdefault;
        wx.request({
            method: 'POST',
            url: "https://www.zouzoubar.com/mobile/index.php?act=member_address&op=address_edit",
            header: { "content-type": "application/x-www-form-urlencoded" },
            data:util.json2Form(data),
            success: function(res) {
                var data = res.data.datas;
                console.log("55555555555555556666666666666"); 
                console.log(res);        
            }
        })
    }
})