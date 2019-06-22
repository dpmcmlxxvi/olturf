import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'distance';

/*
 * Find distance between points
 */
const action = function(control) {
  // Define control ids
  const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
  const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
  const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
  const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather points seleted
      const collection = ol3turf.utils.getCollection(control, 2, 2);
      const points = ol3turf.utils.getPoints(collection, 2, 2);
      const from = points[0];
      const to = points[1];

      // Gather form inputs
      const units = ol3turf.utils.getFormString(idUnits, 'units');

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
    ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
    ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
    ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Find distance between points';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

