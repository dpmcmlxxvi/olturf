import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals ol3turf, turf */

//==================================================
// convex control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "convex";

    /**
     * Compute convex hull
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, Infinity);

        var output = turf.convex(collection);
        var inputs = {
            featurecollection: collection
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
            var title = "Create Convex Hull";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
