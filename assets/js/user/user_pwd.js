$(function () {
    var form = layui.form
    var layer = layui.layer

    // 自定义验证
    form.verify({
        pwd: [
            /^[\S]{6,12}$/
            , '密码必须6到12位，且不能出现空格'
        ],
        // 新旧密码不能相同
        samePwd: function (value) {
            if (value === $('[name=oldPwd]').val()) {
                return '新旧密码不能相同'
            }
        },
        // 确认新密码一致
        reNewPwd:function(value){
            if(value !== $('[name=newPwd]').val()){
                return '两次密码输入不一致'
            }
        }
    })

    // 发起修改密码请求
    $('.layui-form').on('submit',function(e){
        e.preventDefault()

        $.ajax({
            method:'POST',
            url:'/my/updatepwd',
            data:$(this).serialize(),
            success:function(res){
                if(res.status !== 0){
                    return layer.msg('更新密码失败')
                }
                layer.msg('更新密码成功')

                // 重置表单为空，[0],将jq转为dom，才可调用form中的reset方法
                $('.layui-form')[0].reset()
            }
        })
    })
})
