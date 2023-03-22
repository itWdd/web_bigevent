$(function () {
    // 切换登录注册页面
    $('#link_reg').on('click', function () {
        // $('.login-box').css('display','none')
        // $('.reg-box').css('display','block')
        $('.login-box').hide()
        $('.reg-box').show()
    })
    $('#link_login').on('click', function () {
        $('.reg-box').hide()
        $('.login-box').show()
    })

    // layui中没有的验证，需要自己自定义
    // 获取layui中的form对象
    var form = layui.form
    form.verify({
        // 自定义密码验证
        pass: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 验证确认密码
        repwd: function (value) {
            var repwd = $('.reg-box [name=password]').val()
            if (repwd !== value) {
                return '两次密码不一致'
            }
        },
        // 用户名验证
        username: function (value, item) { //value：表单的值、item：表单的DOM对象
            if (!new RegExp("^[a-zA-Z0-9_\u4e00-\u9fa5\\s·]+$").test(value)) {
                return '用户名不能有特殊字符';
            }
            if (/(^\_)|(\__)|(\_+$)/.test(value)) {
                return '用户名首尾不能出现下划线\'_\'';
            }
            if (/^\d+\d+\d$/.test(value)) {
                return '用户名不能全为数字';
            }

            //如果不想自动弹出默认提示框，可以直接返回 true，这时你可以通过其他任意方式提示（v2.5.7 新增）
            if (value === 'xxx') {
                alert('用户名不能为敏感词');
                return true;
            }
        }
    });

    // 实现注册功能
    var layer = layui.layer;
    $('#form_reg').on('submit', function (e) {
        e.preventDefault();
        // 发起请求
        var data = {
            username: $('.reg-box [name=username]').val(),
            password: $('.reg-box [name=password]').val()
        };
        $.post('/api/reguser', data, function (res) {
            if (res.status !== 0) {
                return layer.msg(res.message);
                // return console.log(res.message)
            }
            layer.msg('注册成功！');
            // 自动点击登录按钮
            $('#link_login').click();
        })
    })

    // 实现登录功能
    $('#form_login').submit(function(e){
        e.preventDefault()

        $.ajax({
            url:'/api/login',
            method:'POST',
            // 快速获取表单数据
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('登录失败')
                }
                layer.msg('登录成功')
                // console.log(res.token);
                // 将登录成功得到的 token 字符串，保存到 localStorage 中
                localStorage.setItem('token',res.token)
                // 跳转后台主页
                location.href = 'index.html'
            }
        })
    })
})