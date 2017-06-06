/**
 * Created by o on 2017/5/20.
 */
export default {
    install: function (Vue, option) {

        var isLoadMap = false,
            idLoadUI = false,
            mapFns = [];

        var map = Vue.map = Vue.prototype.$map = {};

        /*地图操作都在load进行*/
        map.loadMap = function (fn) {
            if (typeof fn === 'function') {

                if (isLoadMap && idLoadUI) {
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
                    toolBar = new AMap.ToolBar(),
                    geolocation;

                toolBar.hide();

                geolocation = new AMap.Geolocation({
                    showCircle: false,
                    timeout: 10000,
                    zoomToAccuracy: false,
                    showButton: false
                });

                map.gd.addControl(geolocation);


                map.doLocation = function (complete, error) {

                    function onComplete (data) {
                        complete && complete(data);
                        AMap.event.removeListener(geolocation, 'complete', onComplete);
                        AMap.event.removeListener(geolocation, 'error', onError);
                    }

                    function onError (data) {
                        error && error(data);
                        AMap.event.removeListener(geolocation, 'complete', onComplete);
                        AMap.event.removeListener(geolocation, 'error', onError);
                    }

                    AMap.event.addListener(geolocation, 'complete', onComplete);
                    AMap.event.addListener(geolocation, 'error', onError);

                    geolocation.getCurrentPosition();
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

                isLoadMap = true;

                if (idLoadUI) {
                    mapFns.forEach(function (fn) {
                        fn(map);
                    });
                }

            });

            //AMapUI.setDomLibrary(Zepto);

            AMapUI.loadUI(['overlay/SimpleMarker', 'control/BasicControl', 'misc/PositionPicker'],
                function(SimpleMarker, BasicControl, PositionPicker) {
                    var casicControl = new BasicControl.Zoom({
                            position: 'rm', //left top，左上角
                            theme: 'm'
                        }),
                        positionPicker = new PositionPicker({
                            mode:'dragMap',
                            map: map.gd
                        });


                    map.gd.addControl(casicControl);

                    map.createMarker = function (data) {

                        return new SimpleMarker({
                            map: map.gd,
                            animation: 'AMAP_ANIMATION_DROP',
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

                    map.positionPicker = function (success, error) {

                        function complete (data) {
                            success && success(data);
                        }

                        function fail (data) {
                            error && error(data);
                        }

                        positionPicker.on('success', complete);
                        positionPicker.on('fail', fail);

                        return {
                            show: function () {
                                positionPicker.start();
                            },
                            stop: function () {
                                positionPicker.stop();
                            },
                            remove: function () {
                                positionPicker.off('success', complete);
                                positionPicker.off('fail', fail);
                            }
                        };
                    };

                    idLoadUI = true;

                    if (isLoadMap) {
                        mapFns.forEach(function (fn) {
                            fn(map);
                        });
                    }
                });
        });
    }
}