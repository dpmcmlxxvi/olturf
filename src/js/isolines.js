import Control from './control';
import utils from './utils';

const name = 'isolines';

/*
 * Create isolines
 */
const action = function(control) {
  // Define control ids
  const idBreaks = utils.getName([name, 'breaks'], control.prefix);
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idZ = utils.getName([name, 'zProperty'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = utils.getCollection(control, 1, Infinity);

      // Gather form inputs
      const breaks = utils.getFormArray(idBreaks, 'breaks');
      const zProperty = utils.getFormString(idZ, 'zProperty');

      // Generate isolines features
      const output = turf.isolines(collection, breaks, {zProperty});

      // Remove form and display results
      control.showForm();
      const inputs = {
        points: collection,
        zProperty: zProperty,
        breaks: breaks,
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
    utils.getControlText(idZ, 'Z Property',
        'Property name in points from which z-values will be pulled'),
    utils.getControlText(idBreaks, 'Breaks',
        'Comma separated list of where to draw contours'),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create isolines';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

