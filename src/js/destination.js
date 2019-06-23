import Control from './control';
import utils from './utils';

const name = 'destination';

/*
 * Find destination point from given point
 */
const action = function(control) {
  // Define control ids
  const idBearing = utils.getName([name, 'bearing'], control.prefix);
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idDistance = utils.getName([name, 'distance'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idUnits = utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather point seleted
      const collection = utils.getCollection(control, 1, 1);
      const points = utils.getPoints(collection, 1, 1);
      const point = points[0];

      // Gather form inputs
      const distance = utils.getFormNumber(idDistance, 'distance');
      const bearing = utils.getFormNumber(idBearing, 'bearing');
      const units = utils.getFormString(idUnits, 'units');

      // Collect polygons
      const output = turf.destination(point,
          distance,
          bearing,
          units);

      // Remove form and display results
      control.showForm();
      const inputs = {
        from: point,
        distance: distance,
        bearing: bearing,
        units: units,
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
    utils.getControlNumber(idBearing, 'Bearing', 'Bearing angle (degrees)',
        '0', 'any', '-180', '180'),
    utils.getControlNumber(idDistance, 'Distance',
        'Distance from the starting point', '0', 'any', '0'),
    utils.getControlSelect(idUnits, 'Units', utils.getOptionsUnits()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Find destination point from given point';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

