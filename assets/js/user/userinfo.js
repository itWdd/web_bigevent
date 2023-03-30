$(function () {
    var form = layui.form
    form.verify({
        nickname:function (value) {
            if (value > 6) {
                return '昵称必须在1 ~ 6 个字符之间'
            }
        }
    })
    initUserInfo()

    // 初始化用户信息
    function initUserInfo() {
        $.ajax({
            method: 'GET',
            url: '/my/userinfo',
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg(res.message)
                }
                // layui.layer.msg(res.message)

                // 利用form.val('filter', object);对表单内容快速填充
                form.val('formUserInfo', res.data)
            }
        })
    }

    // 重置事件
    $('#btnReset').on('click', function (e) {
        // 阻止重置按钮的默认重置功能
        e.preventDefault()
        initUserInfo()
    })

    // 监听表单提交事件
    $('.layui-form').on('submit', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/userinfo',
            // serialize快速获取表单中的内容
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layui.layer.msg('修改失败！')
                }
                layui.layer.msg('修改成功')
                // 获取index父级页面，重新渲染头像和用户名
                window.parent.getUerInfo()
            }
        })
    })
})
