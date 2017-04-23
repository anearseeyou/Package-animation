/**
 * 通过jQuery原理封装一些常用功能
 */

(function (window, undefined) {

    // 提供给外界使用的工厂方法 用于创建jQuery对象
    var myjQ = function (selector) {

        // 相当于通过jQuery原型上的init创建了一个对象
        return new myjQ.fn.init(selector);
    }

    // 替换jQuery对象的默认原型为自定义的对象
    myjQ.prototype = {
        constructor: myjQ,
        init: function (selector) {

            // 1.传入 '空' null undefined NaN  0  false
            if (!selector) {
                return this;
            }

            // 2.传入函数
            else if (myjQ.isFunction(selector)) {
                myjQ.ready(selector);
            }

            // 3.传入字符串
            else if (myjQ.isString(selector)) {

                // 2.1 为了提升用户体验 先去除首尾的空格
                selector = myjQ.trim(selector);

                // 2.2 判断是否是代码片段
                // 最短的代码就是<a> 长度大于等3
                if (myjQ.isHTML(selector)) {
                    // 1. 创建一个临时元素 作为容器使用
                    var temp = document.createElement('div');
                    temp.innerHTML = selector;

                    // 2. 取出所有的一级元素(temp.children) 然后依次添加到当前的对象上
                    /*
                     for (var i = 0, len = temp.children.length; i < len; i++) {
                     // 动态添加属性
                     this[i] = temp.children[i];
                     }
                     // 3. 给当前的jQuery实例添加length属性
                     this.length = temp.children.length;
                     */

                    // 等价于上面的for循环
                    //[].push.apply(this, temp.children);
                    this.arr2jQ(temp.children);
                }

                // 2.3 判断是否是选择器
                else {
                    // 1.根据传入的选择器找到对应的元素
                    var nodes = document.querySelectorAll(selector);

                    // 2.遍历所有的元素依次添加给当前的jQuery实例对象
                    //[].push.apply(this, nodes);
                    this.arr2jQ(nodes);
                }
            }

            // 4.传入数组
            //必须是对象 不能是function 不能是window
            else if (myjQ.isLikeArray(selector)) {
                //1. 不管是真数组还是伪数组 都先转化成真数组
                //var temp = [].slice.call(selector);

                //2. 在利用apply将真数组转化成伪数组(这里是为了兼容万恶的IE才会绕一圈的)
                //[].push.apply(this, temp);

                this.arr2jQ(selector);
            }

            // 5.其他情况
            else {
                this[0] = selector;
                this.length = 1;
            }

        },

        // 版权信息\默认为空\默认length为0
        jquery: '1.1.0',
        selector: '',
        length: 0,

        // toArray 把实例转换为数组返回
        toArray: function () {
            return [].slice.call(this);
        },

        // get 获取指定下标的元素，获取的是原生DOM
        get: function (index) {
            // 1.判断有没有传递参数
            if (arguments.length == 0) {
                return this.toArray();
            }
            // 2.判断是否是正数
            else if (index >= 0) {
                return this[index];
            }
            // 判断是否是负数
            else {
                return this[this.length + index];
            }
        },

        // eq 获取指定下标的元素，获取的是jQuery类型的实例对象
        eq: function (index) {
            // 判断有没有传递参数
            if (arguments.length == 0) {
                return myjQ();
            }
            else {
                return $(this.get(index));
            }

        },

        // first 获取实例中的第一个元素，是jQuery类型的实例对象
        first: function () {
            return this.eq(0);
        },

        // last 获取实例中的最后一个元素，是jQuery类型的实例对象
        last: function () {
            return this.eq(-1);
        },
        /*
         1.push\sort\splice通过谁调用?
         通过jQ实例调用
         2.方法有一个特点
         谁调用内部的this就是谁
         */
        push: [].push,
        sort: [].sort,
        splice: [].splice,

        // each遍历
        each: function (fn) {
            myjQ.each(this, fn);

        }
    }

    // 注意点:一定要将原型放在修改之后 否则为undefined
    // 动态的给jQury对象添加一个属性叫做fn,将fn的属性值赋值给jQuery的原型对象
    myjQ.fn = myjQ.prototype;

    // 将init的原型设置为jQuery的原型
    myjQ.fn.init.prototype = myjQ.fn;

    // 将内部的变量暴露i给外界使用
    window.myjQ = window.$ = myjQ;

    // 给jQuery函数以及jQuery原型扩展方法
    myjQ.extend = myjQ.fn.extend = function (obj) {
        // 遍历取出传入对象的key和value
        for (var key in obj) {
            // 利用取出的值动态给this添加属性
            // 注意: 如果是函数调用 那么this就是函数
            //      如果是对象调用,那么this就是对象
            this[key] = obj[key];
        }
    }

    /*
     封装方法的规律:
     工具方法能用静态尽量使用静态方法, 方便/快捷
     但是需要考虑如下因素:
     1.当前方法中有没有访问当前对象的属性

     注意点:
     jQuery的插件就是通过extend来实现的
     在企业开发中有一个规范, 如果编写的是jQuery的插件, 那么文件要按照如下格式来命名
     jQuery.插件名称.js
     */

    // 添加静态方法
    myjQ.extend({
        // 判断是否是字符串
        isString: function (str) {
            return typeof str === 'string';
        },

        // 判断是否是代码片段
        isHTML: function (html) {
            return html.charAt(0) == '<' &&
                html.charAt(html.length - 1) == '>' &&
                html.length >= 3;
        },

        // 去除首尾空格
        trim: function (str) {
            // 判断当前浏览器是否支持trim
            if (str.trim) {
                return str.trim();
            }
            // 如果不支持就自己实现
            else {
                return str.replace(/^\s+|\s+$/g, '');
            }
        },

        // 判断是否是一个对象
        isObject: function (obj) {
            return obj != null && typeof obj === 'object';
        },

        // 判断是否是一个方法
        isFunction: function (fn) {
            return typeof fn === 'function';
        },

        // 判断是否是window
        isWindow: function (win) {
            return win === window.window
        },

        // 判断是否是真伪数组
        isLikeArray: function (arr) {
            if (!myjQ.isObject(arr) || myjQ.isFunction(arr) || myjQ.isWindow(arr)) {
                return false;
            }
            if (({}).toString.call(arr) === '[object Array]') {
                return true;
            }
            else if ('length' in arr && arr.length - 1 in arr) {
                return true;
            }
            return false;
        },

        // 监听文档是否加载完成
        ready: function (fn) {
            // 1.直接判断文档是否加载完毕
            if (document.readyState == 'complete') {
                fn();
            }
            // 2.添加监听
            // 2.1判断是否支持addEventListener
            if (document.addEventListener) {
                document.addEventListener('DOMContentLoaded', fn);
            }
            // 2.2如果不支持就通过attachEvent
            else {
                document.attachEvent('onreadystatechange', function () {
                    // 为了避免重复执行, 需要判断当前的状态是否已经加载完毕
                    if (document.readyState == 'complete') {
                        fn();
                    }
                });
            }
        },

        // 遍历指定的对象
        each: function (obj, fn) {
            // 1.遍历真伪数组
            if (myjQ.isLikeArray(obj)) {
                for (var i = 0, len = obj.length; i < len; i++) {
                    /*
                     * 第一个参数 修改fn内部的this
                     * 第二个参数 给fn传递第一个参数
                     * 第三个参数 给fn传递第二个参数
                     * fn.call(obj[i],i,obj[i]);
                     * */
                    if (fn.call(obj[i], i, obj[i]) == false) {
                        break;
                    }
                }
            }

            // 2.遍历对象
            else {
                for (var key in obj) {
                    if (fn.call(obj[key], key, obj[key]) == false) {
                        break;
                    }
                }
            }
        },

        map: function (obj, fn) {
            // 创建一个数组 用于保存fn函数返回的数据
            var res = [];

            // 遍历真伪数组
            if ('length' in obj) {
                for (var i = 0, len = obj.length; i < len; i++) {
                    res.push(fn(obj[i], i));
                }
            }
            // 遍历对象
            else {
                for (var key in obj) {
                    res.push(fn(obj[key], key));
                }
            }
            return res;
        }

    });

    myjQ.extend({
        addEvent: function (dom, type, fn) {
            // 安全校验
            if (!(myjQ.isString(type) || !myjQ.isFunction(fn) || dom.nodeType) != 1) {
                return;
            }
            // 添加事件
            // 判断浏览器是否指出addeventlistener
            if (window.addEventListener) {
                dom.addEventListener(type, fn);
            }
            else {
                dom.attachEvent('on' + type, fn);
            }
        },
        removeEvent: function (dom, type, fn) {
            // 安全校验
            if (!myjQ.isString(type) || !myjQ.isFunction(fn) || dom.nodeType != 1) {
                return;
            }
            // 移除事件
            if (window.addEventListener) {
                dom.removeEventListener(type, fn);
            }
            else {
                dom.detachEvent('on' + type, fn);
            }
        }
    });

    // 添加实例方法
    myjQ.fn.extend({
        arr2jQ: function (arr) {
            /*
             for(var i = 0, len = arr.length; i < len; i++){
             this[i] = arr[i];
             }
             */
            var self = this;
            $.each(arr, function (key, value) {
                self[key] = value;
            });
        }
    });

    // DOM操作
    myjQ.fn.extend({

        // empty ==> 清空所有元素的内容
        empty: function () {
            this.each(function () {
                // 里面的this是遍历到的value
                this.innerHTML = '';
            });
            return this;
        },

        // remove ==> 删除所有的元素
        remove: function () {
            this.each(function () {
                // 找到value对应的父元素
                var fatherElement = this.parentNode;

                // 通过父元素删除子元素
                fatherElement.removeChild(this);
            });
            return this;
        },

        // html ==> 设置所有元素的内容，获取第一个元素的内容
        html: function (text) {
            // 如果没有传递参数
            if (arguments.length == 0) {

                // 获得第一个元素的内容返回
                return this[0].innerHTML;
            }

            // 传递了参数
            else {
                // 遍历取出所有元素
                this.each(function () {
                    this.innerHTML = text;
                });
                return this;
            }
        },

        // text ==> 设置所有元素的文本内容，获取所有元素的文本内容
        text: function (content) {
            var len = arguments.length;
            var res = '';
            // 1.遍历取出所有的元素
            this.each(function () {
                /*
                 * 注意点:
                 * arguments写在那个函数中就获取的是那个函数的参数个数
                 * 我们想获取的是text的参数个数
                 * 但是arguments写在each的fn方法中,获取到的是each中fn方法中的参数个数
                 * 而不是text的
                 * */
                if (len == 0) {
                    res += res + this.innerText;
                }
                else {
                    this.innerText = content;
                }
            });

            // 返回结果
            return (arguments.length == 0) ? res : this;
        },

        // appendTo ==> 把所有的元素，添加到指定的元素中
        appendTo: function (selector) {
            // 1.不管是什么对象 都转换成jQ实例对象
            var jSelector = $(selector);

            var res = [];

            // 2.循环遍历每一个被添加的元素
            this.each(function (key, value) {

                // 3.遍历每一个目标元素
                $(jSelector).each(function (index) {

                    // 4.判断是否是第一次添加
                    if (index == 0) {
                        // 如果是第一个 我们就用原生的标签
                        this.appendChild(value);
                        res.push(this);
                    }

                    // 5.不是第一次添加的话 就克隆目标元素依次添加
                    else {
                        var temp = value.cloneNode(true);
                        this.appendChild(temp);
                        res.push(temp);
                    }
                });
            });
            return $(res);
        },

        // prependTo ==> 把所有的元素，添加到指定元素中的最前面*/
        prependTo: function (selector) {
            var jSelector = $(selector);
            var res = [];
            var self = this;

            // 遍历每一个目标元素
            $(jSelector).each(function (key) {
                var targetEle = jSelector[key];
                var reference = targetEle.firstChild;

                // 遍历每一个被添加到的元素
                self.each(function (index) {
                    var moveEle = self[index];
                    if (key == 0) {
                        targetEle.insertBefore(moveEle, reference);
                        res.push(moveEle);
                    }
                    else {
                        var temp = moveEle.cloneNode(true);
                        targetEle.insertBefore(temp, reference);
                        res.push(temp);
                    }
                });
            });
            return $(res);
        },

        // append ==> 给所有的元素，添加新的内容*/
        append: function (content) {
            // 1.判断是否是对象
            if (!myjQ.isObject(content)) {
                this.each(function () {
                    this.innerHTML += content;
                });
            }
            // 2.是对象
            else {
                $(content).appendTo(this);
            }
        },

        // prepend ==> 给所有的元素的最前面，添加新的元素
        prepend: function (content) {
            // 1.判断是否是对象
            if (!myjQ.isObject(content)) {
                this.each(function () {
                    this.innerHTML = content + this.innerHTML;
                });
            }

            // 2.对象
            else {
                $(content).prependTo(this);
            }
        }
    });

    // CSS处理
    myjQ.fn.extend({
        // attr: 设置属性节点的值
        attr: function (name, value) {
            // 1.判断有没有传递参数
            if (arguments.length == 0 || (!myjQ.isString(name) && !myjQ.isObject(name))) {
                throw  '请传入正确的参数';
            }

            // 2.判断是否传递了一个参数
            else if (arguments.length == 1) {
                // 判断传入的是否是一个字符串
                if (myjQ.isString(name)) {
                    return this[0].getAttribute(name);
                }
                // 判断传入的是否是一个对象
                else {
                    // 遍历取到所有的DOM元素
                    this.each(function (key, dom) {
                        // 遍历传入的对象
                        for (var key in name) {
                            // 给每一个DOM元素设置属性节点值
                            dom.setAttribute(key, name[key]);
                        }
                    })
                }
            }

            // 3.判断是否传入了两个参数
            else if (arguments.length == 2) {
                // 取出所有的DOM元素
                this.each(function (key, dom) {
                    dom.setAttribute(name, value);
                });
            }

            return this;
        },

        // removeAttr: 删除指定属性节点的值
        removeAttr: function (name) {
            if (arguments.length == 1) {
                // 取出所有的DOM元素
                this.each(function (key, dom) {
                    // 根据传入的参数, 删除对应属性节点的值
                    // 这个虽然值不见了, 但是属性节点名称还在
                    //dom.setAttribute(name, "");
                    dom.attribute.removeNamedItem(name);
                });
                return this;
            }
        },

        // prop: 设置属性的值
        prop: function (name, value) {
            // 1.过滤数据
            if (arguments.length == 0 || (!myjQ.isString(name) && !myjQ.isObject(name))) {
                throw  '请传入正确的参数';
            }
            // 2.判断是否传入一个参数
            else if (arguments.length == 1) {
                // 判断传入的是否是字符串
                if (myjQ.isString(name)) {
                    return this[0][name];
                }
                // 判断是否是对象
                else {
                    // 取出所有的DOM元素
                    this.each(function (index, dom) {
                        // 遍历传入的值
                        for (var key in name) {
                            dom[key] = name[key];
                        }
                    });
                }
                return this;
            }
            // 3.判断是否传入两个参数
            else if (arguments.length == 2) {
                // 遍历取出所有的DOM元素
                this.each(function (key, dom) {
                    dom[name] = value;
                });
            }
        },

        // removeProp: 删除指定的属性
        removeProp: function (name) {
            // 判断有没有传递参数
            if (arguments.length == 0) {
                // 取出每一个DOM元素
                this.each(function (key, dom) {
                    delete dom[name];
                });
                return this;
            }
        },

        // val : 获取DOM元素value的值
        val: function (content) {
            // 判断是否传入参数
            if (arguments.length == 0) {
                // 注意: 这里的value是属性value 而不是实例节点 比较特殊
                return this[0]['value'];
            }
            // 判断是否传入一个参数
            else if (arguments.length == 1) {
                // 取出所有的元素
                this.each(function (key, dom) {
                    dom['value'] = content;
                });
                return this;
            }
        },

        // hasClass: 判断某个DOM上有没有某个Class
        hasClass: function (name) {
            if (arguments.length == 1) {
                var flag = false;
                // 取出所有的DOM元素
                this.each(function (key, dom) {
                    // 取出当前dom的class
                    var className = ' ' + dom.className + ' ';
                    // 利用indexOf判断
                    // 这里的return是将结果返回给了内部的fn, 而hasClass的fn不会拿到结果
                    //flag = className.indexOf(' '+name+' ') != -1;
                    if (flag = className.indexOf(' ' + name + ' ') != -1) {
                        // 中断循环
                        return false;
                    }
                });
            }
            return flag;
        },

        // addClass: 给所有元素添加类
        addClass: function (str) {
            if (arguments.length == 1 && myjQ.isString(str)) {
                // 1.将传入的字符转化为数组
                var names = str.split(" ");
                // 2.取出所有DOM元素
                // 注意点: 遍历去除的dom是原生的DOM对象, 而不是jQ实例
                this.each(function (key, dom) {
                    // 3.遍历取出所有的类名
                    $.each(names, function (index, name) {
                        // 4.判断当前DOM元素上是否已经添加了当前遍历到的类
                        if (!($(dom).hasClass(name))) {
                            dom.className = dom.className + ' ' + name;
                        }
                    });
                });
            }
            return this;
        },

        // removeClass: 删除所有元素指定的class
        removeClass: function (str) {
            // 判断是否没有传入参数
            if (arguments.length == 0) {
                // 取出所有DOM元素
                this.each(function (key, dom) {
                    dom.className = "";
                });
            }
            // 判断是否是字符串
            else if (myjQ.isString(str) && arguments.length == 1) {
                // 将出传入的字符串转化为数组
                var arr = str.split(" ");
                // 取出所有DOM元素
                this.each(function (key, dom) {
                    // 取出所有需要删除的类名
                    $.each(arr, function (index, name) {
                        // 拿到当前遍历到的className
                        var className = ' ' + dom.className + ' ';
                        // 替换字符串
                        dom.className = className.replace(' ' + name + ' ', ' ');
                        dom.className = myjQ.trim(dom.className);
                    });
                });
            }

            return this;
        },

        // toggleClass: 有就删除没有就添加
        toggleClass: function (str) {
            // 判断有没有传递参数
            if (arguments.length == 0) {
                this.removeClass();
            }
            // 判断是否传入了一个参数
            else if (arguments.length == 1) {
                // 将传递的参数转化为数组
                var names = str.split(" ");

                // 取出所有DOM元素
                this.each(function (key, dom) {
                    var $dom = $(dom);
                    console.log($dom)
                    // 遍历取出传入的每一个类名
                    $.each(names, function (index, name) {
                        // 判断当前遍历到的元素上有没有当前遍历到的类名
                        if ($dom.hasClass(name)) {
                            // 有则删除
                            $dom.removeClass(name);
                            $dom.className = myjQ.trim($dom);
                        } else {
                            // 没有则添加
                            $dom.addClass(name);
                        }
                    });

                });
            }
            return this;
        }


    });

    // 事件处理
    myjQ.fn.extend({
        on: function (type, fn) {
            this.each(function (key, dom) {
                // 注册时间
                $.addEvent(dom, type, fn);
            });
            return this;
        },
        off: function (type, fn) {
            // 遍历取出所有的DOM元素
            this.each(function (key, dom) {
                // 移除事件
                $.removeEvent(dom, key, fn);
            });
            return this;
        }
    });

})(window);