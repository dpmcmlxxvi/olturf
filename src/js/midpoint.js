import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals ol3turf, turf */

// ==================================================
// midpoint control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'midpoint';

  /**
     * Compute midpoint
     * @private
     */
  const action = function(control) {
    const collection = ol3turf.utils.getCollection(control, 2, 2);
    const points = ol3turf.utils.getPoints(collection, 2, 2);
    const from = points[0];
    const to = points[1];
    const output = turf.midpoint(from, to);
    const inputs = {
      from: from,
      to: to,
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
      const title = 'Measure Midpoint';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
