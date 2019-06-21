import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals ol3turf, turf */

// ==================================================
// within control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'within';

  /**
     * Compute points within polygons
     * @private
     */
  const action = function(control) {
    const collection = ol3turf.utils.getCollection(control, 2, Infinity);
    const pts = ol3turf.utils.getPoints(collection, 1, collection.features.length - 1);
    const numPolygons = collection.features.length - pts.length;
    const polys = ol3turf.utils.getPolygons(collection, numPolygons, numPolygons);

    const points = turf.featureCollection(pts);
    const polygons = turf.featureCollection(polys);

    const output = turf.within(points, polygons);
    if (output.features.length === 0) {
      throw new Error('No points found within.');
    }
    const inputs = {
      points: points,
      polygons: polygons,
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
      const title = 'Find points within polygons';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
