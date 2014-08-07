$(function() {
    var video =  document.getElementById("video");
    var stream;
    var dataURL;

    var fileupload = document.getElementById('upload')
    ,support = {
        filereader: document.getElementById('filereader'),
        formdata: document.getElementById('formdata'),
        progress: document.getElementById('progress')
    }
    ,tests = {
        filereader: typeof FileReader != 'undefined',
        dnd: 'draggable' in document.createElement('span'),
        formdata: !!window.FormData,
        progress: "upload" in new XMLHttpRequest
    }
    ,acceptedTypes = {
        'image/png': true,
        'image/jpeg': true,
        'image/gif': true
    };

    var tmpl = function (id) {
        return $(id)[0].innerHTML;
    };

    var $container = $('.pic-container');
    $('#cover-form').on('focus', function() {
        $('#cover-form').blur();
        showPicChooser();
    });

    $container.on ('click', showPicChooser);

    var showPicChooser = function () {
        $container.addClass('pic-over');
        $container.removeClass('hoverable');
        $('#fold-pic').removeClass('hidden');
        if (video)
            video.play();
    };

    $('#fold-pic').on('click', function () {
        $('#fold-pic').addClass('hidden');
        $container.removeClass('pic-over');
        $container.addClass('hoverable');
        if (video)
            video.pause();
    });

    var showUploader = function () {
        $('.snap-utils').addClass('hidden');
        $('.snap-allow').addClass('hidden');
        $('.upload-utils').removeClass('hidden');

        video.src = "";
        if (stream)
            stream.stop();

        "filereader formdata progress".split(' ').forEach(function (api) {
            if (tests[api] === false) {
                support[api].className = 'fail';
            } else {
                // FFS. I could have done el.hidden = true, but IE doesn't support
                // hidden, so I tried to create a polyfill that would extend the
                // Element.prototype, but then IE10 doesn't even give me access
                // to the Element object. Brilliant.
                support[api].className = 'nodisplay';
            }
        });

        video.ondragover = function () { this.className = 'hover'; return false; };
        video.ondragend = function () { this.className = ''; return false; };
        video.ondrop = function (e) {
            e.preventDefault();
            readfiles(e.dataTransfer.files);
        };

        function previewfile(file) {
            if (tests.filereader === true && acceptedTypes[file.type] === true) {
                var reader = new FileReader();
                reader.onload = function (event) {
                    video.poster = event.target.result;
                };

                reader.readAsDataURL(file);
            }  else {
                console.log('could not use', file);
            }
        }

        function readfiles(files) {
            for (var i = 0; i < files.length; i++) {
                previewfile(files[i]);
            }
        }
    };

    showUploader();

    $('#upload-pic').on('click', showUploader);
    $('#take-pic').on('click', function () {
        $('.upload-utils').addClass('hidden');
        $('.snap-allow').removeClass('hidden');
        $('#snap-button').on('click', captureImage);
        setup();
    });

    //http://coderthoughts.blogspot.co.uk/2013/03/html5-video-fun.html - thanks :)
    function setup() {
        navigator.myGetMedia = (navigator.getUserMedia ||
                                navigator.webkitGetUserMedia ||
                                navigator.mozGetUserMedia ||
                                navigator.msGetUserMedia);
        navigator.myGetMedia({ video: true }, connect, error);
    }

    function connect(mediaStream) {
        $('.snap-utils').removeClass('hidden');
        $('.snap-allow').addClass('hidden');
        stream = mediaStream;
        video.src = window.URL ? window.URL.createObjectURL(stream) : stream;
    }

    function error(e) { console.log(e); }

    function captureImage() {
        var canvas = document.createElement('canvas');
        canvas.id = 'hidden-canvas';
        //add canvas to the body element
        document.body.appendChild(canvas);

        $('#canvas-holder').html(canvas);
        var ctx = canvas.getContext('2d');
        canvas.width = video.videoWidth / 4;
        canvas.height = video.videoHeight / 4;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        //save canvas image as data url
        dataURL = canvas.toDataURL();
        // place the image value in the text box
        $('#cover-form').val(dataURL);
        video.poster = dataURL;
        setTimeout (function () {
            video.src = "";
            stream.stop();
            $('.snap-utils').addClass('hidden');
        }, 200);
    }

});
