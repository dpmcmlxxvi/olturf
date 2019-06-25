import Control from './control';
import utils from './utils';

const name = 'area';

/*
 * Compute area
 */
const action = function(control) {
  const collection = utils.getCollection(control, 1, Infinity);
  const output = turf.area(collection);
  const inputs = {
    input: collection,
  };
  control.toolbar.olturf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure Area';
    return Control.create(toolbar, prefix, name, title, action);
  },
};
