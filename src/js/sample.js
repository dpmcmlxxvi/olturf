import Control from './control';
import utils from './utils';

const name = 'sample';

/*
 * Randomly sample features
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idCount = utils.getName([name, 'count'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = utils.getCollection(control, 1, Infinity);

      // Get form inputs
      const count = utils.getFormInteger(idCount, 'count');
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
    utils.getControlNumber(idCount, 'Count',
        'Number of random features to sample', '1', '1', '1'),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Randomly sample features';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

