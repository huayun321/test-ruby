$( document ).ready(function() {
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
                    var thumb = ['<img width="100"  class="thumb img-thumbnail" src="',
                        e.target.result,
                        '" title="', escape(theFile.name),
                        '"/>'].join('');
                    $('#imgs-box').append(
                        $(thumb).click(function(e) {
                            handle_img_click(e);
                        }), null);
                };
            })(f);

            //read in the image file as a data URL.
            reader.readAsDataURL(f);
        }
    }

    document.getElementById('files').addEventListener('change',
        handleFileSelect, false);
});
