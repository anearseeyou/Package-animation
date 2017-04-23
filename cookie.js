/**
 * 封装cookie
 */
// 获取指定cookie的值
function getCookie(key) {
    var array =  document.cookie.split("; ");
    for(var i = 0, len = array.length; i < len; i++){
        var subArr = array[i].split("=");
        if(subArr[0] == key){
            return subArr[1];
        }
    }
}

// 添加cookie
function addCookie(key, value, expires) {
    // 1.计算时间
    if(!expires){
        document.cookie = key+"="+value+"; ";
    }else{
        var date = new Date();
        date.setDate(date.getDate() + 7);
        document.cookie = key+"="+value+"; expires="+date+"; ";
    }
}

// 删除cookie
function deleteCookie(key) {
    addCookie(key, getCookie(key), -1);
}