/**
 * Created by tz on 2017/6/5.
 */
import Vue from 'vue'
export default {
    state: {
        markers: [],
        positionResult: {
            lat: 0,
            lng: 0,
            address: '',
            nearestJunction: '',
            nearestRoad: '',
            nearestPOI:''
        },
        organizationTypesIndex: 0,
        typeIndex: 0,
        dateIndex: 0,
        activityOrganizationTypes: [{value: 0, desc: '全部'}],
        activityTypes: [{value: 0, desc: '全部'}],
        dateRange: [{value: 0, desc: '全部'}]
    },
    getters: {},
    mutations: {
        SET_MARKERS: (state, data) => {
            state.markers = data;
        },
        SET_ORGANIZATION_TYPES: (state, data) => {
            if (state.activityOrganizationTypes.length == 1) {
                state.activityOrganizationTypes = state.activityOrganizationTypes.concat(data);
            }

        },
        SET_ACTIVITY_TYPES: (state, data) => {
            if (state.activityTypes.length == 1) {
                state.activityTypes = state.activityTypes.concat(data);
            }
        },
        SET_DATE_RANGE: (state, data) => {
            if (state.dateRange.length == 1) {
                state.dateRange = state.dateRange.concat(data);
            }
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
            return Vue.http.get('/activity/nearby/centerPoint', {data: option})
                .then(data => {
                    if (data.code == 0) {
                        var markers = [];
                        data.datas.activities.forEach((item) => {
                            markers.push({
                                activityNo: item.activityNo,
                                title: item.title,
                                center: item.longitude + ',' + item.latitude,
                                info: item
                            });
                        });
                        commit('SET_ORGANIZATION_TYPES', data.datas.activityOrganizationTypes);
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