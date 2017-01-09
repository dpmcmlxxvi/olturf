
/*globals document, ol3turf, turf */

//==================================================
// tag control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "tag";

    /**
     * Collect point attributes within polygon
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idField = ol3turf.utils.getName([name, "field-property"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idOutField = ol3turf.utils.getName([name, "out-field-property"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 2, Infinity);
                var points = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
                var numPolygons = collection.features.length - points.length;
                var polygons = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

                // Get form inputs
                var field = ol3turf.utils.getFormString(idField, "field");
                var outField = ol3turf.utils.getFormString(idOutField, "out field");

                // Collect polygons
                var inPolygons = turf.featureCollection(polygons);
                var inPoints = turf.featureCollection(points);
                var output = turf.tag(inPoints, inPolygons, field, outField);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    points: inPoints,
                    polygons: inPolygons,
                    field: field,
                    outField: outField
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
            ol3turf.utils.getControlText(idField, "Field", "Property in polygons to add to joined point features"),
            ol3turf.utils.getControlText(idOutField, "Out Field", "Property in points in which to store joined property from polygons"),
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
            var title = "Perform spatial join of points and polygons";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
