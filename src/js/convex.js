import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

/* globals ol3turf, turf */

// ==================================================
// convex control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'convex';

  /**
     * Compute convex hull
     * @private
     */
  const action = function(control) {
    const collection = ol3turf.utils.getCollection(control, 1, Infinity);

    const output = turf.convex(collection);
    const inputs = {
      featurecollection: collection,
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
      const title = 'Create Convex Hull';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
