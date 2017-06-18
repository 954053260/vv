/**
 * Created by o on 2017/5/20.
 */
export default {
    install: function (Vue, option) {

        var isLoadMap = false,
            idLoadUI = false,
            mapFns = [];

        var map = Vue.map = Vue.prototype.$map = {
            mapScale: {3: 1000000, 4: 500000, 5: 200000, 6: 100000, 7: 50000, 8: 30000, 9: 20000, 10: 10000, 11: 5000, 12: 2000, 13: 1000, 14: 500, 15: 200, 16: 100, 17: 50, 18: 25}
        };

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
                            //iconStyle: { //自定义外观
                            //    url: 'static/img/position-picker.png',
                            //    ancher: [20, 32],
                            //    size: [40, 40]
                            //}
                        });


                    map.gd.addControl(casicControl);

                    map.createMarker = function (data) {

                        return new SimpleMarker({
                            map: map.gd,
                            animation: 'AMAP_ANIMATION_DROP',
                            iconStyle: {
                                src: 'static/img/marker-icon.png',
                                style: {
                                    width:'35px',
                                    height:'35px'
                                }
                            },
                            //label: {
                            //    content: data.title,
                            //    offset: new AMap.Pixel(27, 25)
                            //},
                            position: data.center.split(','),
                            clickable: true
                        });

                    };

                    map.getPositionPicker = function () {
                        return positionPicker;
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
                                return this;
                            },
                            stop: function () {
                                positionPicker.stop();
                                return this;
                            },
                            remove: function () {
                                positionPicker.off('success', complete);
                                positionPicker.off('fail', fail);
                                return this;
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