var index;
/**
 * 功能： 展示任务表格
 */
function initTaskTable(listData) { 
    var tableHeight = $(".task-table").height();
    console.log("judge table:", tableHeight);

    $('#queryTaskTable').bootstrapTable({
        data: listData,
        contentType: 'application/json;charset=UTF-8',
        height: tableHeight,
        striped: true,
        singleSelect: true,
        clickToSelect: true,
        pagination: false, //是否显示分页（*）
        sidePagination: "client", //分页方式：client客户端分页，server服务端分页（*）
        paginationPreText: "<",
        paginationNextText: ">",
        pageSize: 20,
        paginationLoop: false,
        columns: [{
                checkbox: true,
            },
            {
                field: '',
                title: "<span title='序号'>序号</span>",
                width: '40',
                align: 'center',
                formatter: function (value, row, index) {
                    return index + 1;
                }
            },
            {
                field: 'TaskID',
                title: '任务ID',
                width: "70",
                align: 'center',
                formatter: function (value, row, index) {
                    return "<span title='" + value.replace(/\'/g, "&acute;") + "'>" + value.replace(/\'/g, "&acute;") + "</spa3n>";
                }
            },
            {
                field: 'TaskService',
                title: '任务类型',
                width: "100",
                align: 'center',
                formatter: function (value, row, index) {
                    return "<span title='" + value + "'>" + value + "</span>";
                }
            },
            {
                field: 'TaskDate',
                title: '创建时间',
                width: "160",
                align: 'center',
                formatter: function (value, row, index) {
                    return "<span title='" + value + "'>" + value.replace("T"," " ) + "</span>";
                }
            }
        ],
        // formatNoMatches: function () {
        //     //alertModal(1, "未查询到符合条件的结果")
        //     // return "没有相关的匹配结果";
        // },
        formatLoadingMessage: function () {
            return "请稍等，正在加载中...";
        },
        formatShowingRows: function (a, b, c) {
            return "共 " + c + " 条记录";
        },
        formatRecordsPerPage: function (a) {
            return "";
        },
        onLoadSuccess: function (row) {
            console.log("table load success:", row);
        },
        // onLoadError: function (row) {
        //     jumpToIndex(row);
        // },
        // 行点击事件
        onClickRow: function (row, $element, field) {
            var i = $element.data('index'); //可通过此参数获取当前行号
            index = i;
             
        },


    })
}


/**
 * 功能： 确认按钮点击事件
 */

$("#queryTaskconfirmbtn").click(function(){
    parent.childToParent(index);

});

/**
 * 功能： 取消按钮点击事件
 */

$("#queryTaskclosebtn").click(function(){
    parent.hideChildWin(index);

});