/**
 * Created by tz on 2017/6/5.
 */
import Vue from 'vue'
export default {
    state: {
        markers: [
            {
                no: 1,
                iconColor: 'blue',
                title: '决战赤壁',
                center: '113.0759,22.9170',
                info: {
                    title: '决战赤壁',
                    user: {
                        name: '孔明'
                    },
                    address: '湖北省蒲圻市西北36公里的长江南岸',
                    startDate: new Date(),
                    endDate: new Date(),
                    typeText: '文化',
                    status: 1,
                    desc: '它也是中国历史上第一次在长江流域进行的大规模江河作战，标志着中国军事政治中心不再限于黄河流域。孙刘联军最后以火攻大破曹军，曹操北回，孙、刘各自夺去荆州的一部分'
                }
            },
            {
                no: 2,
                iconColor: 'blue',
                title: '割须弃袍',
                center: '113.2769,23.1170',
                info: {
                    title: '马孟起',
                    user: {
                        name: '马孟起'
                    },
                    address: '陕西省渭南市潼关县北',
                    startDate: new Date(),
                    endDate: new Date(),
                    typeText: '文化',
                    status: 2,
                    desc: '“操在乱军中，只听得西凉军大叫：“穿红袍的是曹操！”操就马上急脱下红袍。又听得大叫：“长髯者是曹操！”操惊慌，掣所佩刀断其髯。超遂令人叫拏短髯者是曹操。操闻之，即扯旗角包颈而逃'
                }
            },
            {
                no: 3,
                iconColor: 'red',
                title: ' 单骑救主',
                center: '113.4779,23.3170',
                info: {
                    title: ' 赵子龙单骑救主',
                    user: {
                        name: '赵子龙'
                    },
                    address: '湖北省宜昌市县级市当阳市长坂坡',
                    startDate: new Date(),
                    endDate: new Date(),
                    typeText: '文化',
                    status: 3,
                    desc: '荆州刘表病死其子刘琮不战而降，刘备率众十余万退走江陵。曹操知江陵有军资害怕被刘备占据就亲率5000虎豹骑一日一夜奔袭三百里追至当阳长坂将刘备击溃，乱军之中刘备弃家小带张飞诸葛亮赵云等十余骑退走，路上赵云单枪匹马杀回长坂坡，与虎豹骑且战且退，最终救出后主母子'
                }
            },
            {
                no: 4,
                iconColor: 'red',
                title: '过五斩六',
                center: '113.0759,23.1170',
                info: {
                    title: '过五关斩六将',
                    user: {
                        name: '关云长'
                    },
                    address: '河南省许昌',
                    startDate: new Date(),
                    endDate: new Date(),
                    typeText: '文化',
                    status: 4,
                    desc: '过东岭关时杀孔秀；过洛阳城时杀韩福、孟坦；过汜水关时杀卞喜；过荥阳时杀太守王植；过黄河渡口时杀秦琪，“过五关斩六将”因此得名。'
                }
            },
            {
                no: 5,
                iconColor: 'red',
                title: '桃园结义',
                center: '113.2769,22.9670',
                info: {
                    title: '桃园三结义',
                    user: {
                        name: '刘玄德'
                    },
                    address: '河北涿州市涿郡',
                    startDate: new Date(),
                    endDate: new Date(),
                    typeText: '文化',
                    status: 3,
                    desc: '东汉末年，朝政腐败，再加上连年灾荒，人民生活非常困苦。刘备有意拯救百姓，张飞、关羽又愿与刘备共同干一番事业。三人情投意合，选定张飞庄后一桃园。此时正值桃花盛开，景色美丽，张飞准备了青牛白马，作为祭品，焚香礼拜，宣誓完毕；三个人按年岁认了兄弟。刘备年长做了大哥，关羽第二，张飞最小做了弟弟'
                }
            },
            {
                no: 6,
                iconColor: 'red',
                title: '煮酒论英雄',
                center: '113.4779,23.0170',
                info: {
                    title: '煮酒论英雄',
                    user: {
                        name: '曹孟德'
                    },
                    address: '河南省许昌',
                    startDate: new Date(),
                    endDate: new Date(),
                    typeText: '文化',
                    status: 3,
                    desc: '操以手指玄德，然后自指曰：“天下英雄，唯使君与操耳。”煮酒论英雄煮酒论英雄玄德闻言，吃了一惊，手中所执匙箸，不觉落于地下。时正值天雨将至，雷声大作。玄德乃从容拾箸曰：“一震之威，乃至于此！”电视《三国演义》这一集也煞是好看，青梅煮酒，天外龙挂，气象森森。可是，不管小说也好，电视也好，过去几年的“三国热”中，评点三国的人，大都舍却此篇，不知何故'
                }
            }
        ],
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
                        data.datas.activityTypes.unshift({value: 0, desc: '全部'});
                        data.datas.dateRange.unshift({value: 0, desc: '全部'});
                        commit('SET_ACTIVITY_TYPES', data.datas.activityTypes);
                        commit('SET_DATE_RANGE', data.datas.dateRange);
                        return data;
                    } else {
                        return Promise.reject(data.msg);
                    }
                });
        }
    }
}