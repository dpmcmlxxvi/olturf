import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals ol3turf, turf */

// ==================================================
// square control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'square';

  /**
     * Compute square
     * @private
     */
  const action = function(control) {
    // Gather selected features
    const collection = ol3turf.utils.getCollection(control, 1, Infinity);
    const bbox = turf.bbox(collection);
    const square = turf.square(bbox);

    const output = turf.bboxPolygon(square);
    const inputs = {
      bbox: bbox,
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
      const title = 'Create Square';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
