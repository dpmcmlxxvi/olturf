import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

// ==================================================
// area control
// --------------------------------------------------
export default (function(ol3turf) {
  'use strict';

  // Control name
  const name = 'area';

  /**
     * Compute area
     * @private
     */
  const action = function(control) {
    const collection = ol3turf.utils.getCollection(control, 1, Infinity);

    const output = turf.area(collection);
    const inputs = {
      input: collection,
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
      const title = 'Measure Area';
      const control = ol3turf.Control.create(toolbar, prefix, name, title, action);
      return control;
    },
  };
}(ol3turf || {}));
