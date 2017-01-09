
/*globals document, ol3turf, turf */

//==================================================
// concave control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "concave";

    /**
     * Buffer feature by given radius
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idMaxEdge = ol3turf.utils.getName([name, "max", "edge"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 3, Infinity);
                var numPoints = collection.features.length;
                var pts = ol3turf.utils.getPoints(collection, numPoints, numPoints);

                // Gather form inputs
                var maxEdge = ol3turf.utils.getFormNumber(idMaxEdge, "Max Edge");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var points = turf.featureCollection(pts);
                var output = turf.concave(points, maxEdge, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    points: points,
                    maxEdge: maxEdge,
                    units: units
                };
                control.toolbar.ol3turf.handler.callback(name, output, inputs);


            } catch (e) {
                control.showMessage(e);
            }
        }

        function onCancel() {
            control.showForm();
        }

        var controls = [
            ol3turf.utils.getControlNumber(idMaxEdge, "Max Edge Size", "Maximum size of an edge necessary for part of the hull to become concave", "0", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    ol3turf.controls[name] = {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create Concave Hull";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
