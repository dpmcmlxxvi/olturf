import Control from './control';
import utils from './utils';

// Control name
const name = 'distance';

/*
 * Find distance between points
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idUnits = utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather points seleted
      const collection = utils.getCollection(control, 2, 2);
      const points = utils.getPoints(collection, 2, 2);
      const from = points[0];
      const to = points[1];

      // Gather form inputs
      const units = utils.getFormString(idUnits, 'units');

      // Collect polygons
      const output = turf.distance(from, to, units);

      // Remove form and display results
      control.showForm();
      const inputs = {
        from: from,
        to: to,
        units: units,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
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
    const title = 'Find distance between points';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

