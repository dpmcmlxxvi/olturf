import Control from './control';
import utils from './utils';

const ol3turf = {
  Control,
  utils,
};


// Control name
const name = 'envelope';

/*
 * Compute envelope
 */
const action = function(control) {
  const collection = ol3turf.utils.getCollection(control, 1, Infinity);

  const output = turf.envelope(collection);
  const inputs = {
    fc: collection,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Measure Envelope';
    return ol3turf.Control.create(toolbar, prefix, name, title, action);
  },
};

