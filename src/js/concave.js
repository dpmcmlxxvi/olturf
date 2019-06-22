import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'concave';

/*
 * Buffer feature by given radius
 */
const action = function(control) {
  // Define control ids
  const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
  const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
  const idMaxEdge = ol3turf.utils.getName([name, 'max', 'edge'], control.prefix);
  const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
  const idUnits = ol3turf.utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = ol3turf.utils.getCollection(control, 3, Infinity);
      const numPoints = collection.features.length;
      const pts = ol3turf.utils.getPoints(collection, numPoints, numPoints);

      // Gather form inputs
      const maxEdge = ol3turf.utils.getFormNumber(idMaxEdge, 'Max Edge');
      const units = ol3turf.utils.getFormString(idUnits, 'units');

      // Collect polygons
      const points = turf.featureCollection(pts);
      const output = turf.concave(points, maxEdge, units);

      // Remove form and display results
      control.showForm();
      const inputs = {
        points: points,
        maxEdge: maxEdge,
        units: units,
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
    ol3turf.utils.getControlNumber(idMaxEdge, 'Max Edge Size', 'Maximum size of an edge necessary for part of the hull to become concave', '0', 'any', '0'),
    ol3turf.utils.getControlSelect(idUnits, 'Units', ol3turf.utils.getOptionsUnits()),
    ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
    ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create Concave Hull';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

