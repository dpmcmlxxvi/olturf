import Control from './control';
import utils from './utils';

const name = 'simplify';

/*
 * Simplify shape
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idQuality = utils.getName([name, 'quality'], control.prefix);
  const idTolerance = utils.getName([name, 'tolerance'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = utils.getCollection(control, 1, Infinity);

      // Get form inputs
      const tolerance = utils.getFormNumber(idTolerance, 'tolerance');
      const quality = utils.getFormString(idQuality, 'quality');
      const highQuality = (quality === 'high');

      // Collect polygons
      const output = turf.simplify(collection, tolerance, highQuality);

      // Remove form and display results
      control.showForm();
      const inputs = {
        feature: collection,
        tolerance: tolerance,
        highQuality: highQuality,
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
    utils.getControlNumber(idTolerance, 'Tolerance',
        'Simplification tolerance', '1', '0.01', '0'),
    utils.getControlSelect(idQuality, 'Quality', utils.getOptionsQuality()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Simplify shape';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

