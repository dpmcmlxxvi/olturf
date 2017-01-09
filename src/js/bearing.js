
/*globals ol3turf, turf */

//==================================================
// bearing control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "bearing";

    /**
     * Compute bearing between two points
     * @private
     */
    var action = function (control) {

        // Gather points seleted
        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var points = ol3turf.utils.getPoints(collection, 2, 2);
        var start = points[0];
        var end = points[1];
        var output = turf.bearing(start, end);
        var inputs = {
            start: start,
            end: end
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Measure Bearing";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
