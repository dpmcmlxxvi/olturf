import Control from './control';
import utils from './utils';

const name = 'tin';

/*
 * Compute tin mesh
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idZ = utils.getName([name, 'z'], control.prefix);

  const onOK = function() {
    try {
      let collection = utils.getCollection(control, 3, Infinity);
      const numPoints = collection.features.length;
      const points = utils.getPoints(collection, numPoints, numPoints);
      collection = turf.featureCollection(points);

      // Get form inputs
      const z = utils.getFormString(idZ, 'z');

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
    utils.getControlText(idZ, 'Z',
        '(Optional) Property from which to pull z values'),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create TIN';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

