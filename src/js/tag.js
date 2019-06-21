import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals document, ol3turf, turf */

// ==================================================
// tag control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'tag';

  /**
     * Collect point attributes within polygon
     * @private
     */
  const action = function(control) {
    // Define control ids
    const idCancel = ol3turf.utils.getName([name, 'cancel'], control.prefix);
    const idField = ol3turf.utils.getName([name, 'field-property'], control.prefix);
    const idForm = ol3turf.utils.getName([name, 'form'], control.prefix);
    const idOk = ol3turf.utils.getName([name, 'ok'], control.prefix);
    const idOutField = ol3turf.utils.getName([name, 'out-field-property'], control.prefix);

    function onOK() {
      try {
        // Gather selected features
        const collection = ol3turf.utils.getCollection(control, 2, Infinity);
        const points = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
        const numPolygons = collection.features.length - points.length;
        const polygons = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

        // Get form inputs
        const field = ol3turf.utils.getFormString(idField, 'field');
        const outField = ol3turf.utils.getFormString(idOutField, 'out field');

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
        control.toolbar.ol3turf.handler.callback(name, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    }

    function onCancel() {
      control.showForm();
    }

    const controls = [
      ol3turf.utils.getControlText(idField, 'Field', 'Property in polygons to add to joined point features'),
      ol3turf.utils.getControlText(idOutField, 'Out Field', 'Property in points in which to store joined property from polygons'),
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
      const title = 'Perform spatial join of points and polygons';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
