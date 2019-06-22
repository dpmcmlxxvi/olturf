import Control from './control';
import utils from './utils';

const name = 'random';

/*
 * Create random data
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idCount = utils.getName([name, 'count'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idMaxRadialLength = utils.getName([name, 'max-radial-length'],
      control.prefix);
  const idNumVertices = utils.getName([name, 'num-vertices'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idType = utils.getName([name, 'type'], control.prefix);

  const onOK = function() {
    try {
      // Gather selected features
      let bbox = null;
      const collection = utils.getCollection(control, 0, Infinity);
      if (collection.features.length !== 0) {
        bbox = turf.bbox(collection);
      }

      // Get form inputs
      const count = utils.getFormInteger(idCount, 'count');
      const maxRadialLength = utils.getFormInteger(idMaxRadialLength,
          'maximum radial length');
      const numVertices = utils.getFormInteger(idNumVertices,
          'number of vertices');
      const type = utils.getFormString(idType, 'type');

      // Generate random polygons
      const options = {
        max_radial_length: maxRadialLength,
        num_vertices: numVertices,
      };
      if (bbox !== null) {
        options.bbox = bbox;
      }
      const output = turf.random(type, count, options);

      // Remove form and display results
      control.showForm();
      const inputs = {
        type: type,
        count: count,
        options: options,
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
    utils.getControlSelect(idType, 'Type', utils.getOptionsGeometry()),
    utils.getControlNumber(idCount, 'Count',
        'How many geometries should be generated', '1', '1', '1'),
    utils.getControlNumber(idNumVertices, '# Vertices',
        'Used only for polygon type', '10', '1', '3'),
    utils.getControlNumber(idMaxRadialLength, 'Max Length',
        'Maximum degrees a polygon can extent outwards from its center ' +
        '(degrees)', '10', '0.01', '0', '180'),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create random data';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

