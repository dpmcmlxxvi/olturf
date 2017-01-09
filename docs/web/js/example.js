
/*globals ol */

/**
 * Create ol map
 * @param id ol.Map DOM id
 */
function createMap(id) {

    "use strict";

    // ==================================================
    // Create map
    // --------------------------------------------------

    var select = new ol.interaction.Select({
        condition: ol.events.condition.click
    });
    var controls = ol.control.defaults();
    var interactions = ol.interaction.defaults().extend([select]);
    var layers = [new ol.layer.Tile({
        source: new ol.source.Stamen({layer: 'watercolor'})
    })];
    var view = new ol.View({
        center: [-8161939, 6095025],
        zoom: 8
    });
    var map = new ol.Map({
        controls: controls,
        interactions: interactions,
        layers: layers,
        target: id,
        view: view
    });

    // ==================================================
    // Add data to map
    // --------------------------------------------------

    // Add polygons
    var polygons = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'http://openlayers.org/en/v3.17.1/examples/data/geojson/polygon-samples.geojson'
        })
    });
    map.addLayer(polygons);

    // Add lines
    var lines = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'http://openlayers.org/en/v3.17.1/examples/data/geojson/line-samples.geojson'
        })
    });
    map.addLayer(lines);

    // Add points
    var points = new ol.layer.Vector({
        source: new ol.source.Vector({
            format: new ol.format.GeoJSON(),
            url: 'http://openlayers.org/en/v3.17.1/examples/data/geojson/point-samples.geojson'
        })
    });
    map.addLayer(points);

    return map;

}
