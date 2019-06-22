import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'midpoint';

/*
 * Compute midpoint
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

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure Midpoint';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

