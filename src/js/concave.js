import Control from './control';
import utils from './utils';

const name = 'concave';

/*
 * Buffer feature by given radius
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idMaxEdge = utils.getName([name, 'max', 'edge'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idUnits = utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = utils.getCollection(control, 3, Infinity);
      const numPoints = collection.features.length;
      const pts = utils.getPoints(collection, numPoints, numPoints);

      // Gather form inputs
      const maxEdge = utils.getFormNumber(idMaxEdge, 'Max Edge');
      const units = utils.getFormString(idUnits, 'units');

      // Collect polygons
      const points = turf.featureCollection(pts);
      const output = turf.concave(points, {maxEdge, units});

      // Remove form and display results
      control.showForm();
      const inputs = {
        points: points,
        maxEdge: maxEdge,
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
    utils.getControlNumber(idMaxEdge, 'Max Edge Size',
        'Maximum size of an edge necessary for part of the hull to become ' +
        'concave', '0', 'any', '0'),
    utils.getControlSelect(idUnits, 'Units', utils.getOptionsUnits()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create Concave Hull';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

