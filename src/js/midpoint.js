import Control from './control';
import utils from './utils';

const name = 'midpoint';

/*
 * Compute midpoint
 */
const action = function(control) {
  const collection = utils.getCollection(control, 2, 2);
  const points = utils.getPoints(collection, 2, 2);
  const from = points[0];
  const to = points[1];
  const output = turf.midpoint(from, to);
  const inputs = {
    from: from,
    to: to,
  };
  control.toolbar.olturf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure Midpoint';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

