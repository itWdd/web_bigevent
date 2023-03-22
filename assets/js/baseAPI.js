// 每次调用 $.get、post、ajax时，都会先调用 ajaxPrefilter 函数，
// 在这个函数中，可以拿到我们给ajax提供的配置对象

$.ajaxPrefilter(function(options){
    // 再发起真正的请求前，统一拼接根路径
    // console.log(options.url);
    options.url = 'http://api-breakingnews-web.itheima.net' + options.url
})