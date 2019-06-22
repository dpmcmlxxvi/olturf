import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

// Control name
const name = 'circle';

/*
 * Create circle
 */
const action = function(control) {
  // Define control ids
  const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
  const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
  const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
  const idRadius = ol3turf.utils.getName([name, 'radius'], control.prefix);
  const idSteps = ol3turf.utils.getName([name, 'steps'], control.prefix);
  const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather center point
      const collection = ol3turf.utils.getCollection(control, 1, 1);
      const points = ol3turf.utils.getPoints(collection, 1, 1);
      const center = points[0];

      // Gather form inputs
      const radius = ol3turf.utils.getFormNumber(idRadius, 'radius');
      const steps = ol3turf.utils.getFormNumber(idSteps, 'steps');
      const units = ol3turf.utils.getFormString(idUnits, 'units');

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
    ol3turf.utils.getControlNumber(idRadius, 'Radius', 'Radius of the circle',
        '0', 'any', '0'),
    ol3turf.utils.getControlNumber(idSteps, 'Steps',
        'Number of steps around circle', '3', '1', '3'),
    ol3turf.utils.getControlSelect(idUnits, 'Units',
        ol3turf.utils.getOptionsUnits()),
    ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
    ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create circle';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};
