var app = getApp();
Page({
    data: {
        key: '',
        memberInfo: {}
    },
    onLoad: function () {
        var _this = this
        app.login(function(key, memberInfo) {
            _this.setData({
                key: key,
                memberInfo: memberInfo
            })
        })
    }
});
