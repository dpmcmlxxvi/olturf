import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals ol3turf, turf */

//==================================================
// square control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "square";

    /**
     * Compute square
     * @private
     */
    var action = function (control) {

        // Gather selected features
        var collection = ol3turf.utils.getCollection(control, 1, Infinity);
        var bbox = turf.bbox(collection);
        var square = turf.square(bbox);

        var output = turf.bboxPolygon(square);
        var inputs = {
            bbox: bbox
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
            var title = "Create Square";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
