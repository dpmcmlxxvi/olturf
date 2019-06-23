import Control from './control';
import utils from './utils';

const name = 'hex-grid';

/*
 * Generate Hex Grid
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idCellSize = utils.getName([name, 'cell-size'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idType = utils.getName([name, 'type'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idUnits = utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = utils.getCollection(control, 1, Infinity);

      // Gather form inputs
      const cellSize = utils.getFormNumber(idCellSize, 'cell size');
      const type = utils.getFormString(idType, 'grid type');
      const units = utils.getFormString(idUnits, 'units');
      const isTriangles = (type === 'triangles');

      // Collect polygons
      const bbox = turf.bbox(collection);
      const output = turf.hexGrid(bbox, cellSize, units, isTriangles);

      // Remove form and display results
      control.showForm();
      const inputs = {
        bbox: bbox,
        cellSize: cellSize,
        units: units,
        triangles: isTriangles,
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
    utils.getControlSelect(idType, 'Type', utils.getOptionsGrids()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Generate Hex Grid';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

