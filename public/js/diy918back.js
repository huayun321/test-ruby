$( document ).ready(function() {
    var canvas = new fabric.Canvas('canvas');

/*
* tool bar
* */
    $('#toolbar > button').click(function(e) {
        var btn_id = e.target.id;
        //active
        $('#toolbar > button').removeClass('disabled');
        $('#'+ btn_id).addClass('disabled');

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
    $('#drawing-color').change(function() {
        canvas.freeDrawingBrush.color = $(this).val();
    });
    $('#text-add').click(function() {
        var text = $('#text-content').val();
        var color = $('#text-color').val();
        var t = new fabric.IText(text);
        t.setColor(color);
        canvas.add(t);
    });
    $('#drawing-line-width').change(function() {
        canvas.freeDrawingBrush.width = parseInt($(this).val(), 10) || 1;
        $('#drawing-line-width-val').text($(this).val());
    });

    //stamp
    $('#stamp-box > button').click(function(e) {
        var btn_id =  $(e.target).is('button') ? e.target.id :$(e.target).parent().prop('id');
        var svg_path = 'fontcustom/svg/'+btn_id + '.svg';
        console.log(svg_path);
        fabric.loadSVGFromURL(svg_path, function(objects, options) {
            var obj = fabric.util.groupSVGElements(objects, options);
            canvas.add(obj);

        });
    });
    //imgs
    $('#imgs-box > img').click(function(e) {
        //load img and stamp
        var active_obj = null;
        canvas.getActiveObject().clone(function(o) {
            o.opacity = 0.5;
            active_obj = o;
            active_obj.hasControls = false;
        });
        console.log(active_obj);
        //add canvas
        var model_canvas = "<canvas id='modal-canvas' width='800' height='600'></canvas>";

        $('#canvas-box').html(model_canvas);
        var m_canvas = new fabric.Canvas('modal-canvas');
        //load img
        fabric.Image.fromURL(e.target.src, function(oimg) {
            if(oimg.width > 750) {
                oimg.height = oimg.height * (750 / oimg.width);
                oimg.width = 750;
            }
            m_canvas.centerObject(oimg);
            m_canvas.add(oimg);
            oimg.setCoords();

            m_canvas.centerObject(active_obj);
            m_canvas.add(active_obj).setActiveObject(active_obj);
            active_obj.setCoords();
        });
        $('#myModal').modal();

        //crop
        $('#crop').click(function() {
            active_obj.opacity = 0;
            //crop
            var dataUrl = null;
            dataUrl = m_canvas.toDataURL({
                top: active_obj.top,
                left: active_obj.left,
                width: active_obj.width * active_obj.scaleX,
                height: active_obj.height *  active_obj.scaleY
            });

            var stamp = canvas.getActiveObject();

            fabric.Image.fromURL(dataUrl, function(iimg) {
                console.log('load img');
                iimg.top =  stamp.top;
                iimg.left = stamp.left;

//
//                var stam_png = stamp.toDataURL();
//                fabric.Image.fromURL(stam_png, function(mimg) {
//                    console.log('load mask');
//                    iimg.filters.push( new fabric.Image.filters.Mask( { 'mask': mimg, channel:3} ) );

                    //iimg.applyFilters();
                    canvas.add(iimg);
                    canvas.remove(stamp);

                //});


            });

            $('#myModal').modal('hide');
        });
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



});