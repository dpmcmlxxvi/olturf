import Control from './control';
import utils from './utils';

// Control name
const name = 'convex';

/*
 * Compute convex hull
 */
const action = function(control) {
  const collection = utils.getCollection(control, 1, Infinity);

  const output = turf.convex(collection);
  const inputs = {
    featurecollection: collection,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create Convex Hull';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

