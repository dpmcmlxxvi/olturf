import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'sample';

/*
 * Randomly sample features
 */
const action = function(control) {
  // Define control ids
  const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
  const idCount = ol3turf.utils.getName([name, 'count'], control.prefix);
  const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
  const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = ol3turf.utils.getCollection(control, 1, Infinity);

      // Get form inputs
      const count = ol3turf.utils.getFormInteger(idCount, 'count');
      if (count > collection.features.length) {
        throw new Error('Feature count must be greater than sampling count.');
      }

      // Generate sample features
      const output = turf.sample(collection, count);

      // Remove form and display results
      control.showForm();
      const inputs = {
        featurecollection: collection,
        num: count,
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
    ol3turf.utils.getControlNumber(idCount, 'Count', 'Number of random features to sample', '1', '1', '1'),
    ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
    ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Randomly sample features';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

