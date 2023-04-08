$(function () {
    var layer = layui.layer
    var form = layui.form
    initArtCateList()
    // 获取文章分类的列表
    function initArtCateList() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg("获取失败")
                }
                // 调用模板引擎的函数，让它拿到数据
                var htmlStr = template('tpl-table', res)
                $('tbody').html(htmlStr)
            }
        })
    }

    // 添加按钮点击事件
    var indexAdd = null
    $('#addCate').on('click', function () {
        indexAdd = layer.open({
            // 去掉确定按钮
            type: 1,
            // 宽高
            area: ['500px', '250px'],
            title: '添加文章分类',
            content: $('#dialog-add').html()
        })
    })

    // 由于form表单时点击时动态添加的，so绑定时候它海不存在，
    // 可以通过代理的形式给它绑定,body元素肯定存在
    $('body').on('submit', '#dialog-form', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/addcates',
            // 快速获取表单内容
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('添加失败')
                }
                initArtCateList()
                // 关闭窗口
                layer.close(indexAdd)
                layer.msg('添加成功')
            }
        })
    })

    // 代理绑定“编辑按钮”
    var indexEdit = null
    $('tbody').on('click', '.btn-edit', function () {
        indexEdit = layer.open({
            type: 1,
            area: ['500px', '250px'],
            title: '编辑文章分类',
            content: $('#dialog-edit').html()
        })
        var id = $(this).attr('data-id')
        $.ajax({
            method: 'GET',
            url: '/my/article/cates/' + id,
            success: function (res) {
                // 填充表单
                form.val('edit-form', res.data)
            }
        })
    })

    // 修改按钮的点击事件
    $('body').on('submit', '#edit-form', function (e) {
        e.preventDefault()
        $.ajax({
            method: 'POST',
            url: '/my/article/updatecate',
            data: $(this).serialize(),
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('修改成功')
                }
                layer.msg('修改成功')
                layer.close(indexEdit)
                initArtCateList()
            }
        })
    })

    // 通过代理方式，绑定删除按钮
    $('body').on('click', '.btn-delete', function () {
        var id = $(this).attr('data-id')
        // 提示用户是否删除
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {
            $.ajax({
                method:'GET',
                url:'/my/article/deletecate/' + id,
                success:function(res){
                    if(res.status !== 0){
                        return layer.msg('删除失败')
                    }
                    layer.msg('删除成功')
                    initArtCateList()
                    layer.close(index);
                }
            })
        });
    })
})