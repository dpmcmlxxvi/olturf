import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals ol3turf, turf */

//==================================================
// midpoint control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "midpoint";

    /**
     * Compute midpoint
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var points = ol3turf.utils.getPoints(collection, 2, 2);
        var from = points[0];
        var to = points[1];
        var output = turf.midpoint(from, to);
        var inputs = {
            from: from,
            to: to
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
            var title = "Measure Midpoint";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
