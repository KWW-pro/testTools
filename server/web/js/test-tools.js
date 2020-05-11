/** 
 * @file
 * @author  臧家琪
 * @desc test-Tools
 * @date 2019-4-28
 * @last modified by zangjiaqi
 */
var taskID = "";
var listData = [];
var g_resObjArr = [];
var redisTask_resArr = [];


$(function () {
    console.log("初始化----->");
    //selectRedisInfo();
})

/*
*功能：创建taskid
*/
function creatTaskID() {
    var str = 'abcdefghijklmnopqrstuvwxyz9876543210';
    var tmpStr = "";
    var tmpLength = str.length;
    //var tmpStrId = tmpStr + "id";

    for (var b = 0; b < 16; b++) {
        tmpStr += str.charAt(Math.floor(Math.random() * tmpLength));
    }
    taskID = tmpStr;
}

/*
*功能：查询任务按钮
*/
$("#querytestbtn").click(function () {
    listData = [];
    var url = "getTestTask";
    var params = {};
    var ret;
    sendRequest(false, "POST", url, params, function (result) {
        ret = JSON.parse(result);
        if (ret.result === 0) {
            listData = ret.para;
            console.log("listData", listData);
            $("#queryTaskModaliframe")[0].contentWindow.initTaskTable(listData);
        }
        else {
            alert("查询任务失败");
            return;
        }
    });
    $('#queryTaskModal').modal('show');
})

function childToParent(index) {
    console.log("index", index);
    if (index == undefined) {
        alert("请选择任务");
        return;

    }
    else {
        taskID = listData[index].TaskID;
        $("#taskID").val(taskID);
        $("#queryTaskModal").modal('hide');
    }
}

function hideChildWin(){
    $("#queryTaskModal").modal('hide');
}

/*
*功能：添加任务
*/
$("#starttestbtn").click(function () {
    startTest();
})
function startTest() {
    creatTaskID()
    var serverIp = $("#serverip").val();
    if (!serverIp) {
        alert("缺少服务器IP");
        return;
    }

    var serverport = $("#serverport").val();
    if (!serverport) {
        alert("缺少服务器IP");
        return;
    }

    var type = "-999";
    type = parseInt($("#type").val());

    var connectCount = $("#connectCount").val();
    if (!connectCount) {
        connectCount = "50";
    }

    var commondCount = $("#commondCount").val();
    if (!commondCount) {
        commondCount = "100000";
    }

    var valueSize = $("#valueSize").val();
    if (!valueSize) {
        valueSize = "2";
    }

    var commondList = $("#commondList").val();


    var timeOut = $("#timeOut").val();
    if (!timeOut) {
        timeOut = "1";
    }

    var redisServerPassword = $("#redisServerPassword").val();

    var url = "addTask";
    var params = {
        "TaskID": taskID,
        "Host": serverIp,
        "Port": serverport,
        "Type": type,
        "ConnectCount": connectCount,
        "CommondCount": commondCount,
        "ValueSize": valueSize,
        "CommondList": commondList,
        "TimeOut": timeOut,
        "RedisServerPassword": redisServerPassword,
    };
    var ret;
    console.log("content-----", params);

    sendRequest(false, "POST", url, params, function (result) {
        ret = JSON.parse(result);
        console.log("ret------->", ret);
        if (ret.result === 0) {
            alert("创建测试任务成功");
            $("#taskID").val(taskID);
            return;
        }
        else {
            alert("创建测试任务失败");
            return;
        }
    });
}

/*
* 功能：查询redisInfo
*/
$("#querRedisInfoybtn").click(function () {
    taskID = $("#taskID").val();
    console.log("taskID", taskID)
    if (taskID) {
        g_resObjArr = [];
        var url = 'getDbInfo';
        var params = {
            "TaskID": taskID
        };
        var ret;
        sendRequest(false, "POST", url, params, function (result) {
            ret = JSON.parse(result);
            console.log("ret------>", ret);
            if (ret.result === 0) {
                g_resObjArr = ret.para;
                if (g_resObjArr.length == 0) {
                    alert("任务执行失败");
                    return;
                }
                else
                    selectRedisInfo();
            }
            else {
                alert("查询数据库信息失败");
                return;
            }
        });
    }
    else {
        alert("缺少查询条件");
        return;
    }


})

function selectRedisInfo() {
    var totalEchartContent = "";
    var echartsContent = "";
    $("#redisInfochartsId").html("");
    echartsContent += '<div class ="w_part">'
    echartsContent += '<div class = "w_dataCharts"' + 'id = w_dataCharts_' + taskID + '></div>';
    echartsContent += '</div>'
    totalEchartContent += echartsContent;
    $("#redisInfochartsId").append(totalEchartContent);
    initDataFun();
}

