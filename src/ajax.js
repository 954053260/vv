/**
 * Created by tz on 2016/12/9.
 */
export default {
    install: function (Vue, option) {
        option = option || {};
        let http = Vue.http = Vue.prototype.$http = {};
        http.config = {
            root: option.root || '',
            timeout: option.timeout || 0,
            success: option.success || function () {},
            fail: option.fail || function () {},
            ontimeout: option.ontimeout || function () {return '连接超时'}
        };
        /**
         * GET请求
         * @param url 请求地址
         * @param options 请求选项 {data:'一个普通对象，通过请求发送给服务器',
         * dataType:'从服务器返回的预期的数据类型,，默认json'}
         * return promise
         */
        http.get = function (url, options) {
            return new Promise(function (resolve, reject) {

                if (url.indexOf('?') != -1) {
                    url += urlEncode(options.data);
                } else {
                    url += '?' + urlEncode(options.data).slice(1);
                }

                var xhr = new XMLHttpRequest();
                xhr.timeout = http.config.timeout;
                xhr.open("GET", http.config.root + url, true);
                xhr.responseType = options.dataType || "json";

                xhr.onload = function () {
                    option.success(this.response);
                    resolve(this.response);
                };

                xhr.error = function () {
                    option.fail(this.statusText);
                    reject(this.statusText);
                };

                xhr.ontimeout = function () {
                    option.fail('连接超时');
                    http.config.ontimeout();
                    reject();
                };

                xhr.send();
            });
        };
        /**
         * POST请求
         * @param url 请求地址
         * @param options 请求选项 {data:'一个普通对象，通过请求发送给服务器',
         * dataType:'从服务器返回的预期的数据类型,，默认json'}
         * return promise
         */
        http.post = function (url, options) {
            return new Promise(function (resolve, reject) {
                var xhr = new XMLHttpRequest();
                xhr.timeout = http.config.timeout;
                xhr.open("POST", http.config.root + url, true);
                xhr.responseType = options.dataType || "json";
                xhr.setRequestHeader("content-type", "application/x-www-form-urlencoded; charset=UTF-8");

                xhr.onload = function () {
                    option.success(this.response);
                    resolve(this.response);
                };

                xhr.error = function () {
                    option.fail(this.statusText);
                    reject(this.statusText);
                };

                xhr.ontimeout = function () {
                    option.fail('连接超时');
                    reject(http.config.ontimeout());
                };

                xhr.send(urlEncode(options.data).slice(1));
            });
        };

        http.jsonp = function (url,options) {
            return new Promise(function (resolve, reject) {
                var head = document.getElementsByTagName('head')[0];
                var script = document.createElement('script');
                var timer;
                head.appendChild(script);

                window.jsonpCallback = function (data) {
                    option.fail(data);
                    resolve (data);
                    head.removeChild(script);
                    clearTimeout(timer);
                };

                options.data.callback = 'jsonpCallback';

                if (url.indexOf('?') != -1) {
                    url += urlEncode(options.data);
                } else {
                    url += '?' + urlEncode(options.data).slice(1);
                }

                script.src = http.config.root + url;

                if (http.config.timeout) {
                    timer = setTimeout(function () {
                        option.fail('连接超时');
                        reject(http.config.ontimeout());
                        head.removeChild(script);
                    }, http.config.timeout);
                }

            });
        };

        /**
         * param 将要转为URL参数字符串的对象
         * key URL参数字符串的前缀
         * encode true/false 是否进行URL编码,默认为true
         * return URL参数字符串
         */
        function urlEncode (param, key, encode) {

            if (param == null) {
                return '';
            }

            var str = '';
            var t = typeof (param);

            if (t == 'string' || t == 'number' || t == 'boolean') {
                str += '&' + key + '=' + ((encode == null || encode) ? encodeURIComponent(param) : param);
            } else {

                for (var i in param) {

                    if (param.hasOwnProperty(i)) {
                        var k = key == null ? i : key + (param instanceof Array ? '[' + i + ']' : '.' + i);
                        str += urlEncode(param[i], k, encode);
                    }

                }

            }
            return str;
        }
    }
}
