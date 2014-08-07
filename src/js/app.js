$(function() {
    var $container = $( '.map-container' );

    var map;

    var pfold = $container.pfold({
        easing : 'ease-in-out',
//        centered: true,
        folds : 3,
        folddirection : ['top', 'right', 'bottom'],
        onEndUnfolding: function () {
            if (map)
                return;

             var center = [-40.17887331434695, -63.896484375];
             map = L.map('map')
                    .setView(center, 4)
                    .locate({
                        setView: true
                    });

            // add MapQuest tile layer, must give proper OpenStreetMap attribution according to MapQuest terms
            L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>',
                opacity: 0.8
            }).addTo(map);


            var marker = L.marker(center, { draggable: true});
            //            marker.bindPopup(tmpl('#form-tpl'));

            marker.on('dragend', function () {
                var zoom = Math.max (map.getZoom(), 8);
                map.setView(marker.getLatLng(), zoom);
                $('#position').val(marker.getLatLng().toString());
  //              marker.openPopup();
            });

            map.on('click', function (e) {
                var zoom = Math.max (map.getZoom(), 8);
                map.setView(e.latlng, zoom);
                marker.setLatLng(e.latlng).addTo(map);
                $('#position').val(marker.getLatLng().toString());
//                marker.openPopup().update();
            });

            map.on('locationfound', function(LocationEvent) {
                console.log ('locationfound', LocationEvent);
            });

            map.on('locationerror', function(ErrorEvent) {
                console.log ('locationerror', ErrorEvent);
            });

            window.map = map;
        }
    });

    var fold = window.fold = function () {
        $container.removeClass('map-over');
        $container.addClass('hoverable');
        $('#fold-map').addClass('hidden');
        pfold.fold();
    };
    var unfold = window.unfold = function () {
        $container.addClass('map-over');
        $container.removeClass('hoverable');
        pfold.unfold();
        $('#position').blur();
        $('#fold-map').removeClass('hidden');
    };

    $('#form-wrap').on('mouseenter', function () {
        $('#form-wrap').addClass('hoverd');
    });
    $('#tapa').on('click', function () {
        unfold();
    });

    $('#position').on('focus', function() {
        unfold();
    });

    $('#fold-map, #send-form').on('click', function () {
        fold();
    });

    $('form').on('submit', function (e) {
        console.log (e);
        e.preventDefault();
        $('#form-wrap').removeClass('hoverable hoverd');
        $('#form-wrap').addClass('close-wrap');
        $('#wrap').addClass('gone');

        var data = {};
        var key = $('#email').val();
        $.each ($(this).serializeArray(), function (i, o) {
            if (o.name === 'position') {
                var a = o.value.replace(/.*\(/, '').replace('\)','').split(',');
                return data[o.name] = {lat: a[0], lng: a[1]};
            }

            return data[o.name] = o.value;
        });

        $.post ('http://localhost:3100/api/' + key + '/radio/create',
                data, function () { console.log ('success');}, 'json')
            .fail(function(j, s, e) {
                $('#form-wrap').addClass('hoverable hoverd');
                $('#form-wrap').removeClass('close-wrap');
                $('#wrap').removeClass('gone');
                console.log (j, s, e);
                alert( "error" + j + s + e );
            });
        return false;
    });

        try {
            var gui = require('nw.gui'),
                win = gui.Window.get();
            win.show();
        } catch (e) {
            console.log ('we are not runing in node-webkit');
        };
});
