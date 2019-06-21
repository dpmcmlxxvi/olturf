import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals ol3turf, turf */

// ==================================================
// intersect control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'intersect';

  /**
     * Compute intersection of two polygons
     * @private
     */
  const action = function(control) {
    const collection = ol3turf.utils.getCollection(control, 2, 2);
    const polygons = ol3turf.utils.getPolygonsAll(collection, 2, 2);

    const poly1 = polygons[0];
    const poly2 = polygons[1];
    const output = turf.intersect(poly1, poly2);
    const inputs = {
      poly1: poly1,
      poly2: poly2,
    };
    control.toolbar.ol3turf.handler.callback(name, output, inputs);
  };

  return {
    /*
         * Create control then attach custom action and it's parent toolbar
         * @param toolbar Parent toolbar
         * @param prefix Selector prefix.
         */
    create: function(toolbar, prefix) {
      const title = 'Create Intersection Polygon';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
