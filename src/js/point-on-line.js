import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals ol3turf, turf */

// ==================================================
// pointOnLine control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'point-on-line';

  /**
     * Compute point on line
     * @private
     */
  const action = function(control) {
    const collection = ol3turf.utils.getCollection(control, 2, 2);
    const points = ol3turf.utils.getPoints(collection, 1, 1);
    const lines = ol3turf.utils.getLines(collection, 1, 1);
    const line = lines[0];
    const point = points[0];

    const output = turf.pointOnLine(line, point);
    const inputs = {
      line: line,
      point: point,
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
      const title = 'Project point on line';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