/*
* 功能：查询RedisTask
*/
$("#queryRedisTaskbtn").click(function () {
    taskID = $("#taskID").val();
    if (taskID) {
        redisTask_resArr = [];
        var url = 'getTaskInfo';
        var params = {
            "TaskID": taskID
        };
        var ret;
        sendRequest(false, "POST", url, params, function (result) {
            ret = JSON.parse(result);
            console.log("ret------>", ret);
            if (ret.result === 0) {
                redisTask_resArr = ret.para;
                if (redisTask_resArr.length == 0) {
                    alert("任务正在进行中");
                    return;
                }
                else
                    selectRedisTask();
            }
            else {
                alert("查询数据库信息失败");
                return;
            }
        });
    }
    else {
        alert("缺少查询条件");
        return;
    }


})
function selectRedisTask() {
    var totalEchartContent = "";
    var echartsContent = "";
    $("#redisTaskchartsId").html("");
    echartsContent += '<div class = "redisTask_part">';
    echartsContent += '<div class = "redisTask_dataCharts"' + 'id = redisTask_dataCharts_' + taskID + '></div> ';
    echartsContent += '</div>';
    totalEchartContent += echartsContent;
    $("#redisTaskchartsId").append(totalEchartContent);
    redisTaskDateFun();
}

/*
*功能：redisInfo的echarts图像
*/
//准备传递数据给echarts
function initDataFun() {
    console.log("initDataFun----->", g_resObjArr);
    var timeArr = [];
    var USED_MEMORY_RSS = [];
    var USED_MEMORY_PEAK = [];
    var MEMORY_PERC = [];
    var USED_CPU_SYS = [];
    var USED_CPU_USER = [];
    var CONNECTED_CLIENTS = [];
    var BLOCKED_CLIENTS = [];
    var CMDSTAT_PING = [];
    var CMDSTAT_GET = [];
    var CMDSTAT_SET = [];
    var KEYSPACE_HITS = [];
    var KEYSPACE_MISSES = [];
    var KEYSPACE_HITS_PERC = [];
    var TOTAL_NET_INPUT_BYTES = [];
    var TOTAL_NET_OUTPUT_BYTES = [];
    for (var i = 0; i < g_resObjArr.length; i++) {
        var newTime = "";
        for (var j = 0; j < g_resObjArr[i].INFO_DATE.length; j++) {
            newTime = g_resObjArr[i].INFO_DATE.substring(11, 21);
        }
        timeArr.push(newTime);
        USED_MEMORY_RSS.push(g_resObjArr[i].USED_MEMORY_RSS);
        USED_MEMORY_PEAK.push(g_resObjArr[i].USED_MEMORY_PEAK);
        MEMORY_PERC.push(g_resObjArr[i].MEMORY_PERC);
        USED_CPU_SYS.push(g_resObjArr[i].USED_CPU_SYS);
        USED_CPU_USER.push(g_resObjArr[i].USED_CPU_USER);
        CONNECTED_CLIENTS.push(g_resObjArr[i].CONNECTED_CLIENTS);
        BLOCKED_CLIENTS.push(g_resObjArr[i].BLOCKED_CLIENTS);
        CMDSTAT_PING.push(g_resObjArr[i].CMDSTAT_PING);
        CMDSTAT_GET.push(g_resObjArr[i].CMDSTAT_GET);
        CMDSTAT_SET.push(g_resObjArr[i].CMDSTAT_SET);
        KEYSPACE_HITS.push(g_resObjArr[i].KEYSPACE_HITS);
        KEYSPACE_MISSES.push(g_resObjArr[i].KEYSPACE_MISSES);
        KEYSPACE_HITS_PERC.push(g_resObjArr[i].KEYSPACE_HITS_PERC);
        TOTAL_NET_INPUT_BYTES.push(g_resObjArr[i].TOTAL_NET_INPUT_BYTES);
        TOTAL_NET_OUTPUT_BYTES.push(g_resObjArr[i].TOTAL_NET_OUTPUT_BYTES);


    }
    var ret = {
        'TASK_ID': taskID,
        'timeArr': timeArr,
        'USED_MEMORY_RSS': USED_MEMORY_RSS,
        'USED_MEMORY_PEAK': USED_MEMORY_PEAK,
        'MEMORY_PERC': MEMORY_PERC,
        'USED_CPU_SYS': USED_CPU_SYS,
        'USED_CPU_USER': USED_CPU_USER,
        'CONNECTED_CLIENTS': CONNECTED_CLIENTS,
        'BLOCKED_CLIENTS': BLOCKED_CLIENTS,
        'CMDSTAT_PING': CMDSTAT_PING,
        'CMDSTAT_GET': CMDSTAT_GET,
        'CMDSTAT_SET': CMDSTAT_SET,
        'KEYSPACE_HITS': KEYSPACE_HITS,
        'KEYSPACE_MISSES': KEYSPACE_MISSES,
        'KEYSPACE_HITS_PERC': KEYSPACE_HITS_PERC,
        'TOTAL_NET_INPUT_BYTES': TOTAL_NET_INPUT_BYTES,
        'TOTAL_NET_OUTPUT_BYTES': TOTAL_NET_OUTPUT_BYTES,
    }
    console.log("timeArr", timeArr.length);
    chartsInit(ret);
}
//初始化echarts函数
function chartsInit(message) {
    console.log("chartsInit----->", JSON.stringify(message));
    // var ret = sliceArrayFun(message);
    // if(ret === -1){
    //     return;
    // }s
    var c_id = "w_dataCharts_" + message.TASK_ID;
    console.log("c_id---->", c_id);
    var myCharts = echarts.init(document.getElementById(c_id));
    myCharts.clear();

    var option = {

        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['USED_MEMORY_RSS', 'USED_MEMORY_PEAK', 'MEMORY_PERC', 'USED_CPU_SYS', 'USED_CPU_USER', 'CONNECTED_CLIENTS', 'BLOCKED_CLIENTS', 'CMDSTAT_PING', 'CMDSTAT_GET', 'CMDSTAT_SET', 'KEYSPACE_HITS', 'KEYSPACE_MISSES', 'KEYSPACE_HITS_PERC', 'TOTAL_NET_INPUT_BYTES', 'TOTAL_NET_OUTPUT_BYTES'],
            selected: {
                "USED_MEMORY_RSS": false,
                "USED_MEMORY_PEAK": false,
                "MEMORY_PERC": true,
                "USED_CPU_SYS": false,
                "USED_CPU_USER": false,
                "CONNECTED_CLIENTS": false,
                "BLOCKED_CLIENTS": false,
                "CMDSTAT_PING": false,
                "CMDSTAT_GET": false,
                "CMDSTAT_SET": false,
                "KEYSPACE_HITS": false,
                "KEYSPACE_MISSES": false,
                "KEYSPACE_HITS_PERC": false,
                "TOTAL_NET_INPUT_BYTES": false,
                "TOTAL_NET_OUTPUT_BYTES": false,
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: message.timeArr,
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: 'USED_MEMORY_RSS',
                type: 'line',
                stack: '总量',
                data: message.USED_MEMORY_RSS,
                showSymbol: false,
            },
            {
                name: 'USED_MEMORY_PEAK',
                type: 'line',
                stack: '总量',
                data: message.USED_MEMORY_PEAK
            },
            {
                name: 'MEMORY_PERC',
                type: 'line',
                stack: '总量',
                data: message.MEMORY_PERC
            },
            {
                name: 'USED_CPU_SYS',
                type: 'line',
                stack: '总量',
                data: message.USED_CPU_SYS
            },
            {
                name: 'USED_CPU_USER',
                type: 'line',
                stack: '总量',
                data: message.USED_CPU_USER
            },
            {
                name: 'CONNECTED_CLIENTS',
                type: 'line',
                stack: '总量',
                data: message.CONNECTED_CLIENTS
            },
            {
                name: 'BLOCKED_CLIENTS',
                type: 'line',
                stack: '总量',
                data: message.BLOCKED_CLIENTS
            },
            {
                name: 'CMDSTAT_PING',
                type: 'line',
                stack: '总量',
                data: message.CMDSTAT_PING
            },
            {
                name: 'CMDSTAT_GET',
                type: 'line',
                stack: '总量',
                data: message.CMDSTAT_GET
            },
            {
                name: 'CMDSTAT_SET',
                type: 'line',
                stack: '总量',
                data: message.CMDSTAT_SET
            },
            {
                name: 'KEYSPACE_HITS',
                type: 'line',
                stack: '总量',
                data: message.KEYSPACE_HITS
            },
            {
                name: 'KEYSPACE_MISSES',
                type: 'line',
                stack: '总量',
                data: message.KEYSPACE_MISSES
            },
            {
                name: 'KEYSPACE_HITS_PERC',
                type: 'line',
                stack: '总量',
                data: message.KEYSPACE_HITS_PERC
            },
            {
                name: 'TOTAL_NET_INPUT_BYTES',
                type: 'line',
                stack: '总量',
                data: message.TOTAL_NET_INPUT_BYTES
            },
            {
                name: 'TOTAL_NET_OUTPUT_BYTES',
                type: 'line',
                stack: '总量',
                data: message.TOTAL_NET_OUTPUT_BYTES
            },
        ]
    };
    myCharts.setOption(option);
}

