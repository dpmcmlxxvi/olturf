import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils
};

/* globals document, ol3turf, turf */

//==================================================
// random control
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    // Control name
    var name = "random";

    /**
     * Create random data
     * @private
     */
    var action = function (control) {

        // Define control ids
        var idCancel = ol3turf.utils.getName([name, "cancel"], control.prefix);
        var idCount = ol3turf.utils.getName([name, "count"], control.prefix);
        var idForm = ol3turf.utils.getName([name, "form"], control.prefix);
        var idMaxRadialLength = ol3turf.utils.getName([name, "max-radial-length"], control.prefix);
        var idNumVertices = ol3turf.utils.getName([name, "num-vertices"], control.prefix);
        var idOk = ol3turf.utils.getName([name, "ok"], control.prefix);
        var idType = ol3turf.utils.getName([name, "type"], control.prefix);

        function onOK() {
            try {

                // Gather selected features
                var bbox = null;
                var collection = ol3turf.utils.getCollection(control, 0, Infinity);
                if (collection.features.length !== 0) {
                    bbox = turf.bbox(collection);
                }

                // Get form inputs
                var count = ol3turf.utils.getFormInteger(idCount, "count");
                var maxRadialLength = ol3turf.utils.getFormInteger(idMaxRadialLength, "maximum radial length");
                var numVertices = ol3turf.utils.getFormInteger(idNumVertices, "number of vertices");
                var type = ol3turf.utils.getFormString(idType, "type");

                // Generate random polygons
                var options = {
                    max_radial_length: maxRadialLength,
                    num_vertices: numVertices
                };
                if (bbox !== null) {
                    options.bbox = bbox;
                }
                var output = turf.random(type, count, options);

                // Remove form and display results
                control.showForm();
                var inputs = {
                    type: type,
                    count: count,
                    options: options
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
            ol3turf.utils.getControlSelect(idType, "Type", ol3turf.utils.getOptionsGeometry()),
            ol3turf.utils.getControlNumber(idCount, "Count", "How many geometries should be generated", "1", "1", "1"),
            ol3turf.utils.getControlNumber(idNumVertices, "# Vertices", "Used only for polygon type", "10", "1", "3"),
            ol3turf.utils.getControlNumber(idMaxRadialLength, "Max Length", "Maximum degrees a polygon can extent outwards from its center (degrees)", "10", "0.01", "0", "180"),
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
            var title = "Create random data";
            var control = ol3turf.Control.create(toolbar, prefix, name, title, action);
            return control;
        }
    };


}(ol3turf || {}));
