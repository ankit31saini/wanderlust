
    // const map = new mapboxgl.Map({
    //     // TO MAKE THE MAP APPEAR YOU MUST
    //     // ADD YOUR ACCESS TOKEN FROM
    //     // https://account.mapbox.com
    //     accessToken: mapToken,
    // container: 'map',
    // style: 'mapbox://styles/mapbox/standard', // Use the standard style for the map
    // projection: 'globe', // display the map as a globe
    // zoom: 1, // initial zoom level, 0 is the world view, higher values zoom in
    // center: [30, 15] // center the map on this longitude and latitude
    // });

    // map.addControl(new mapboxgl.NavigationControl());
    // map.scrollZoom.disable();

    // map.on('style.load', () => {
    //     map.setFog({}); // Set the default atmosphere style
    // });


if (document.getElementById("map")) {
const map = new maplibregl.Map({
    style: 'https://tiles.openfreemap.org/styles/liberty',
    center: listings.geometry.coordinates,
    zoom: 9.5,
    container: 'map',
})
    console.log(listings.geometry.coordinates);
    const marker = new maplibregl.Marker({color:"red"})
        .setLngLat(listings.geometry.coordinates)
        .setPopup(new maplibregl.Popup({ offset: 25 }).setHTML(
            `<h4>${listings.location}:</h4> <p>exact location will be shared after booking.</p>`
        ))
        .addTo(map);

const geocoderApi = {
    forwardGeocode: async (config) => {
        const features = [];
        try {
            const request =
                `https://nominatim.openstreetmap.org/search?q=${config.query
                }&format=geojson&polygon_geojson=1&addressdetails=1`;
            const response = await fetch(request);
            const geojson = await response.json();
            for (const feature of geojson.features) {
                const center = [
                    feature.bbox[0] +
                    (feature.bbox[2] - feature.bbox[0]) / 2,
                    feature.bbox[1] +
                    (feature.bbox[3] - feature.bbox[1]) / 2
                ];
                const point = {
                    type: 'Feature',
                    geometry: {
                        type: 'Point',
                        coordinates: center
                    },
                    place_name: feature.properties.display_name,
                    properties: feature.properties,
                    text: feature.properties.display_name,
                    place_type: ['place'],
                    center
                };
                features.push(point);
            }
        } catch (e) {
            console.error(`Failed to forwardGeocode with error: ${e}`);
        }
        
        return {
            features
        };
    }
};
    console.log("GEOCODER = ", window.MaplibreGeocoder);
map.addControl(
    new MaplibreGeocoder(geocoderApi, {
        maplibregl
    })
);
} 