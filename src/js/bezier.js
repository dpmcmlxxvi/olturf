import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals document, ol3turf, turf */

//==================================================
// bezier control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "bezier";

    /**
     * Create bezier curve of line
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idResolution = ol3turf.utils.getName([name, "resolution"], control.prefix);
        var idSharpness = ol3turf.utils.getName([name, "sharpness"], control.prefix);

        function onOK() {
            try {

                // Gather line seleted
                var collection = ol3turf.utils.getCollection(control, 1, 1);
                var lines = ol3turf.utils.getLines(collection, 1, 1);
                var line = lines[0];

                // Gather form inputs
                var resolution = ol3turf.utils.getFormNumber(idResolution, "resolution");
                var sharpness = ol3turf.utils.getFormNumber(idSharpness, "sharpness");

                // Create bezier curve
                var output = turf.bezier(line, resolution, sharpness);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    line: line,
                    resolution: resolution,
                    sharpness: sharpness
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
            ol3turf.utils.getControlNumber(idResolution, "Resolution", "Time between points (milliseconds)", "10000", "any", "0"),
            ol3turf.utils.getControlNumber(idSharpness, "Sharpness", "Measure of how curvy the path should be between splines", "0.85", "0.01", "0", "1"),
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
            var title = "Create bezier curve of line";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
