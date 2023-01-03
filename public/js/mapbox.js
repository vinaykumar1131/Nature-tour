/* eslint-disable */

console.log("heelnncn,mm")

const data=JSON.parse(document.getElementById('map').dataset.locations);

console.log(data);
mapboxgl.accessToken = 'pk.eyJ1IjoidmluYXkyMTQwMjMiLCJhIjoiY2xjM3F0MTB0MDVudzN3dDg1cGQ0emFnOSJ9.BRXDE6Fd4o83enlr0VnCTg';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/vinay214023/clc3qyj0s006a14s1e1f85scz',
    scrollZoom:false
  });
  const bounds = new mapboxgl.LngLatBounds();

  data.forEach(loc => {
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