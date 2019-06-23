import Control from './control';
import utils from './utils';

const name = 'combine';

/*
 * Compute combine of feature collection
 */
const action = function(control) {
  const collection = utils.getCollection(control, 1, Infinity);

  const output = turf.combine(collection);
  const inputs = {
    fc: collection,
  };
  control.toolbar.olturf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Combine feature collection';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

