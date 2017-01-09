
/*globals document, ol3turf, turf */

//==================================================
// simplify control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "simplify";

    /**
     * Simplify shape
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idQuality = ol3turf.utils.getName([name, "quality"], control.prefix);
        var idTolerance = ol3turf.utils.getName([name, "tolerance"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Get form inputs
                var tolerance = ol3turf.utils.getFormNumber(idTolerance, "tolerance");
                var quality = ol3turf.utils.getFormString(idQuality, "quality");
                var highQuality = (quality === "high");

                // Collect polygons
                var output = turf.simplify(collection, tolerance, highQuality);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    feature: collection,
                    tolerance: tolerance,
                    highQuality: highQuality
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
            ol3turf.utils.getControlNumber(idTolerance, "Tolerance", "Simplification tolerance", "1", "0.01", "0"),
            ol3turf.utils.getControlSelect(idQuality, "Quality", ol3turf.utils.getOptionsQuality()),
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
            var title = "Simplify shape";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
