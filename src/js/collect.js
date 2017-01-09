
/*globals document, ol3turf, turf */

//==================================================
// collect control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "collect";

    /**
     * Collect point attributes within polygon
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idIn = ol3turf.utils.getName([name, "in", "property"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idOut = ol3turf.utils.getName([name, "out", "property"], control.prefix);

        function onOK() {
            try {

                // Gather selected points and polygons
                var collection = ol3turf.utils.getCollection(control, 2, Infinity);
                var points = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
                var numPolygons = collection.features.length - points.length;
                var polygons = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

                // Gather form inputs
                var inProperty = ol3turf.utils.getFormString(idIn, "In-Property");
                var outProperty = ol3turf.utils.getFormString(idOut, "Out-Property");

                // Collect polygons
                var inPolygons = turf.featureCollection(polygons);
                var inPoints = turf.featureCollection(points);
                var output = turf.collect(inPolygons,
                        inPoints,
                        inProperty,
                        outProperty);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    polygons: inPolygons,
                    points: inPoints,
                    inProperty: inProperty,
                    outProperty: outProperty
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
            ol3turf.utils.getControlText(idIn, "In Property", "Property to be nested from"),
            ol3turf.utils.getControlText(idOut, "Out Property", "Property to be nested into"),
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
            var title = "Collect points within polygons";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