/*
*功能：redisTask的echarts图像
*/

function redisTaskDateFun() {
    var TASK_ID = ""
    var LEGEND = [];
    var redisBenchmarkInfo = []
    var hiRedisInfo = []
    console.log("redisTask_resArr", redisTask_resArr);
    for (var i = 0; i < redisTask_resArr.length; i++) {
        if (redisTask_resArr[i].redisBenchmarkInfo_dict) {
            TASK_ID = redisTask_resArr[i].redisBenchmarkInfo_dict.TASK_ID
            LEGEND.push(redisTask_resArr[i].redisBenchmarkInfo_dict.TEST_TYPE);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.SET);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.GET);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.INCR);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.LPUSH);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.RPUSH);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.LPOP);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.RPOP);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.SADD);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.HSET);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.SPOP);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.LRANGE_100);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.LRANGE_300);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.LRANGE_500);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.LRANGE_600);
            redisBenchmarkInfo.push(redisTask_resArr[i].redisBenchmarkInfo_dict.MSET);
        }
    }
    for (var i = 0; i < redisTask_resArr.length; i++) {
        if (redisTask_resArr[i].hiRedisInfo_dict) {
            TASK_ID = redisTask_resArr[i].hiRedisInfo_dict.TASK_ID
            LEGEND.push(redisTask_resArr[i].hiRedisInfo_dict.TEST_TYPE);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.SET);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.GET);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.INCR);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.LPUSH);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.RPUSH);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.LPOP);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.RPOP);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.SADD);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.HSET);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.SPOP);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.LRANGE_100);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.LRANGE_300);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.LRANGE_500);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.LRANGE_600);
            hiRedisInfo.push(redisTask_resArr[i].hiRedisInfo_dict.MSET);
        }
    }
    var ret = {
        "TASK_ID": TASK_ID,
        "LEGEND": LEGEND,
        "redisBenchmarkInfo": redisBenchmarkInfo,
        "hiRedisInfo": hiRedisInfo
    };
    redisTaskChartsInit(ret);
}

