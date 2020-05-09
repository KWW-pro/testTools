$(function () {
    var userinfoSession = JSON.parse(sessionStorage.getItem("userinfo"));
    var ip_addr = document.location.hostname;
    console.log("ip_addr  ", ip_addr)
    if (userinfoSession != null) {
        userinfo = userinfoSession
        console.log("userinfo ", userinfo);
    }

})


function sendRequest(async, method, urlKeyWords, content, handleResponse, domainIPPort = "") {
    var xmlhttp = new XMLHttpRequest();
    var failText = {
        "result": -1,
        "desc": "send failed"
    };
    // var date = new Date();
    // var time = dateFtt("yyyy-MM-ddTHH:mm:ss", date);
    // var userinfo_ip, userinfoStr, userinfoStrEs;
    // userinfo_ip = JSON.parse(sessionStorage.getItem("userinfo"));
    // userinfoStr = getCookie("userinfo");
    // userinfoStrEs = unescape(userinfoStr);
    // userinfo_ip = JSON.parse(userinfoStrEs);
    var userinfo_ip =document.location.hostname;
    var userinfo_port = document.location.port;
    serverIP = userinfo_ip +":"+userinfo_port;
    console.log("userinfo_ip",serverIP)
    if (domainIPPort !== "" && domainIPPort !== undefined && domainIPPort !== null) {
        serverIP = domainIPPort;
    }
    console.log("sendRequest content:", serverIP, content);
    if (!!urlKeyWords && !!serverIP) {
        var url;
        url = "http://" + serverIP + "/" + urlKeyWords;
        console.log("url=======",  async, url);
        //异步发送请求
        if (async) {
            xmlhttp.open(method, url, async);
            xmlhttp.sendRequest("Content-type", "application/json;charset=UTF-8");
            // 向服务器发送请求
            xmlhttp.send(content);
            // 是异步的时候
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState === 4) {
                    if (xmlhttp.status === 200) {
                        // 请求发送成功，获得返回值
                        handleResponse(xmlhttp.responseText);
                    } else if (xmlhttp.status === 504) {
                        console.log("async error: ", xmlhttp.response);
                        failText.desc = $.i18n("tomcatStartupAnomaly");
                        failText.response = xmlhttp.response;
                        handleResponse(JSON.stringify(failText));
                    } else {
                        console.log("async error : ", xmlhttp.response);
                        failText.desc = $.i18n("asyncCallError");
                        failText.response = xmlhttp.response;
                        handleResponse(JSON.stringify(failText));
                    }
                } else {
                    //console.log("正在接收", xmlhttp.readyState);
                }
            }
        }else{
            xmlhttp.open(method, url, async);
            xmlhttp.withCredentials = true; // 设置运行跨域操作 
             //简单化处理。都采用同步的方式
            if(urlKeyWords.indexOf("sysauthserver/login") > -1){
                xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.send(content);
            }else{
                xmlhttp.setRequestHeader("Access-Control-Allow-Origin","*");　
                //xmlhttp.setRequestHeader('Access-Control-Allow-Headers', 'Content-Type, Content-Length, Authorization, Accept, X-Requested-With , yourHeaderFeild');
                xmlhttp.setRequestHeader("Content-type", "application/json;charset=UTF-8");
                
                //xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
                xmlhttp.send(JSON.stringify(content));
            }
            console.log("xmlhttp.status", xmlhttp.status);
            if (xmlhttp.status === 200) {
                var docXml = JSON.parse(xmlhttp.responseText);
                handleResponse(xmlhttp.responseText);
            } else if (xmlhttp.status == 401 || xmlhttp.status == 466) {
                // failText.desc = $.i18n("pleaseLogInAgain");
                failText.response = xmlhttp.response;
                console.log("sync error:", xmlhttp.response);
                jumpToIndex(xmlhttp.status);
                console.log("xmlhttp.status", xmlhttp.status);
            } else {
                // failText.desc = $.i18n("interfaceConnectionFailed");
                failText.response = xmlhttp.response;
                console.log("sync error: ", xmlhttp.response);
                handleResponse(JSON.stringify(failText));
            }
        }
    }else{
        if (serverIP === "" || serverIP === undefined) {
            failText.desc =$.i18n("serverIPDoesNotExist");

            handleResponse(JSON.stringify(failText));
        }
        if (urlKeyWords === "") {
            failText.desc = $.i18n("URLParametersIsEmpty");

            handleResponse(JSON.stringify(failText));
        }
    }
}
