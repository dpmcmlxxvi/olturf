import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'simplify';

/*
 * Simplify shape
 */
const action = function(control) {
  // Define control ids
  const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
  const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
  const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
  const idQuality = ol3turf.utils.getName([name, 'quality'], control.prefix);
  const idTolerance = ol3turf.utils.getName([name, 'tolerance'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);

      // Get form inputs
      const tolerance = ol3turf.utils.getFormNumber(idTolerance, 'tolerance');
      const quality = ol3turf.utils.getFormString(idQuality, 'quality');
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
    ol3turf.utils.getControlNumber(idTolerance, 'Tolerance', 'Simplification tolerance', '1', '0.01', '0'),
    ol3turf.utils.getControlSelect(idQuality, 'Quality', ol3turf.utils.getOptionsQuality()),
    ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
    ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Simplify shape';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

