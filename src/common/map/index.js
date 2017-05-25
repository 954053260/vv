/**
 * Created by o on 2017/5/20.
 */
export default {
    install: function (Vue, option) {

        var isLoadMap = false,
            mapFns = [];

        var map = Vue.map = Vue.prototype.$map = {};

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

            AMap.plugin(['AMap.ToolBar', 'AMap.Scale', 'AMap.Geolocation'], function(){

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

                //创建并添加工具条控件
                map.gd.addControl(scale);
                map.gd.addControl(toolBar);
            });



            AMapUI.loadUI(['overlay/SimpleMarker', 'control/BasicControl'],
                function(SimpleMarker, BasicControl) {
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

                    isLoadMap = true;
                    mapFns.forEach(function (fn) {
                        fn(map);
                    });
                });


        });
    }
}