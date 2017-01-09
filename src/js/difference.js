
/*globals ol3turf, turf */

//==================================================
// difference control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "difference";

    /**
     * Compute difference between two polygons
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var polygons = ol3turf.utils.getPolygons(collection, 2, 2);
        var poly1 = polygons[0];
        var poly2 = polygons[1];
        var output = turf.difference(poly1, poly2);
        var inputs = {
            poly1: poly1,
            poly2: poly2
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
            var title = "Create Difference Polygon";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