function redisTaskChartsInit(message) {
    console.log("redisTaskChartsInit----->", JSON.stringify(message));

    var c_id = "redisTask_dataCharts_" + message.TASK_ID;
    console.log("c_id------->", c_id);
    var myCharts = echarts.init(document.getElementById(c_id));
    myCharts.clear();
    if (message.LEGEND.length > 1 && message.LEGEND[0] == "redisBenchmark") {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: message.LEGEND
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: ['SET', 'GET', 'INCR', 'LPUSH', 'RPUSH', 'LPOP', 'RPOP', 'SADD', 'HSET', 'SPOP', 'LRANGE_100', 'LRANGE_300', 'LRANGE_500', 'LRANGE_600', 'MSET']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: message.LEGEND[0],
                    type: 'bar',
                    barGap: 0,
                    data: message.redisBenchmarkInfo
                },
                {
                    name: message.LEGEND[1],
                    type: 'bar',
                    data: message.hiRedisInfo
                },

            ]
        };
    }
    else if (message.LEGEND.length > 1 && message.LEGEND[0] == "hiRedis") {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: message.LEGEND
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: ['SET', 'GET', 'INCR', 'LPUSH', 'RPUSH', 'LPOP', 'RPOP', 'SADD', 'HSET', 'SPOP', 'LRANGE_100', 'LRANGE_300', 'LRANGE_500', 'LRANGE_600', 'MSET']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: message.LEGEND[0],
                    type: 'bar',
                    barGap: 0,
                    data: message.hiRedisInfo
                },
                {
                    name: message.LEGEND[1],
                    type: 'bar',
                    data: message.redisBenchmarkInfo

                },

            ]
        };
    }
    else if (message.LEGEND[0] == "redisBenchmark") {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: message.LEGEND
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: ['SET', 'GET', 'INCR', 'LPUSH', 'RPUSH', 'LPOP', 'RPOP', 'SADD', 'HSET', 'SPOP', 'LRANGE_100', 'LRANGE_300', 'LRANGE_500', 'LRANGE_600', 'MSET']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: message.LEGEND[0],
                    type: 'bar',
                    barGap: 0,
                    data: message.redisBenchmarkInfo
                },
            ]
        };

    }
    else if (message.LEGEND[0] == "hiRedis") {
        var option = {
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            legend: {
                data: message.LEGEND
            },
            toolbox: {
                show: true,
                orient: 'vertical',
                left: 'right',
                top: 'center',
            },
            xAxis: [
                {
                    type: 'category',
                    axisTick: { show: false },
                    data: ['SET', 'GET', 'INCR', 'LPUSH', 'RPUSH', 'LPOP', 'RPOP', 'SADD', 'HSET', 'SPOP', 'LRANGE_100', 'LRANGE_300', 'LRANGE_500', 'LRANGE_600', 'MSET']
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: message.LEGEND[0],
                    type: 'bar',
                    barGap: 0,
                    data: message.hiRedisInfo
                },
            ]
        };

    }
    myCharts.setOption(option);
}

