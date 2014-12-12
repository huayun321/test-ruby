$( document ).ready(function() {
    var canvas = new fabric.Canvas('canvas');
    var m_canvas = new fabric.Canvas('modal-canvas');
    var stamp = null;
    /*
     * tool bar
     * */
    $('#toolbar > button').click(function (e) {
        var btn_id = e.target.id;
        //active
        $('#toolbar > button').removeClass('disabled');
        $('#' + btn_id).addClass('disabled');

        //drawingmode
        canvas.isDrawingMode = false;

        //switch tool
        switch (btn_id) {
            case 'tool-pencil':
                canvas.isDrawingMode = true;
                canvas.freeDrawingBrush.color = $('#drawing-color').val();
                canvas.freeDrawingBrush.width = parseInt($('#drawing-line-width').val(), 10) || 1;
                break;
            case 'tool-text':
                break;
        }
    });
    //draw
    $('#drawing-color').change(function () {
        canvas.freeDrawingBrush.color = $(this).val();
    });
    $('#text-add').click(function () {
        var text = $('#text-content').val();
        var color = $('#text-color').val();
        var t = new fabric.IText(text);
        t.setColor(color);
        canvas.add(t);
    });
    $('#drawing-line-width').change(function () {
        canvas.freeDrawingBrush.width = parseInt($(this).val(), 10) || 1;
        $('#drawing-line-width-val').text($(this).val());
    });

    //stamp
    $('#stamp-box > button').click(function (e) {
        var btn_id = $(e.target).is('button') ? e.target.id : $(e.target).parent().prop('id');
        var svg_path = 'fontcustom/svg/' + btn_id + '.svg';
        console.log(svg_path);
        fabric.loadSVGFromURL(svg_path, function (objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            canvas.add(obj);

        });
    });
    //imgs
    //$('#imgs-box > img').click(function(e) {
    //load img and stamp
    function handle_img_click(e) {
        if(!canvas.getActiveObject()) {
            return alert('请先在画板中选择一个图案，再点击图片剪切。');
        }
        canvas.getActiveObject().clone(function (o) {
            o.opacity = 0.5;
            stamp = o;
            stamp.hasControls = false;
        });
        //load img
        fabric.Image.fromURL(e.target.src, function (oimg) {
            if (oimg.width > 750) {
                oimg.height = oimg.height * (750 / oimg.width);
                oimg.width = 750;
            }
            m_canvas.centerObject(oimg);
            m_canvas.add(oimg);
            oimg.setCoords();

            m_canvas.centerObject(stamp);
            m_canvas.add(stamp).setActiveObject(stamp);
            stamp.setCoords();
        });
        $('#myModal').modal();


    //});
    };
    //crop
    $('#crop').click(function() {
        stamp.opacity = 0;
        //crop
        var dataUrl = null;
        dataUrl = m_canvas.toDataURL({
            top: stamp.top,
            left: stamp.left,
            width: stamp.width * stamp.scaleX,
            height: stamp.height *  stamp.scaleY
        });

        stamp = canvas.getActiveObject();

        fabric.Image.fromURL(dataUrl, function(iimg) {
            console.log('load img');
            iimg.top =  stamp.top;
            iimg.left = stamp.left;

//
            var stam_png = stamp.toDataURL();
            fabric.Image.fromURL(stam_png, function(mimg) {
                console.log('load mask');
                iimg.filters.push( new fabric.Image.filters.Mask( { 'mask': mimg, channel:3} ) );

                iimg.applyFilters(canvas.renderAll.bind(canvas));
                canvas.add(iimg);
                canvas.remove(stamp);

            });


        });

        $('#myModal').modal('hide');
        m_canvas.clear();
    });
/*
* sidebar
* */
    $('#tool-sidebar').click(function(e) {
        e.preventDefault();
        $("#wrapper").toggleClass("toggled");
    });
    $('#tool-save').click(function() {
        var png = canvas.toDataURL();
        window.location.replace(png);
    });
    $('#tool-clear').click(function() {
        canvas.clear();
    });




    function browser_check() {
        if (window.File && window.FileReader && window.FileList &&
            window.Blob) {
            //All the File APIs are supported.
        } else {
            alert('当前网页浏览器版本过低，请下载新版浏览器。建议使用新版google浏览器或火狐浏览器。');
        }
    }
    browser_check();


    function handleFileSelect(evt) {
        var files = evt.target.files;

        //loop throuth the FileList and render image files as thumbnails.
        for (var i = 0, f; f = files[i]; i++) {

            //only process image files.
            if (!f.type.match('image.*')) {
                continue;
            }

            var reader = new FileReader();

            //closure to capture the file information.
            reader.onload = (function(theFile) {
                return function (e) {
                    //Render thumbnail.
                    var thumb = ['<img width="100"  class="img-thumbnail" src="',
                        e.target.result,
                        '" title="', escape(theFile.name),
                        '"/>'].join('');
                    $('#imgs-box').append($(thumb).click(function(e){handle_img_click(e)}));
                };
            })(f);

            //read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    document.getElementById('files').addEventListener('change',
        handleFileSelect, false);


    $('#img-add').click(function() {
       $('#files').click();
        return false;
    });
});