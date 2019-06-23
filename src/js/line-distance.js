import Control from './control';
import utils from './utils';

const name = 'line-distance';

/*
 * Compute length of feature
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idUnits = utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = utils.getCollection(control, 1, Infinity);

      // Gather form inputs
      const units = utils.getFormString(idUnits, 'units');

      // Compute length
      const output = turf.lineDistance(collection, units);

      // Remove form and display results
      control.showForm();
      const inputs = {
        line: collection,
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
    utils.getControlSelect(idUnits, 'Units', utils.getOptionsUnits()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure Length';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

