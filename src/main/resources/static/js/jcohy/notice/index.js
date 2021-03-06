layui.define(['laypage', 'layer',  'table','common','util','form'], function (exports) {
    var $ = layui.jquery,
        layer = layui.layer,
        util = layui.util,
        laypage = layui.laypage,
        common = layui.common,
        form = layui.form;
        table  = layui.table ;
    table.render({
        elem: '#notice'
        ,height: 500
        ,method:'GET'
        ,url: '/notice/list' //数据接口
        ,page: true //开启分页
        ,cols: [[ //表头
            {type: 'checkbox', align:'center',unresize:true}
            ,{field: 'id', align:'center', title: 'ID', sort: true,unresize:true}
            ,{field: 'content', align:'center', title: '内容',unresize:true}
            ,{field: 'url', align:'center', title: '链接地址',unresize:true}
            ,{field: 'start', align:'center', title: '开始时间',sort: true,unresize:true,templet: '<div>{{# if(d.start!=null){ }}{{ layui.util.toDateString(d.start) }}{{# } }}</div>'}
            ,{field: 'end', align:'center', title: '结束时间',sort: true,unresize:true,templet: '<div>{{# if(d.end!=null){ }}{{ layui.util.toDateString(d.end) }}{{# } }}</div>'}
            ,{title: '是否可见',templet: '#choicesTpl',unresize:true}
            ,{field: 'createDate', title: '创建日期',unresize:true,templet: '<div>{{# if(d.createDate!=null){ }}{{ layui.util.toDateString(d.createDate) }}{{# } }}</div>'}
            ,{fixed: 'right',  align:'center', toolbar: '#operator',unresize:true}
        ]]
    });
    //监听工具条
    table.on('tool(table)', function(obj){
        var data = obj.data;
        if(obj.event === 'del'){
            del(data.id);
        } else if(obj.event === 'edit'){
            common.frame_show('编辑','/notice/form?id='+data.id);
        }
    });

    //监听置顶CheckBox
    form.on('checkbox(visible)', function (data) {
        $.ajax({
            type: "GET",
            dataType: "json",
            data: {"type":"visible"},
            url: "/notice/" + data.value + "/change",
            success: function (ret) {
                if (ret.isOk) {
                    layer.msg("操作成功", {time: 2000}, function () {
                        layer.close(index);
                        window.location.href = "/notice/index";
                    });
                } else {
                    layer.msg(ret.msg, {time: 2000});
                }
            }
        })
    });
    //分页
    laypage.render({
        elem: 'pageDemo' //分页容器的id
        ,count: 100 //总页数
        ,skin: '#1E9FFF' //自定义选中色值
        //,skip: true //开启跳页
        ,jump: function(obj, first){
            if(!first){
                layer.msg('第'+ obj.curr +'页');
            }
        }
    });


    //添加数据
    $('#addNotice').click(function () {
        var index = layer.load(1);
        setTimeout(function () {
            layer.close(index);
            common.frame_show('添加','/notice/form');
            // layer.msg('打开添加窗口');
        }, 500);
    });

    //批量删除数据
    $('#deleteAll').click(function () {
        var index = layer.load(1);

    });

    //输出接口，主要是两个函数，一个删除一个编辑
    var datalist = {
        deleteData: function (id) {
            layer.confirm('确定删除？', {
                btn: ['确定', '取消'] //按钮
            }, function () {
                del(id);
            }, function () {

            });
        },
        editData: function (id) {
            common.frame_show('编辑','/notice/form?id='+id);
        }
    };
    function del(id) {
        layer.confirm('真的删除行么', function (index) {
            $.ajax({
                type: "DELETE",
                dataType: "json",
                url: "/notice/" + id + "/del",
                success: function (ret) {
                    if (ret.isOk) {
                        layer.msg("操作成功", {time: 2000}, function () {
                            layer.close(index);
                            window.location.href = "/notice/index";
                        });
                    } else {
                        layer.msg(ret.msg, {time: 2000});
                    }
                }
            });
        });
    }


    exports('notice/index', datalist);
});