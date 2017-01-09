
/*globals document, ol3turf, turf */

//==================================================
// distance control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "distance";

    /**
     * Find distance between points
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather points seleted
                var collection = ol3turf.utils.getCollection(control, 2, 2);
                var points = ol3turf.utils.getPoints(collection, 2, 2);
                var from = points[0];
                var to = points[1];

                // Gather form inputs
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var output = turf.distance(from, to, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    from: from,
                    to: to,
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
            var title = "Find distance between points";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
