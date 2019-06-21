import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals ol3turf, turf */

//==================================================
// nearest control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "nearest";

    /**
     * Compute nearest point
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, Infinity);
        var numPoints = collection.features.length;
        var pts = ol3turf.utils.getPoints(collection, numPoints, numPoints);
        var targetPoint = pts[0];
        var points = turf.featureCollection(pts.slice(1));

        var output = turf.nearest(targetPoint, points);
        var inputs = {
            targetPoint: targetPoint,
            points: points
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
            var title = "Find set point nearest to first point";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
