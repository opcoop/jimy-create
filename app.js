$(function() {
    var $container = $( '.map-container' );
    var pfold = $container.pfold({
        easing : 'ease-in-out',
        centered: true,
        folds : 2,
        folddirection : ['left','bottom','right'],
        onEndUnfolding: function () {
            var map = L.map('map').setView([-55.505, -51.09], 4);

            // add MapQuest tile layer, must give proper OpenStreetMap attribution according to MapQuest terms
            L.tileLayer('http://otile4.mqcdn.com/tiles/1.0.0/osm/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="www.openstreetmap.org/copyright">OpenStreetMap</a>',
                opacity: 0.8
            }).addTo(map);
        }

    });
    $('#tapa').on('click', function () {
        pfold.unfold();
    });
});
