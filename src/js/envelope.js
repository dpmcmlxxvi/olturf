import Control from './control';
import utils from './utils';

// Control name
const name = 'envelope';

/*
 * Compute envelope
 */
const action = function(control) {
  const collection = utils.getCollection(control, 1, Infinity);

  const output = turf.envelope(collection);
  const inputs = {
    fc: collection,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure Envelope';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

