import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};

// Control name
const name = 'center-of-mass';

/*
 * Compute center-of-mass
 */
const action = function(control) {
  const collection = ol3turf.utils.getCollection(control, 1, Infinity);
  const output = turf.centerOfMass(collection);
  const inputs = {
    features: collection,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure center of mass';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};
