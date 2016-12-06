//app.js
var util = require('./utils/util.js')
App({
  onLaunch: function() {
    this.login()
  },
  login: function (cb) {
    var that = this
    if (this.loginData.key) {// 用户已经登录
      typeof cb == "function" && cb(this.loginData.key, this.loginData.memberInfo)
    } else {
      wx.login({
        success: function(e) {
          if (e.code) {
            var code = e.code
            wx.getUserInfo({
              success: function(res) {
                // var encryptedData = encodeURIComponent(res.encryptedData)
                that.thirdLogin(code, res.encryptedData, res.iv)
              }
            })
          } else {
            console.log('获取用户登录失败！' + res.errMsg)
          }
        }
      })
    }
  },
  thirdLogin: function(code, encryptedData, iv) {
    var that = this
    wx.request({
      url: 'https://www.zouzoubar.com/mobile/index.php?act=wechatapp&op=user',
      header: { "content-type": "application/x-www-form-urlencoded" },
      method: "POST",
      data: util.json2Form({code: code, encryptedData: encryptedData, iv: iv, debug: 1}),
      complete: function(res) {
        if (res.data) {
          that.loginData.key = res.data.datas.key
          that.loginData.memberInfo = res.data.datas.member_info
          typeof cb == "function" && cb(this.loginData.key, this.loginData.memberInfo)
        } else {
          that.login()
        }
      }
    })
  },
  loginData: {// 存储用户登录以后的信息
    key: '',
    memberInfo: {}
  }
})
