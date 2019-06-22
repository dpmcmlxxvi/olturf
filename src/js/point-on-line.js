import Control from './control';
import utils from './utils';

const name = 'point-on-line';

/*
 * Compute point on line
 */
const action = function(control) {
  const collection = utils.getCollection(control, 2, 2);
  const points = utils.getPoints(collection, 1, 1);
  const lines = utils.getLines(collection, 1, 1);
  const line = lines[0];
  const point = points[0];

  const output = turf.pointOnLine(line, point);
  const inputs = {
    line: line,
    point: point,
  };
  control.toolbar.ol3turf.handler.callback(name, output, inputs);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Project point on line';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

