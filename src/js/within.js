import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals ol3turf, turf */

//==================================================
// within control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "within";

    /**
     * Compute points within polygons
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, Infinity);
        var pts = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
        var numPolygons = collection.features.length - pts.length;
        var polys = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

        var points = turf.featureCollection(pts);
        var polygons = turf.featureCollection(polys);

        var output = turf.within(points, polygons);
        if (output.features.length === 0) {
            throw new Error("No points found within.");
        }
        var inputs = {
            points: points,
            polygons: polygons
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    return {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Find points within polygons";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
