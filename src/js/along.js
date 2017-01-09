
/*globals document, ol3turf, turf */

//==================================================
// along control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "along";

    /**
     * Find point along line at given distance
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idDistance = ol3turf.utils.getName([name, "distance"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather line seleted
                var collection = ol3turf.utils.getCollection(control, 1, 1);
                var lines = ol3turf.utils.getLines(collection, 1, 1);
                var line = lines[0];

                // Gather form inputs
                var distance = ol3turf.utils.getFormNumber(idDistance, "distance");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var output = turf.along(line, distance, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    line: line,
                    distance: distance,
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
            ol3turf.utils.getControlNumber(idDistance, "Distance", "Distance along the line", "0", "any", "0"),
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
            var title = "Find point along line at given distance";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
