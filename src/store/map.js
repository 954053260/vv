/**
 * Created by tz on 2017/6/5.
 */
import Vue from 'vue'
export default {
    state: {
        markers: [],
        markerIndex: 0,
        positionResult: {
            lat: 0,
            lng: 0,
            address: '',
            nearestJunction: '',
            nearestRoad: '',
            nearestPOI:''
        },
        activityTypes: [],
        dateRange: []
    },
    getters: {},
    mutations: {
        SET_MARKER_INDEX: (state, index) => {
            state.markerIndex = index;
        },
        SET_MARKERS: (state, data) => {
            state.markers = data;
        },
        SET_ACTIVITY_TYPES: (state, data) => {
            state.activityTypes = data;
        },
        SET_DATE_RANGE: (state, data) => {
            state.dateRange = data;
        },
        SET_POSITION_RESULT: (state, data) => {
            state.positionResult.lat = data.position.lat;
            state.positionResult.lng = data.position.lng;
            state.positionResult.address = data.address;
            state.positionResult.nearestJunction = data.nearestJunction;
            state.positionResult.nearestRoad = data.nearestRoad;
            state.positionResult.nearestPOI = data.nearestPOI;
        }
    },
    actions: {
        refreshMarker ({commit}, option) {
            return Vue.http.get('activity/nearby/centerPoint', {data: option})
                .then(data => {
                    if (data.code == 0) {

                        var markers = [];

                        data.datas.activities.forEach((item) => {
                            markers.push({
                                activityNo: item.activityNo,
                                title: item.title,
                                center: item.longitude + ',' + item.latitude,
                                info: {
                                    title: item.title,
                                    address: item.address,
                                    startDate: item.beginTime,
                                    endDate: item.endTime,
                                    typeText: item.activityType,
                                    user: {
                                        name: item.linkMan,
                                        phone: item.linkPhone
                                    },
                                    status: item.activityStatus,
                                    desc: item.content
                                }
                            });
                        });

                        data.datas.activityTypes.unshift({value: 0, desc: '全部'});
                        data.datas.dateRange.unshift({value: 0, desc: '全部'});
                        commit('SET_ACTIVITY_TYPES', data.datas.activityTypes);
                        commit('SET_DATE_RANGE', data.datas.dateRange);
                        commit('SET_MARKERS', markers);
                        return data;
                    } else {
                        return Promise.reject(data.msg);
                    }
                });
        }
    }
}