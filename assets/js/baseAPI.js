// 每次调用 $.get、post、ajax时，都会先调用 ajaxPrefilter 函数，
// 在这个函数中，可以拿到我们给ajax提供的配置对象

$.ajaxPrefilter(function (options) {
    // 再发起真正的请求前，统一拼接根路径
    // console.log(options.url);
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url


    // 统一为有权限的接口添加headers请求头
    //判断url是否为/my/ 此url需要请求头
    // 如果要检索的字符串值没有出现，则该方法返回 -1。
    if (options.url.indexOf('/my/') !== -1) {
        options.headers = {
            Authorization: localStorage.getItem('token') || ''
        }
    }

    // 无论请求成功和失败都会执行此函数
    options.complete = function (res) {
        console.log(res);
        if (res.responseJSON.status === 1 && res.responseJSON.message === '身份认证失败！') {
            // 1.清空token
            localStorage.removeItem('token')
            // 2.强制跳转到login
            location.href = '/login.html'
        }
    }
})