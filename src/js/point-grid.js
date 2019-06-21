import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals document, ol3turf, turf */

// ==================================================
// pointGrid control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'point-grid';

  /**
     * Generate Point Grid
     * @private
     */
  const action = function(control) {
    // Define control ids
    const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
    const idCellSize = ol3turf.utils.getName([name, 'cell-size'], control.prefix);
    const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
    const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
    const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

    function onOK() {
      try {
        // Gather selected features
        const collection = ol3turf.utils.getCollection(control, 1, Infinity);

        // Gather form inputs
        const cellSize = ol3turf.utils.getFormNumber(idCellSize, 'cell size');
        const units = ol3turf.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const bbox = turf.bbox(collection);
        const output = turf.pointGrid(bbox, cellSize, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          bbox: bbox,
          cellSize: cellSize,
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
      ol3turf.utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1', 'any', '0'),
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
      const title = 'Generate Point Grid';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
