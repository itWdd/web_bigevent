$(function () {
    var layer = layui.layer
    var form = layui.form
    // 分页
    var laypage = layui.laypage;

    // 定义一个查询参数，将来请求的时候，将参数对象提交到服务器
    var q = {
        pagenum: 1, // 页码值，默认请求第一页的数据
        pagesize: 2, // 每页显示几条数据，默认每页显示2条
        cate_id: '', // 文章分类的 Id
        state: '' // 文章的发布状态
    }

    // 时间美化过滤器
    template.defaults.imports.dataFormat = function (data) {
        const time = new Date(data)

        var y = time.getFullYear()
        var m = padZero(time.getMonth() + 1)
        var d = padZero(time.getDate())

        var hh = padZero(time.getHours())
        var mm = padZero(time.getMinutes())
        var ss = padZero(time.getSeconds())

        return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
    }

    // 补零的函数
    function padZero(n) {
        return n > 9 ? n : '0' + n
    }

    initTable()
    initCate()

    // 获取数据的方法
    function initTable() {
        $.ajax({
            method: 'GET',
            url: '/my/article/list',
            data: q,
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取数据失败')
                } else if (res.data.length === 0) {
                    console.log('服务器端数据为空')

                }
                // console.log(res);
                // 模板引擎渲染页面数据
                var htmlStr = template('tpl_table', res) //把res中的数据传给tpl_table
                $('tbody').html(htmlStr)

                // 渲染分页,并传入总数据条数
                renderPage(res.total)
            }
        })
    }

    // 初始化文章分类
    function initCate() {
        $.ajax({
            method: 'GET',
            url: '/my/article/cates',
            success: function (res) {
                if (res.status !== 0) {
                    return layer.msg('获取分类失败')
                }
                // console.log(res);
                var htmlStr = template('tpl_cate', res)
                // console.log(htmlStr);
                $('[name=cate_id]').html(htmlStr)

                // 通过layui重新渲染表单区的ui结构
                form.render()
            }
        })
    }

    //筛选按钮功能
    $('#form-search').on('submit', function (e) {
        e.preventDefault()

        // 获取表单中的值
        var cate_id = $('[name=cate_id]').val()
        var state = $('[name=state]').val()

        // 给查询参数q中赋值
        q.cate_id = cate_id
        q.state = state

        initTable()
    })

    // 渲染分页的方法
    function renderPage(total) {
        laypage.render({
            elem: 'pageBox',
            count: total,
            limit: q.pagesize,
            curr: q.pagenum,
            layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
            limits: [2, 3, 5, 10],
            // 分页进行切换，会触发jump回调，从而获取到当前分页值
            jump: function (obj, first) {
                // console.log(obj.count);
                // console.log(obj.limit); //得到每页显示的条数
                q.pagesize = obj.limit
                q.pagenum = obj.curr
                // initTable() //会发生死循环

                // 1.点击页码会触发jump
                // 2.调用函数，会触发jump
                // first如果是true，表示通过2触发，不应该再去调用initTable方法
                // 反之，表示通过1触发
                if (!first) {
                    initTable()
                }
            }
        })
    }

    // 删除文章功能
    $('tbody').on('click', '.btn-delete', function (e) {
        // e.preventDefault()
        // 获取删除按钮的个数
        var count = $('.btn-delete').length
        //获取对应的文章Id
        var id = $(this).attr('data-id')
        layer.confirm('确认删除?', { icon: 3, title: '提示' }, function (index) {

            $.ajax({
                method: 'GET',
                url: '/my/article/delete/' + id,
                success: function (res) {
                    if (res.status !== 0) {
                        return layer.msg('删除文章失败！')
                    }
                    layer.msg('删除文章成功！')
                    // bug：当前页数据删完后，页码跳转但是内容不显示。
                    // 需要进行判断，当前页是否还有数据，没有的话，当前页书 -1 再去调用方法
                    // 通过删除按钮个数来判断
                    if (count === 1) {//1条数据，删除完就没数据，就会出bug，so在1的时候进行判断
                        //页码值最小为1
                        q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
                    }
                    initTable()
                }
            })
            layer.close(index);
        });
    })
})