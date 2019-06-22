import Control from './control';
import utils from './utils';

const name = 'circle';

/*
 * Create circle
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idRadius = utils.getName([name, 'radius'], control.prefix);
  const idSteps = utils.getName([name, 'steps'], control.prefix);
  const idUnits = utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather center point
      const collection = utils.getCollection(control, 1, 1);
      const points = utils.getPoints(collection, 1, 1);
      const center = points[0];

      // Gather form inputs
      const radius = utils.getFormNumber(idRadius, 'radius');
      const steps = utils.getFormNumber(idSteps, 'steps');
      const units = utils.getFormString(idUnits, 'units');

      // Collect polygons
      const output = turf.circle(center, radius, steps, units);

      // Remove form and display results
      control.showForm();
      const inputs = {
        center: center,
        radius: radius,
        steps: steps,
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
    utils.getControlNumber(idRadius, 'Radius', 'Radius of the circle',
        '0', 'any', '0'),
    utils.getControlNumber(idSteps, 'Steps',
        'Number of steps around circle', '3', '1', '3'),
    utils.getControlSelect(idUnits, 'Units',
        utils.getOptionsUnits()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create circle';
    return Control.create(toolbar, prefix, name, title, action);
  },
};
