import Control from './control';
import utils from './utils';

const name = 'bearing';

/*
 * Compute bearing between two points
 */
const action = function(control) {
  // Gather points seleted
  const collection = utils.getCollection(control, 2, 2);
  const points = utils.getPoints(collection, 2, 2);
  const start = points[0];
  const end = points[1];
  const output = turf.bearing(start, end);
  const inputs = {
    start: start,
    end: end,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure Bearing';
    return Control.create(toolbar, prefix, name, title, action);
  },
};
