/**
 * 封装Ajax
 * @param data
 * @returns {string}
 */

function json2str(data) {

    // 0.添加随机因子
    data.t = Math.random();

    // 1.定义一个数组
    var arr = [];
    // 2.遍历传入的json对象
    for(var key in data){
        // 3.将json转化为数组
        arr.push(key+"="+encodeURI(data[key]));
    }
    // 4.将数组转化为固定格式的字符串
    // console.log(arr.join("&"));
    return arr.join("&");
}

function ajax(options) {
    // 0.安全处理
    if(!options.url){
        return;
    }
    options.type = options.type || "get";
    options.data = options.data || null;
    options.timeout = options.timeout || 0;

    // 1.创建异步对象
    if(window.XMLHttpRequest){
        var xhr = new XMLHttpRequest();
    }else{
        var xhr = new ActiveXObject("Microsoft.XMLHTTP");
    }

    // 对参数进行处理
    var str = json2str(options.data);

    // 判断请求的类型
    if(options.type == "get"){
        // 2.设置URL
        xhr.open(options.type, options.url+"?"+str, true);
        // 3.发送请求
        xhr.send();
    }else{
        // 2.设置URL
        xhr.open(options.type, options.url, true);

        xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");

        // 3.发送请求
        xhr.send(str);
    }

    // 4.监听请求
    xhr.onreadystatechange = function () {
        // 5.对请求返回的数据进行处理
        if(xhr.readyState == 4){
            // 如果已经请求成功, 那么需要清空定时器
            clearTimeout(timer);
            if(xhr.status >= 200 && xhr.status < 300 || xhr.status == 304){
                // console.log("接收数据成功");
                options.success(xhr.responseText);
            }else{
                // console.log("接收数据失败");
                options.error(xhr.status);
            }
        }
    }
    // 6.对超时进行处理
    if(options.timeout){
        var timer = setTimeout(function () {
            alert("请求超时");
            // 如果请求超时了, 那么应该中断请求
            xhr.abort();
        }, options.timeout);
    }
}