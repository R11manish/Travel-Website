console.log('hello from the client side how are you all');
const locations = JSON.parse(document.getElementById('map').dataset.locations);

mapboxgl.accessToken = 'pk.eyJ1IjoicmF3YXRtYW5pc2g1MzkiLCJhIjoiY2tweTN2emdnMGMzdzJ0cWN0ejQwbzZjOCJ9.h4YODoh0Zl3ypJ6HrPo1Qg';

var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/rawatmanish539/ckpyu7yzc10l617plrx8zy69a'
});

// disable map zoom when using scroll
map.scrollZoom.disable();

const bounds = new mapboxgl.LngLatBounds();

locations.forEach(loc => {
    // Create marker
    const el = document.createElement('div');
    el.className = 'marker';

    // Add marker
    new mapboxgl.Marker({
        element: el,
        anchor: 'bottom'
    })
        .setLngLat(loc.coordinates)
        .addTo(map);

    // Add popup
    new mapboxgl.Popup({
        offset: 30
    })
        .setLngLat(loc.coordinates)
        .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
        .addTo(map);

    // Extend map bounds to include current location
    bounds.extend(loc.coordinates);
});

map.fitBounds(bounds, {
    padding: {
        top: 200,
        bottom: 150,
        left: 100,
        right: 100
    }
});
