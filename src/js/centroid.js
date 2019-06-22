import Control from './control';
import utils from './utils';

const name = 'centroid';

/*
 * Compute centroid
 */
const action = function(control) {
  const collection = utils.getCollection(control, 1, Infinity);
  const output = turf.centroid(collection);
  const inputs = {
    features: collection,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure Centroid';
    return Control.create(toolbar, prefix, name, title, action);
  },
};
