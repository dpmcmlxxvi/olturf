import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'combine';

/*
 * Compute combine of feature collection
 */
const action = function(control) {
  const collection = ol3turf.utils.getCollection(control, 1, Infinity);

  const output = turf.combine(collection);
  const inputs = {
    fc: collection,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Combine feature collection';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

