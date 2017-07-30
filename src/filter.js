/**
 * Created by tz on 2017/3/20.
 */
import Vue from 'vue'

Vue.filter('date', function (value, format) {

    var date = new Date(value);

    if (date == 'Invalid Date') {
        return value;
    }

    var o = {
        "M+": date.getMonth() + 1, //月份
        "d+": date.getDate(), //日
        "h+": date.getHours() % 12 == 0 ? 12 : date.getHours() % 12, //小时
        "H+": date.getHours(), //小时
        "m+": date.getMinutes(), //分
        "s+": date.getSeconds(), //秒
        "q+": Math.floor((date.getMonth() + 3) / 3), //季度
        "S": date.getMilliseconds() //毫秒
    };
    var week = {
        "0": "/u65e5",
        "1": "/u4e00",
        "2": "/u4e8c",
        "3": "/u4e09",
        "4": "/u56db",
        "5": "/u4e94",
        "6": "/u516d"
    };
    if (/(y+)/.test(format)) {
        format = format.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    }
    if (/(E+)/.test(format)) {
        format = format.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "") + week[date.getDay() + ""]);
    }
    for (var k in o) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        }
    }

    return format;
});

Vue.filter('dateStyle', function (value) {
    var date = new Date(value);

    if (date == 'Invalid Date') {
        return value;
    }

    var dateToday = new Date().getTime();
    var dateTodayNum = new Date().getDay();
    var dateTheDay = new Date(value).getTime();
    var dateTheDayNum = new Date(value).getDay();
    var timeText = ''; //返回文字格式
    switch (true) {
        //天
        case ((dateTheDay + 3600000 * 24) >= dateToday && dateTodayNum == dateTheDayNum):
            timeText = Vue.filter('date')(dateTheDay, 'HH:mm');
            break;
        //昨天
        case (dateTheDay + 3600000 * 24 * 2) >= dateToday:
            timeText = '昨天 ' + Vue.filter('date')(dateTheDay, 'HH:mm');
            break;
        //一星期内
        case (dateTheDay + 3600000 * 24 * 7) >= dateToday:
            timeText = Vue.filter('date')(dateTheDay, 'HH:mm');
            switch (new Date(dateTheDay).getDay()) {
                case 0:
                    timeText =  '星期日 ' + timeText;
                    break;
                case 1:
                    timeText = '星期一 ' + timeText;
                    break;
                case 2:
                    timeText = '星期二 ' + timeText;
                    break;
                case 3:
                    timeText = '星期三 ' + timeText;
                    break;
                case 4:
                    timeText = '星期四 ' + timeText;
                    break;
                case 5:
                    timeText = '星期五 ' + timeText;
                    break;
                case 6:
                    timeText = '星期六 ' + timeText;
                    break;
            }
            break;
        default:
            timeText = Vue.filter('date')(dateTheDay, 'M月d日');
            break;
    }

    return timeText;
});

