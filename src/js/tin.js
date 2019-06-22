import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'tin';

/*
 * Compute tin mesh
 */
const action = function(control) {
  // Define control ids
  const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
  const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
  const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
  const idZ = ol3turf.utils.getName([name, 'z'], control.prefix);

  const onOK = function() {
    try {
      let collection = ol3turf.utils.getCollection(control, 3, Infinity);
      const numPoints = collection.features.length;
      const points = ol3turf.utils.getPoints(collection, numPoints, numPoints);
      collection = turf.featureCollection(points);

      // Get form inputs
      const z = ol3turf.utils.getFormString(idZ, 'z');

      const output = turf.tin(collection, z);
      const inputs = {
        points: collection,
        z: z,
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
    ol3turf.utils.getControlText(idZ, 'Z', '(Optional) Property from which to pull z values'),
    ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
    ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create TIN';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

