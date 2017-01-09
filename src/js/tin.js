
/*globals document, ol3turf, turf */

//==================================================
// tin control
//--------------------------------------------------
(function (ol3turf) {

    "use strict";

    // Control name
    var name = "tin";

    /**
     * Compute tin mesh
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idZ = ol3turf.utils.getName([name, "z"], control.prefix);

        function onOK() {
            try {

                var collection = ol3turf.utils.getCollection(control, 3, Infinity);
                var numPoints = collection.features.length;
                var points = ol3turf.utils.getPoints(collection, numPoints, numPoints);
                collection = turf.featureCollection(points);

                // Get form inputs
                var z = ol3turf.utils.getFormString(idZ, "z");

                var output = turf.tin(collection, z);
                var inputs = {
                    points: collection,
                    z: z
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
            ol3turf.utils.getControlText(idZ, "Z", "(Optional) Property from which to pull z values"),
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
            var title = "Create TIN";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };

    return ol3turf;

}(ol3turf || {}));
