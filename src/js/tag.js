import Control from './control';
import utils from './utils';

const name = 'tag';

/*
 * Collect point attributes within polygon
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idField = utils.getName([name, 'field-property'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idOutField = utils.getName([name, 'out-field-property'],
      control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      const collection = utils.getCollection(control, 2, Infinity);
      const points = utils.getPoints(collection, 1,
          collection.features.length - 1);
      const numPolygons = collection.features.length - points.length;
      const polygons = utils.getPolygons(collection, numPolygons, numPolygons);

      // Get form inputs
      const field = utils.getFormString(idField, 'field');
      const outField = utils.getFormString(idOutField, 'out field');

      // Collect polygons
      const inPolygons = turf.featureCollection(polygons);
      const inPoints = turf.featureCollection(points);
      const output = turf.tag(inPoints, inPolygons, field, outField);

      // Remove form and display results
      control.showForm();
      const inputs = {
        points: inPoints,
        polygons: inPolygons,
        field: field,
        outField: outField,
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
    utils.getControlText(idField, 'Field',
        'Property in polygons to add to joined point features'),
    utils.getControlText(idOutField, 'Out Field',
        'Property in points in which to store joined property from polygons'),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Perform spatial join of points and polygons';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

