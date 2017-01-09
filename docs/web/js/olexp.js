
/*globals ol, olexp */

/**
 * Create olexp explorer
 * @param id olexp.Explorer DOM id
 */
function createExplorer(id) {

    "use strict";

    var explorer = new olexp.Explorer(id, {
        olcontrols: {
            zoomslider: false
        }
    });

    // Add tile layer
    var tile = new ol.layer.Tile({
        source: new ol.source.Stamen({layer: 'watercolor'})
    });
    tile.set('name', 'Stamen');
    explorer.map.addLayer(tile);

    // Function to extend map extent to cover layer
    var extent = null;
    function extend(layer) {
        layer.getSource().on("change", function () {
            var layerExtent = layer.getSource().getExtent();
            if (extent === null) {
                extent = layer.getSource().getExtent();
            } else {
                extent = ol.extent.extend(extent, layerExtent);
            }
            var view = explorer.map.getView();
            view.fit(extent, explorer.map.getSize());
        });
    }

    // Function to create layer
    function create(name, url) {
        var layer = new ol.layer.Vector({
            source: new ol.source.Vector({
                format: new ol.format.GeoJSON(),
                url: url
            })
        });
        layer.set('name', name);
        extend(layer);
        return layer;
    }

    // Create data
    var polygons = create('Polygons', 'http://openlayers.org/en/v3.17.1/examples/data/geojson/polygon-samples.geojson');
    var lines = create('Lines', 'http://openlayers.org/en/v3.17.1/examples/data/geojson/line-samples.geojson');
    var points = create('Points', 'http://openlayers.org/en/v3.17.1/examples/data/geojson/point-samples.geojson');

    // Add data group
    var layers = new ol.layer.Group({
        layers: [polygons, lines, points]
    });
    layers.set('name', 'Data');
    explorer.map.addLayer(layers);

    return explorer;

}
