import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals document, ol3turf, turf */

// ==================================================
// lineSlice control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'line-slice-along';

  /**
     * Compute line slice
     * @private
     */
  const action = function(control) {
    // Define control ids
    const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
    const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
    const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
    const idStart = ol3turf.utils.getName([name, 'start'], control.prefix);
    const idStop = ol3turf.utils.getName([name, 'stop'], control.prefix);
    const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

    function onOK() {
      try {
        // Gather line seleted
        const collection = ol3turf.utils.getCollection(control, 1, 1);
        const lines = ol3turf.utils.getLines(collection, 1, 1);
        const line = lines[0];

        // Gather form inputs
        const start = ol3turf.utils.getFormNumber(idStart, 'start');
        const stop = ol3turf.utils.getFormNumber(idStop, 'stop');

        const isOrdered = (start < stop);
        if (isOrdered !== true) {
          throw new Error('Start must be less than stop');
        }

        // Truncate at line length otherwise lineSliceAlong fails
        const units = ol3turf.utils.getFormString(idUnits, 'units');
        const length = turf.lineDistance(line, units);
        if (start > length) {
          throw new Error('Start must be less than line length');
        }
        if (stop > length) {
          throw new Error('Stop must be less than line length');
        }

        // Collect polygons
        const output = turf.lineSliceAlong(line, start, stop, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          line: line,
          start: start,
          stop: stop,
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
      ol3turf.utils.getControlNumber(idStart, 'Start', 'Starting distance along the line', '0', 'any', '0'),
      ol3turf.utils.getControlNumber(idStop, 'Stop', 'Stoping distance along the line', '0', 'any', '0'),
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
      const title = 'Create line slice';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
