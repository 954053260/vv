/**
 * Created by o on 2017/5/20.
 */
export default {
    install: function (Vue, option) {
        var isLoaded = false,
            fns = [];

        Vue.wx = Vue.prototype.$wx = {
            config: function () {},
            share: function () {},
            previewImage: function () {}
        };

        if (!window.vvAppId) {
            return;
        }

        function wxConfig () {
            fns = [];
            wx.config({
                debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                appId: window.vvAppId, // 必填，企业号的唯一标识，此处填写企业号corpid
                timestamp: window.vvTimestamp, // 必填，生成签名的时间戳
                nonceStr: window.vvNonceStr, // 必填，生成签名的随机串
                signature: window.vvSignature,// 必填，签名，见附录1
                jsApiList: ["chooseImage", "uploadImage", "previewImage", "onMenuShareTimeline", "onMenuShareAppMessage", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone"] // 必填，需要使用的JS接口列表，所有JS接口列表见附录2
            });
        }

        wxConfig();

        wx.ready(function(){
            isLoaded = true;
            fns.forEach(function (fn) {
                fn();
            });
            fns = [];
        });

        wx.error(function(res){
            alert("errorMSG:" + res);
        });

        Vue.wx.config = wxConfig;

        Vue.wx.share = function (title, link, imgUrl, desc) {
            function fn () {
                // 分享到朋友圈
                wx.onMenuShareTimeline({
                    title: title,
                    link: link,
                    imgUrl: imgUrl
                });

                // 分享给朋友
                wx.onMenuShareAppMessage({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl
                });

                // 分享到QQ
                wx.onMenuShareQQ({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl
                });

                // 分享到QQ空间
                wx.onMenuShareQZone({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl
                });

                // 分享到腾讯微博
                wx.onMenuShareWeibo({
                    title: title,
                    desc: desc,
                    link: link,
                    imgUrl: imgUrl
                });
            }
            if (isLoaded) {
                fn();
            } else {
                fns.push(fn);
            }
        };

        Vue.wx.previewImage = function (current, urls) {
            function fn () {
                wx.previewImage({
                    current: current,
                    urls: urls
                });
            }
            if (isLoaded) {
                fn();
            } else {
                fns.push(fn);
            }
        };

        Vue.wx.chooseImage = function (count, success) {
            wx.chooseImage({
                count: count, // 默认9
                success: success
            });
        };

        Vue.wx.uploadImage = function (localId, success) {
            wx.uploadImage({
                localId: localId,
                success: success
            });
        };

    }
}