$(function () {
    getUerInfo()

    // 退出功能
    var layer = layui.layer
    $('.btnLogout').on('click', function () {
        layer.confirm('确定需要退出?', { icon: 3, title: '提示' }, function (index) {
            // 清除本地存储
            localStorage.removeItem('token')
            // 跳转
            location.href = '/login.html'
            // 关闭confirm询问框
            layer.close(index);
        });
    })
})

// 获取用户的基本信息
function getUerInfo() {
    $.ajax({
        method: 'GET',
        url: '/my/userinfo',
        // headers: {
        //     // 从网页缓存中获取之前存的token，没有则空值
        //     Authorization: localStorage.getItem('token') || ''
        // },
        success: function (res) {
            // console.log(res);
            if (res.status !== 0) {
                return layui.layer.msg('获取用户信息失败！')
            }
            // 成功后调用渲染用户头像函数
            randerAvatar(res.data)
        }
        // // 无论请求成功和失败都会执行此函数
        // complete:function(res){
        //     console.log(res);
        //     if(res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！'){
        //         // 1.清空token
        //         localStorage.removeItem('token')
        //         // 2.强制跳转到login
        //         location.href = '/login.html'
        //     }
        // }
    })
}

// 渲染用户头像
function randerAvatar(user) {
    // 1.data中有登录的名称和昵称，判断哪个没有就选另一个
    var name = user.nickname || user.userkname
    // 2.设置欢迎文本
    $('.welcome').html('欢迎&nbsp&nbsp' + name)
    // 3.按需获取用户头像
    if (user.user_pic !== null) {
        // 显示图片头像
        $('.layui-nav-img').attr('src', user.user_pic).show()
        $('.userAvater').hide()
    } else {
        // 显示文字头像
        $('.layui-nav-img').hide()
        // 获取文字首字并设置为大写
        var first = name[0].toUpperCase()
        $('.userAvater').html(first).show()
    }
}