import Control from './control';
import utils from './utils';

const name = 'along';

/*
 * Find point along line at given distance
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idDistance = utils.getName([name, 'distance'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idUnits = utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather line seleted
      const collection = utils.getCollection(control, 1, 1);
      const lines = utils.getLines(collection, 1, 1);
      const line = lines[0];

      // Gather form inputs
      const distance = utils.getFormNumber(idDistance, 'distance');
      const units = utils.getFormString(idUnits, 'units');

      // Collect polygons
      const output = turf.along(line, distance, units);

      // Remove form and display results
      control.showForm();
      const inputs = {
        line: line,
        distance: distance,
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
    utils.getControlNumber(idDistance,
        'Distance', 'Distance along the line', '0', 'any', '0'),
    utils.getControlSelect(idUnits,
        'Units', utils.getOptionsUnits()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Find point along line at given distance';
    return Control.create(toolbar, prefix, name, title, action);
  },
};
