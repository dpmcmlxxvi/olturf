import Control from './control';
import utils from './utils';

const name = 'bezier';

/*
 * Create bezier curve of line
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idResolution = utils.getName([name, 'resolution'],
      control.prefix);
  const idSharpness = utils.getName([name, 'sharpness'],
      control.prefix);

  const onOK = function() {
    try {
      // Gather line seleted
      const collection = utils.getCollection(control, 1, 1);
      const lines = utils.getLines(collection, 1, 1);
      const line = lines[0];

      // Gather form inputs
      const resolution = utils.getFormNumber(idResolution,
          'resolution');
      const sharpness = utils.getFormNumber(idSharpness, 'sharpness');

      // Create bezier curve
      const output = turf.bezierSpline(line, {resolution, sharpness});

      // Remove form and display results
      control.showForm();
      const inputs = {
        line: line,
        resolution: resolution,
        sharpness: sharpness,
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
    utils.getControlNumber(idResolution, 'Resolution',
        'Time between points (milliseconds)', '10000', 'any', '0'),
    utils.getControlNumber(idSharpness, 'Sharpness',
        'Measure of how curvy the path should be between splines', '0.85',
        '0.01', '0', '1'),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create bezier curve of line';
    return Control.create(toolbar, prefix, name, title, action);
  },
};
