import Control from './control';
import utils from './utils';

const name = 'point-grid';

/*
 * Generate Point Grid
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idCellSize = utils.getName([name, 'cell-size'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idUnits = utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = utils.getCollection(control, 1, Infinity);

      // Gather form inputs
      const cellSize = utils.getFormNumber(idCellSize, 'cell size');
      const units = utils.getFormString(idUnits, 'units');

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
      control.toolbar.olturf.handler.callback(name, output, inputs);
    } catch (e) {
      control.showMessage(e);
    }
  };

  const onCancel = function() {
    control.showForm();
  };

  const controls = [
    utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1',
        'any', '0'),
    utils.getControlSelect(idUnits, 'Units', utils.getOptionsUnits()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Generate Point Grid';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

