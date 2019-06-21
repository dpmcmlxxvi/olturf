import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals document, ol3turf, turf */

// ==================================================
// destination control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'destination';

  /**
     * Find destination point from given point
     * @private
     */
  const action = function(control) {
    // Define control ids
    const idBearing = ol3turf.utils.getName([name, 'bearing'], control.prefix);
    const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
    const idDistance = ol3turf.utils.getName([name, 'distance'], control.prefix);
    const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
    const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
    const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

    function onOK() {
      try {
        // Gather point seleted
        const collection = ol3turf.utils.getCollection(control, 1, 1);
        const points = ol3turf.utils.getPoints(collection, 1, 1);
        const point = points[0];

        // Gather form inputs
        const distance = ol3turf.utils.getFormNumber(idDistance, 'distance');
        const bearing = ol3turf.utils.getFormNumber(idBearing, 'bearing');
        const units = ol3turf.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const output = turf.destination(point,
            distance,
            bearing,
            units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          from: point,
          distance: distance,
          bearing: bearing,
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
      ol3turf.utils.getControlNumber(idBearing, 'Bearing', 'Bearing angle (degrees)', '0', 'any', '-180', '180'),
      ol3turf.utils.getControlNumber(idDistance, 'Distance', 'Distance from the starting point', '0', 'any', '0'),
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
      const title = 'Find destination point from given point';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
