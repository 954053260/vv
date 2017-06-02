/**
 * Created by o on 2017/5/20.
 */
export default {
    install: function (Vue, option) {

        var isLoadMap = false,
            mapFns = [];

        var map = Vue.map = Vue.prototype.$map = {
            /**
             * 地图操作都在load进行
             * @param fn function 回调函数
             */
            loadMap: function (fn) {
                if (typeof fn === 'function') {

                    if (isLoadMap) {
                        fn(map);
                    } else {
                        mapFns.push(fn);
                    }
                }
            },
            // 定位
            doLocation: function () {},
            /**
             * 创建地图标记
             * @param data object 标记对象
             */
            createMarker: function (data) {},
            /**
             * 选择城市
             * @param fn function 回调函数
             */
            selectCity: function (fn) {}
        };

        /*地图操作都在load进行*/
        map.loadMap = function (fn) {
            if (typeof fn === 'function') {

                if (isLoadMap) {
                    fn(map);
                } else {
                    mapFns.push(fn);
                }
            }
        };

        window.addEventListener('load', function () {
            map.gd = new AMap.Map(option.id, option);

            map.gd.setMapStyle('amap://styles/f121c6be8803515c5ca5faeb33cd5085');

            AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation', 'AMap.Autocomplete'], function(){

                var scale = new AMap.Scale(),
                    toolBar = new AMap.ToolBar();

                toolBar.hide();

                map.doLocation = function (fn, timeout = 10000) {

                    var time = setTimeout(function () {
                        callback();
                    }, timeout);

                    var locationEvent = AMap.event.addListener(toolBar, 'location', callback);

                    function callback (data) {

                        if (typeof fn === 'function') {
                            fn(data ? {msg: '定位成功！'} : {msg: '定位超时！'});
                        }

                        AMap.event.removeListener(locationEvent);

                        clearTimeout(time);

                    }

                    toolBar.doLocation();
                };

                map.autoComplete = function (id, city) {
                    var autoOptions = {
                        city: city || "", //城市，默认全国
                        input: id         //使用联想输入的input的id
                    };

                    var autoComplete = new AMap.Autocomplete(autoOptions);

                    console.log('autoComplete', autoComplete);
                };


                //创建并添加工具条控件
                map.gd.addControl(scale);
                map.gd.addControl(toolBar);
            });

            AMapUI.setDomLibrary(Zepto);

            AMapUI.loadUI(['overlay/SimpleMarker', 'control/BasicControl', 'misc/MobiCityPicker'],
                function(SimpleMarker, BasicControl, MobiCityPicker) {
                    map.gd.addControl(new BasicControl.Zoom({
                        position: 'rm', //left top，左上角
                        theme: 'm'
                    }));

                    map.createMarker = function (data) {

                        return new SimpleMarker({
                            map: map.gd,
                            iconStyle: data.iconColor || 'blue',
                            iconLabel: {
                                innerHTML: data.no || '',
                                style: {
                                    color:'white'
                                }
                            },
                            label: {
                                content: data.title,
                                offset: new AMap.Pixel(27, 25)
                            },
                            position: data.center.split(','),
                            clickable: true
                        });

                    };

                    map.selectCity = function (fn) {
                        var cityPicker = new MobiCityPicker({
                            theme: 'vv'
                            //topGroups: ..., // 顶部城市列表
                        });

                        //监听城市选中事件
                        cityPicker.on('citySelected', function(cityInfo) {
                            //隐藏城市列表
                            cityPicker.hide();
                            fn && fn(cityInfo);
                            //选中的城市信息
                            console.log(cityInfo);
                        });

                        //显示城市列表，可以用某个click事件触发
                        cityPicker.show();
                    };

                    isLoadMap = true;
                    mapFns.forEach(function (fn) {
                        fn(map);
                    });
                });
        });
    }
}