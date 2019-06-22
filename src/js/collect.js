import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'collect';

/*
 * Collect point attributes within polygon
 */
const action = function(control) {
  // Define control ids
  const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
  const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
  const idIn = ol3turf.utils.getName([name, 'in', 'property'], control.prefix);
  const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
  const idOut = ol3turf.utils.getName([name, 'out', 'property'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected points and polygons
      const collection = ol3turf.utils.getCollection(control, 2, Infinity);
      const points = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
      const numPolygons = collection.features.length - points.length;
      const polygons = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

      // Gather form inputs
      const inProperty = ol3turf.utils.getFormString(idIn, 'In-Property');
      const outProperty = ol3turf.utils.getFormString(idOut, 'Out-Property');

      // Collect polygons
      const inPolygons = turf.featureCollection(polygons);
      const inPoints = turf.featureCollection(points);
      const output = turf.collect(inPolygons,
          inPoints,
          inProperty,
          outProperty);

      // Remove form and display results
      control.showForm();
      const inputs = {
        polygons: inPolygons,
        points: inPoints,
        inProperty: inProperty,
        outProperty: outProperty,
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
    ol3turf.utils.getControlText(idIn, 'In Property', 'Property to be nested from'),
    ol3turf.utils.getControlText(idOut, 'Out Property', 'Property to be nested into'),
    ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
    ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Collect points within polygons';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

