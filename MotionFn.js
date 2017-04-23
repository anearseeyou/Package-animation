/**
 * 自己封装的运动方法
 */


/**
 * 封装ID函数
 * @param id 获取ID
 * @returns {Element}
 */

function $(id) {
    return document.getElementById(id);
}


/**
 * 隐藏函数
 * @param obj  隐藏对象
 * @returns {string}
 */

function hide(obj) {
    return obj.style.display = 'none';
}


/**
 * 显示函数
 * @param obj 显示对象
 * @returns {string}
 */

function show(obj) {
    return obj.style.display = 'block';
}


/**
 * 获取屏幕的宽度和高度
 * 获取方式: client().width / client().height;
 * @returns {*}
 */

function client() {
    if (window.innerWidth != null) {
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    }
    else if (document.compatMode === "CSS1compat") {
        return {
            width: document.documentElement.clientWidth,
            height: document.documentElement.clientHeight
        }
    }
    else {
        return {
            width: document.body.clientWidth,
            height: document.body.clientHeight
        }
    }
}


/**
 * 封装scroll函数
 * 获取方式:scroll().top / left
 * @returns {*}
 */

function scroll() {
    if (window.pageXOffset != undefined) { // IE9+ 和 最新浏览器
        return {
            top: window.pageYOffset,
            left: window.pageXOffset
        }
    }
    else if (document.compatMode == 'CSS1Compat') { // w3c标准
        return {
            top: document.documentElement.scrollTop,
            left: document.documentElement.scrollLeft
        }
    }
    return {
        top: document.body.scrollTop,
        left: document.body.scrollLeft
    }
}


/**
 * 封装匀速动画
 * @param obj  谁做动画
 * @param target 目标位置
 * @param speed  行驶速度
 */
function constant(obj, target, speed) {
    // 1. 清除定时器
    clearInterval(obj.timer);

    // 2. 判断方向
    var dir = obj.offsetLeft < target ? speed : -speed;

    // 3. 设置定时器
    obj.timer = setInterval(function () {
        obj.style.left = obj.offsetLeft + dir + 'px';
        if (Math.abs(target - obj.offsetLeft) < speed) {
            clearInterval(obj.timer);
            obj.style.left = target + 'px';
            console.log(obj.offsetLeft, target);
        }
    }, 20);
}


/**
 * 缓动动画函数
 * @param {object} obj  对象
 * @param {object} json 对象
 * @param {function} fn 函数
 */

function animate(obj, json, fn) {
    // 1.清除定时器
    clearInterval(obj.timer);
    var flag = true, initial, target, step;
    // 2.开始定时器
    obj.timer = setInterval(function () {
        flag = true;
        // 4.遍历json k是属性 json[k]是属性值
        for (var k in json) {
            // 5.获取css属性值并赋值给initial 这里调用获取属性函数
            // 5.1透明度判断
            if ('opacity' == k) {
                initial = getStyleAttr(obj, k) == 0 ? 0 : Math.round(parseFloat(getStyleAttr(obj, k)) * 100) || 100;
                target = parseInt(json[k] * 100);
            }
            // 5.2滚动判断
            else if ('scrollTop' == k) { // 其他情况
                initial = obj.scrollTop;
                target = parseInt(json[k]);
            }
            // 5.3其他情况
            else {
                initial = parseInt(getStyleAttr(obj, k)) || 0;
                target = parseInt(json[k]);
            }
            // 6.计算步长
            step = (target - initial) / 20;
            // 7.判断
            step = (target >= initial) ? Math.ceil(step) : Math.floor(step);
            // 8.设置透明度
            if ('opacity' == k) {

                obj.style.opacity = (initial + step) / 100;
                obj.style.filter = 'alpha(opacity=' + (initial + step) + ')';
            }
            // 8.1设置层级
            else if ('zIndex' == k) {
                obj.style[k] = json[k];
            }
            // 8.2设置滚动
            else if ('scrollTop' == k) {
                obj.scrollTop = initial + step;
            }
            // 8.3正常情况
            else {
                obj.style[k] = initial + step + 'px';

            }
            // 9.目标没到位置 不停止 判断一定写遍历里面
            if (initial != target) {
                flag = false;
            }
        }
        // 10.目标到达位置才停止定时器
        if (flag) {
            clearInterval(obj.timer);
            // 10.1 回调函数 一定是等前面的动画做完才调用
            if (fn) {
                fn();
            }
        }
    }, 10);
}


/**
 * 获取css属性的属性值
 * @param {object} obj  对象
 * @param {string} attr 属性
 * @returns {string}
 */

function getStyleAttr(obj, attr) {
    if (obj.currentStyle) {
        // IE和OP
        return obj.currentStyle[attr];
    }
    else {
        // W3C标准
        return window.getComputedStyle(obj, null)[attr];
    }
}