/**
 * Created by tz on 2017/6/8.
 */
export default {
    install: function (Vue, option) {
        Vue.file = Vue.prototype.$file = {
            upload: function (option) {
                option = {
                    type: option.type || 'image',
                    max: option.max || 5,
                    size: option.size || 200 * 1024,
                    success: option.success || function () {},
                    fail: option.fail || function () {}
                };

                let input = document.createElement("input");
                input.className = 'upload-image-20170608';
                input.style.display = 'none';

                if (option.type == 'image') {
                    input.setAttribute('accept', 'image/*');
                }

                document.body.appendChild(input);

                input.onchange = function () {

                    if (!this.files.length) {
                        return;
                    }

                    var files = Array.prototype.slice.call(this.files);

                    if (files.length > option.max) {
                        option.fail({msg: '最多同时只可上传' + option.max + '张图片'});
                        return;
                    }

                    files.forEach(function(file) {

                        if (!/\/(?:jpeg|png|gif)/i.test(file.type)) {
                            return;
                        }

                        var reader = new FileReader();

                        reader.onload = function() {
                            var result = this.result;
                            var img = new Image();
                            img.src = result;
                            //如果图片大小小于100kb，则直接上传
                            if (result.length <= option.size) {
                                img = null;
                                option.success(result, file.type);

                            } else {

                                if (img.complete) {
                                    callback();
                                } else {
                                    img.onload = callback;
                                }

                                function callback() {
                                    img = null;
                                    option.success(compress(img), file.type);
                                }

                            }
                        };

                        reader.readAsDataURL(file);
                    });

                    var nodes = document.querySelectorAll('.upload-image-20170608');
                    for (var i = 0; i < nodes.length; i++) {
                        document.body.removeChild(nodes[i]);
                    }

                };

                input.click();
            }
        };

        // 使用canvas对大图片进行压缩
        function compress(img) {
            var canvas = document.createElement("canvas"),
                ctx = canvas.getContext('2d'),
                tCanvas = document.createElement("canvas"), // 瓦片canvas
                tctx = tCanvas.getContext("2d"),
                width = img.width,
                height = img.height,
                ratio; // 如果图片大于四百万像素，计算压缩比并将大小压至400万以下

            if ((ratio = width * height / 4000000) > 1) {
                ratio = Math.sqrt(ratio);
                width /= ratio;
                height /= ratio;
            } else {
                ratio = 1;
            }

            canvas.width = width;
            canvas.height = height;
            // 铺底色
            ctx.fillStyle = "#fff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            // 如果图片像素大于100万则使用瓦片绘制
            var count;

            if ((count = width * height / 1000000) > 1) {
                count = ~~(Math.sqrt(count) + 1); //计算要分成多少块瓦片
                // 计算每块瓦片的宽和高
                var nw = ~~(width / count);
                var nh = ~~(height / count);
                tCanvas.width = nw;
                tCanvas.height = nh;
                for (var i = 0; i < count; i++) {
                    for (var j = 0; j < count; j++) {
                        tctx.drawImage(img, i * nw * ratio, j * nh * ratio, nw * ratio, nh * ratio, 0, 0, nw, nh);
                        ctx.drawImage(tCanvas, i * nw, j * nh, nw, nh);
                    }
                }
            } else {
                ctx.drawImage(img, 0, 0, width, height);
            }

            //进行最小压缩
            var ndata = canvas.toDataURL('image/jpeg', 0.1);
            tCanvas.width = tCanvas.height = canvas.width = canvas.height = 0;

            return ndata;
        }
    }
}