import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals document, ol3turf, turf */

//==================================================
// lineSlice control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "line-slice-along";

    /**
     * Compute line slice
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idStart = ol3turf.utils.getName([name, "start"], control.prefix);
        var idStop = ol3turf.utils.getName([name, "stop"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather line seleted
                var collection = ol3turf.utils.getCollection(control, 1, 1);
                var lines = ol3turf.utils.getLines(collection, 1, 1);
                var line = lines[0];

                // Gather form inputs
                var start = ol3turf.utils.getFormNumber(idStart, "start");
                var stop = ol3turf.utils.getFormNumber(idStop, "stop");

                var isOrdered = (start < stop);
                if (isOrdered !== true) {
                    throw new Error("Start must be less than stop");
                }

                // Truncate at line length otherwise lineSliceAlong fails
                var units = ol3turf.utils.getFormString(idUnits, "units");
                var length = turf.lineDistance(line, units);
                if (start > length) {
                    throw new Error("Start must be less than line length");
                }
                if (stop > length) {
                    throw new Error("Stop must be less than line length");
                }

                // Collect polygons
                var output = turf.lineSliceAlong(line, start, stop, units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    line: line,
                    start: start,
                    stop: stop,
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
            ol3turf.utils.getControlNumber(idStart, "Start", "Starting distance along the line", "0", "any", "0"),
            ol3turf.utils.getControlNumber(idStop, "Stop", "Stoping distance along the line", "0", "any", "0"),
            ol3turf.utils.getControlSelect(idUnits, "Units", ol3turf.utils.getOptionsUnits()),
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
            var title = "Create line slice";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
