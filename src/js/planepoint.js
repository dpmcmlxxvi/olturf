
/*globals ol3turf, turf */

//==================================================
// planepoint control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "planepoint";

    /**
     * Triangulate a point in a plane
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var pt = ol3turf.utils.getPoints(collection, 1, 1);
        var tr = ol3turf.utils.getPolygons(collection, 1, 1);
        var point = pt[0];
        var triangle = tr[0];

        var output = turf.planepoint(point, triangle);
        var inputs = {
            point: point,
            triangle: triangle
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
            var title = "Triangulate a point in a plane";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
