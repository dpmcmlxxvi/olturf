import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals document, ol3turf, turf */

//==================================================
// destination control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "destination";

    /**
     * Find destination point from given point
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idBearing = ol3turf.utils.getName([name, "bearing"], control.prefix);
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idDistance = ol3turf.utils.getName([name, "distance"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idUnits = ol3turf.utils.getName([name, "units"], control.prefix);

        function onOK() {
            try {

                // Gather point seleted
                var collection = ol3turf.utils.getCollection(control, 1, 1);
                var points = ol3turf.utils.getPoints(collection, 1, 1);
                var point = points[0];

                // Gather form inputs
                var distance = ol3turf.utils.getFormNumber(idDistance, "distance");
                var bearing = ol3turf.utils.getFormNumber(idBearing, "bearing");
                var units = ol3turf.utils.getFormString(idUnits, "units");

                // Collect polygons
                var output = turf.destination(point,
                        distance,
                        bearing,
                        units);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    from: point,
                    distance: distance,
                    bearing: bearing,
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
            ol3turf.utils.getControlNumber(idBearing, "Bearing", "Bearing angle (degrees)", "0", "any", "-180", "180"),
            ol3turf.utils.getControlNumber(idDistance, "Distance", "Distance from the starting point", "0", "any", "0"),
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
            var title = "Find destination point from given point";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
