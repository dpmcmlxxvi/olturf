import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals ol3turf, turf */

//==================================================
// inside control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "inside";

    /**
     * Compute if point is inside polygon
     * @private
     */
    var action = function (control) {

        // Gather point and polygon selected
        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var points = ol3turf.utils.getPoints(collection, 1, 1);
        var polygons = ol3turf.utils.getPolygonsAll(collection, 1, 1);
        var point = points[0];
        var polygon = polygons[0];

        var output = turf.inside(point, polygon);
        var inputs = {
            point: point,
            polygon: polygon
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
            var title = "Point inside polygon?";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
