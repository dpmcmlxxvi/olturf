
/*globals ol3turf, turf */

//==================================================
// pointOnLine control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "point-on-line";

    /**
     * Compute point on line
     * @private
     */
    var action = function (control) {

        var collection = ol3turf.utils.getCollection(control, 2, 2);
        var points = ol3turf.utils.getPoints(collection, 1, 1);
        var lines = ol3turf.utils.getLines(collection, 1, 1);
        var line = lines[0];
        var point = points[0];

        var output = turf.pointOnLine(line, point);
        var inputs = {
            line: line,
            point: point
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
            var title = "Project point on line";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
