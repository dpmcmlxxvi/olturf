
/*globals ol3turf, turf */

//==================================================
// kinks control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "kinks";

    /**
     * Compute polygon kinks
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 1, 1);
        var polygons = ol3turf.utils.getPolygons(collection, 1, 1);
        var polygon = polygons[0];
        var output = turf.kinks(polygon);
        if (output.features.length === 0) {
            throw new Error("No kinks found.");
        }
        var inputs = {
            polygon: polygon
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
            var title = "Create polygon self-intersections";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
