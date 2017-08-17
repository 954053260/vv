/**
 * Created by tz on 2017/6/8.
 */
import EXIF from '../../lib//exif.js'

export default {
    install: function (Vue) {
        Vue.file = Vue.prototype.$file = {
            upload: function (option) {
                option = {
                    max: option.max || 5,
                    success: option.success || function () {},
                    fail: option.fail || function () {}
                };

                var images = {
                    localId: [],
                    serverId: []
                };

                Vue.wx.chooseImage(option.max, (res) => {
                    images.localId = res.localIds;

                    if (images.localId.length == 0) {
                        option.fail({msg: '请先使用 chooseImage 接口选择图片'});
                        return;
                    }

                    var i = 0, length = images.localId.length;
                    images.serverId = [];
                    function upload() {
                        Vue.wx.uploadImage(images.localId[i], (res) => {
                            i++;
                            images.serverId.push(res.serverId);
                            if (i < length) {
                                upload();
                            } else {
                                option.success(images.serverId);
                            }
                        });
                    }
                    upload();
                });


                //let input = document.createElement("input");
                //input.setAttribute('type', 'file');
                //input.className = 'upload-image-20170608';
                //input.style.display = 'none';
                //
                //if (!option.isSingle) {
                //    input.setAttribute('multiple', 'multiple');
                //}
                //
                //if (option.type == 'image') {
                //    input.setAttribute('accept', 'image/*');
                //}
                //
                //document.body.appendChild(input);
                //
                //input.onchange = function () {
                //
                //    if (!this.files.length) {
                //        return;
                //    }
                //
                //    var files = Array.prototype.slice.call(this.files);
                //
                //    if (files.length > option.max) {
                //        option.fail({msg: '最多同时只可上传' + option.max + '张图片'});
                //        return;
                //    }
                //
                //    files.forEach(function (file) {
                //
                //        if (!/\/(?:jpeg|png|gif)/i.test(file.type)) {
                //            return;
                //        }
                //
                //        var reader = new FileReader();
                //
                //        reader.onload = function() {
                //            var result = this.result;
                //            var img = new Image();
                //            img.src = result;
                //            img.onload = function () {
                //                drawPhoto(img, 0, 0, img.width, img.height, (src) => {
                //                    var img = new Image();
                //                    img.src = src;
                //
                //                    //如果图片大小小于100kb，则直接上传
                //                    if (src.length <= option.size) {
                //                        img = null;
                //                        option.success(src, file.type);
                //                    } else {
                //
                //                        if (img.complete) {
                //                            callback();
                //                        } else {
                //                            img.onload = callback;
                //                        }
                //
                //                        function callback() {
                //                            option.success(compress(img), file.type);
                //                            img = null;
                //                        }
                //
                //                    }
                //                });
                //            };
                //        };
                //
                //        reader.readAsDataURL(file);
                //    });
                //
                //    var nodes = document.querySelectorAll('.upload-image-20170608');
                //    for (var i = 0; i < nodes.length; i++) {
                //        document.body.removeChild(nodes[i]);
                //    }
                //
                //};
                //
                //input.click();
            }
        };

        //// 使用canvas对大图片进行压缩
        //function compress(img) {
        //    var canvas = document.createElement("canvas"),
        //        ctx = canvas.getContext('2d'),
        //        tCanvas = document.createElement("canvas"), // 瓦片canvas
        //        tctx = tCanvas.getContext("2d"),
        //        width = img.width,
        //        height = img.height,
        //        ratio; // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下
        //
        //    if ((ratio = width * height / 4000000) > 1) {
        //        ratio = Math.sqrt(ratio);
        //        width /= ratio;
        //        height /= ratio;
        //    } else {
        //        ratio = 1;
        //    }
        //
        //    canvas.width = width;
        //    canvas.height = height;
        //    // 铺底色
        //    ctx.fillStyle = "#fff";
        //    ctx.fillRect(0, 0, canvas.width, canvas.height);
        //    // 如果图片像素大于100万则使用瓦片绘制
        //    var count;
        //
        //    if ((count = width * height / 1000000) > 1) {
        //        count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
        //        // 计算每块瓦片的宽和高
        //        var nw = ~~(width / count);
        //        var nh = ~~(height / count);
        //        tCanvas.width = nw;
        //        tCanvas.height = nh;
        //        for (var i = 0; i < count; i++) {
        //            for (var j = 0; j < count; j++) {
        //                tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
        //                ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
        //            }
        //        }
        //    } else {
        //        ctx.drawImage(img, 0, 0, width, height);
        //    }
        //
        //    //进行最小压缩
        //    var ndata = canvas.toDataURL('image/jpeg', 0.1);
        //    tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;
        //
        //    return ndata;
        //}
        //
        ////获取照片的元信息（拍摄方向）
        //function getPhotoOrientation (img){
        //    var orient;
        //    EXIF.getData(img, function () {
        //        orient = EXIF.getTag(this, "Orientation");
        //    });
        //    return orient;
        //}
        //
        //function drawPhoto (photo, x, y, w, h, callback) {
        //
        //    //获取照片的拍摄方向
        //    var orient = getPhotoOrientation(photo);
        //    var canvas = document.createElement("canvas");
        //    canvas.width = w;
        //    canvas.height = h;
        //
        //    if (canvas.getContext) {
        //        var ctx = canvas.getContext("2d");
        //        //draw on Canvas
        //        var img = new Image();
        //        img.onload = function () {
        //            var canvas_w = Number(ctx.canvas.width);
        //            var canvas_h = Number(ctx.canvas.height);
        //            //判断图片拍摄方向是否旋转了90度
        //            if (orient == 6) {
        //                ctx.save();//保存状态
        //                ctx.translate(canvas_w / 2, canvas_h / 2);//设置画布上的(0,0)位置，也就是旋转的中心点
        //                ctx.rotate(90 * Math.PI / 180);//把画布旋转90度
        //                // 执行Canvas的drawImage语句
        //                ctx.drawImage(img, Number(y) - canvas_h / 2, Number(x) - canvas_w / 2, h, w);//把图片绘制在画布translate之前的中心点，
        //                ctx.restore();//恢复状态
        //            } else {
        //                // 执行Canvas的drawImage语句
        //                ctx.drawImage(img, x, y, w, h);
        //            }
        //
        //            callback(canvas.toDataURL());
        //        };
        //
        //        img.src = photo.src; // 设置图片源地址
        //    }
        //}
    }
};

