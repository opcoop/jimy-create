$(function() {

    var tmpl = function (id) {
        return $(id)[0].innerHTML;
    };

    var $container = $( '.map-container' );

    var map;

    var pfold = $container.pfold({
        easing : 'ease-in-out',
        centered: true,
        folds : 2,
        folddirection : ['right', 'bottom'],
        onEndUnfolding: function () {
            if (map)
                return;
            
            var center = [-40.17887331434695, -63.896484375];
             map = L.map('map')
                    .setView(center, 4)
                    .locate({
                        setView: true
                    });
            var marker = L.marker(center, { draggable: true});
            marker.bindPopup(tmpl('#form-tpl'));

            marker.on('dragend', function () {
                map.setView(marker.getLatLng(), 8);
                $('#position').val(marker.getLatLng().toString());
  //              marker.openPopup();
            });

            map.on('click', function (e) {
                map.setView(e.latlng, 8);
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


            // add MapQuest tile layer, must give proper OpenStreetMap attribution according to MapQuest terms
            L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>',
                opacity: 0.8
            }).addTo(map);
            window.map = map;
        }

    });

    var fold = window.fold = function () {
        $container.removeClass('map-over');
        $('#fold-map').hide();
        pfold.fold();
    }
    var unfold = window.unfold = function () {
        $container.addClass('map-over');
        pfold.unfold();
        $('#position').blur();
        $('#fold-map').show();
    };
    $('#tapa').on('click', function () {
        unfold();
    });

    $('#position').on('focus', function() {
        unfold();
    });

    $('#fold-map, #send-form').on('click', function () {
        fold();
    });
});
