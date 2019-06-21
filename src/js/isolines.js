import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals document, ol3turf, turf */

//==================================================
// isolines control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "isolines";

    /**
     * Create isolines
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idBreaks = ol3turf.utils.getName([name, "breaks"], control.prefix);
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idResolution = ol3turf.utils.getName([name, "resolution"], control.prefix);
        var idZ = ol3turf.utils.getName([name, "z"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var collection = ol3turf.utils.getCollection(control, 1, Infinity);

                // Gather form inputs
                var breaks = ol3turf.utils.getFormArray(idBreaks, "breaks");
                var resolution = ol3turf.utils.getFormNumber(idResolution, "resolution");
                var z = ol3turf.utils.getFormString(idZ, "z");

                // Generate isolines features
                var output = turf.isolines(collection, z, resolution, breaks);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    points: collection,
                    z: z,
                    resolution: resolution,
                    breaks: breaks
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
            ol3turf.utils.getControlNumber(idResolution, "Resolution", "Resolution of the underlying grid", "1", "any", "0.01"),
            ol3turf.utils.getControlText(idZ, "Z Property", "Property name in points from which z-values will be pulled"),
            ol3turf.utils.getControlText(idBreaks, "Breaks", "Comma separated list of where to draw contours"),
            ol3turf.utils.getControlInput(idOk, onOK, "", "OK"),
            ol3turf.utils.getControlInput(idCancel, onCancel, "", "Cancel")
        ];

        control.showForm(controls, idForm);

    };

    return {
        /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
        create: function (toolbar, prefix) {
            var title = "Create isolines";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
