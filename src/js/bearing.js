import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

// ==================================================
// bearing control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'bearing';

  /**
     * Compute bearing between two points
     * @private
     */
  const action = function(control) {
    // Gather points seleted
    const collection = ol3turf.utils.getCollection(control, 2, 2);
    const points = ol3turf.utils.getPoints(collection, 2, 2);
    const start = points[0];
    const end = points[1];
    const output = turf.bearing(start, end);
    const inputs = {
      start: start,
      end: end,
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
      const title = 'Measure Bearing';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
