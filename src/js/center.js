import Control from './control';
import utils from './utils';

const name = 'center';

/*
 * Compute center
 */
const action = function(control) {
  const collection = utils.getCollection(control, 1, Infinity);
  const output = turf.center(collection);
  const inputs = {
    features: collection,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure Center';
    return Control.create(toolbar, prefix, name, title, action);
  },
};
