import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals ol3turf, turf */

//==================================================
// tesselate control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "tesselate";

    /**
     * Compute tesselation
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, 1);
        var polygons = ol3turf.utils.getPolygons(collection, 1, 1);
        var polygon = polygons[0];

        var output = turf.tesselate(polygon);
        var inputs = {
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
            var title = "Create tesselation";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
