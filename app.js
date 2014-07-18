$(function() {
    var $container = $( '.map-container' );
    var pfold = $container.pfold({
        easing : 'ease-in-out',
        centered: true,
        folds : 2,
            folddirection : ['right', 'bottom'],
        onEndUnfolding: function () {
                var map = L.map('map')
                            .setView([-40.17887331434695, -63.896484375], 4)
                            .locate({
                                    setView: true

                            });

                map.on('locationfound', function(LocationEvent) {
	                /*Fired when geolocation (using the locate method) went successfully. */
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
    $('#tapa').on('click', function () {
        pfold.unfold();
    });

});
