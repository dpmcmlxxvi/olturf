import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals document, ol3turf, turf */

// ==================================================
// random control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'random';

  /**
     * Create random data
     * @private
     */
  const action = function(control) {
    // Define control ids
    const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
    const idCount = ol3turf.utils.getName([name, 'count'], control.prefix);
    const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
    const idMaxRadialLength = ol3turf.utils.getName([name, 'max-radial-length'], control.prefix);
    const idNumVertices = ol3turf.utils.getName([name, 'num-vertices'], control.prefix);
    const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
    const idType = ol3turf.utils.getName([name, 'type'], control.prefix);

    function onOK() {
      try {
        // Gather selected features
        let bbox = null;
        const collection = ol3turf.utils.getCollection(control, 0, Infinity);
        if (collection.features.length !== 0) {
          bbox = turf.bbox(collection);
        }

        // Get form inputs
        const count = ol3turf.utils.getFormInteger(idCount, 'count');
        const maxRadialLength = ol3turf.utils.getFormInteger(idMaxRadialLength, 'maximum radial length');
        const numVertices = ol3turf.utils.getFormInteger(idNumVertices, 'number of vertices');
        const type = ol3turf.utils.getFormString(idType, 'type');

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
    }

    function onCancel() {
      control.showForm();
    }

    const controls = [
      ol3turf.utils.getControlSelect(idType, 'Type', ol3turf.utils.getOptionsGeometry()),
      ol3turf.utils.getControlNumber(idCount, 'Count', 'How many geometries should be generated', '1', '1', '1'),
      ol3turf.utils.getControlNumber(idNumVertices, '# Vertices', 'Used only for polygon type', '10', '1', '3'),
      ol3turf.utils.getControlNumber(idMaxRadialLength, 'Max Length', 'Maximum degrees a polygon can extent outwards from its center (degrees)', '10', '0.01', '0', '180'),
      ol3turf.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  return {
    /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
    create: function(toolbar, prefix) {
      const title = 'Create random data';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
