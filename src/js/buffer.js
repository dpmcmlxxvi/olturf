import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals document, ol3turf, turf */

// ==================================================
// buffer control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'buffer';

  /**
     * Buffer feature by given radius
     * @private
     */
  const action = function(control) {
    // Define control ids
    const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
    const idDistance = ol3turf.utils.getName([name, 'distance'], control.prefix);
    const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
    const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
    const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

    function onOK() {
      try {
        // Gather selected features
        const collection = ol3turf.utils.getCollection(control, 1, Infinity);

        // Gather form inputs
        const distance = ol3turf.utils.getFormNumber(idDistance, 'distance');
        const units = ol3turf.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const output = turf.buffer(collection, distance, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          feature: collection,
          distance: distance,
          unit: units,
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
      ol3turf.utils.getControlNumber(idDistance, 'Distance', 'Distance to draw the buffer', '0', 'any', '0'),
      ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
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
      const title = 'Buffer feature by given radius';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
