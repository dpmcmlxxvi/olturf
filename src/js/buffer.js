import Control from './control';
import utils from './utils';

const name = 'buffer';

/*
 * Buffer feature by given radius
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
      // Gather selected features
      const collection = utils.getCollection(control, 1, Infinity);

      // Gather form inputs
      const distance = utils.getFormNumber(idDistance, 'distance');
      const units = utils.getFormString(idUnits, 'units');

      // Collect polygons
      const output = turf.buffer(collection, distance, units);

      // Remove form and display results
      control.showForm();
      const inputs = {
        feature: collection,
        distance: distance,
        unit: units,
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
    utils.getControlNumber(idDistance, 'Distance',
        'Distance to draw the buffer', '0', 'any', '0'),
    utils.getControlSelect(idUnits, 'Units',
        utils.getOptionsUnits()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Buffer feature by given radius';
    return Control.create(toolbar, prefix, name, title, action);
  },
};
