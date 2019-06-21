import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals document, ol3turf, turf */

// ==================================================
// lineDistance control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'line-distance';

  /**
     * Compute length of feature
     * @private
     */
  const action = function(control) {
    // Define control ids
    const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
    const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
    const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
    const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

    function onOK() {
      try {
        // Gather selected features
        const collection = ol3turf.utils.getCollection(control, 1, Infinity);

        // Gather form inputs
        const units = ol3turf.utils.getFormString(idUnits, 'units');

        // Compute length
        const output = turf.lineDistance(collection, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          line: collection,
          units: units,
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
      const title = 'Measure Length';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
