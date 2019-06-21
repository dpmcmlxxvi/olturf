import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals document, ol3turf, turf */

// ==================================================
// bezier control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'bezier';

  /**
     * Create bezier curve of line
     * @private
     */
  const action = function(control) {
    // Define control ids
    const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
    const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
    const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
    const idResolution = ol3turf.utils.getName([name, 'resolution'], control.prefix);
    const idSharpness = ol3turf.utils.getName([name, 'sharpness'], control.prefix);

    function onOK() {
      try {
        // Gather line seleted
        const collection = ol3turf.utils.getCollection(control, 1, 1);
        const lines = ol3turf.utils.getLines(collection, 1, 1);
        const line = lines[0];

        // Gather form inputs
        const resolution = ol3turf.utils.getFormNumber(idResolution, 'resolution');
        const sharpness = ol3turf.utils.getFormNumber(idSharpness, 'sharpness');

        // Create bezier curve
        const output = turf.bezier(line, resolution, sharpness);

        // Remove form and display results
        control.showForm();
        const inputs = {
          line: line,
          resolution: resolution,
          sharpness: sharpness,
        };
        control.toolbar.ol3turf.handler.callback(name, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    }

    function onCancel() {
      control.showForm();
    }

    const controls = [
      ol3turf.utils.getControlNumber(idResolution, 'Resolution', 'Time between points (milliseconds)', '10000', 'any', '0'),
      ol3turf.utils.getControlNumber(idSharpness, 'Sharpness', 'Measure of how curvy the path should be between splines', '0.85', '0.01', '0', '1'),
      ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  return {
    /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
    create: function(toolbar, prefix) {
      const title = 'Create bezier curve of line';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
