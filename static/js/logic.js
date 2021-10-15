//URL
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson";

//pull data from URL
d3.json(url).then(function (data) {
  createFeatures(data.features);
});


//create map style
function createFeatures(earthquakeData) {
  function styleFunc(feature) {
      return {
        opacity: 1,
        fillOpacity: 1,
        fillColor: getColor(feature.properties.mag),
        color: "#000000",
        radius: Math.sqrt(feature.properties.mag) * 5,
        stroke: true,
        weight: 0.5
      };
    }
    function getColor(x) {
      return x > 5  ? '#ea2c2c' :
             x > 4  ? '#ea652c' :
             x > 3  ? '#ea822c' :
             x > 2   ? '#ead12c' :
             x > 1   ? '#e4ea2c' :
             x > 0   ? '#7bea2c' :
                        '#FFEDA0';
  }


  //Create earthquakes variable that will send a circle to the latlng
  var earthquakes = L.geoJSON(earthquakeData, {
    onEachFeature: onEachFeature,
    pointToLayer: function (_feature, latlng) {
        return L.circleMarker(latlng);
    },
    style: styleFunc,
  });

  // Give each feature a popup describing the place and time of the eve
  function onEachFeature(feature, layer) {
    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>");
  }

  // Sending our earthquakes layer to the createMap function
  createMap(earthquakes);
}

function createMap(earthquakes) {

  var streetmap = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  })

  var topographic = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
  });

  // Create a baseMaps object.
  var baseMaps = {
    "Street Map": streetmap,
    "Topographic Map": topographic
  };

  // Create an overlay object to hold our overlay.
  var overlayMaps = {
    Earthquakes: earthquakes
  };

  var myMap = L.map("map", {
    center: [
      37.09, -95.71
    ],
    zoom: 5,
    layers: [streetmap, earthquakes]
  });

    // Add the layer control to the map.
    L.control.layers(baseMaps, overlayMaps, {
      collapsed: false
    }).addTo(myMap);
  
  }