import Control from './control';
import utils from './utils';

// Control name
const name = 'line-slice-along';

/*
 * Compute line slice
 */
const action = function(control) {
  // Define control ids
  const idCancel = utils.getName([name, 'cancel'], control.prefix);
  const idForm = utils.getName([name, 'form'], control.prefix);
  const idOk = utils.getName([name, 'ok'], control.prefix);
  const idStart = utils.getName([name, 'start'], control.prefix);
  const idStop = utils.getName([name, 'stop'], control.prefix);
  const idUnits = utils.getName([name, 'units'], control.prefix);

  const onOK = function() {
    try {
      // Gather line seleted
      const collection = utils.getCollection(control, 1, 1);
      const lines = utils.getLines(collection, 1, 1);
      const line = lines[0];

      // Gather form inputs
      const start = utils.getFormNumber(idStart, 'start');
      const stop = utils.getFormNumber(idStop, 'stop');

      const isOrdered = (start < stop);
      if (isOrdered !== true) {
        throw new Error('Start must be less than stop');
      }

      // Truncate at line length otherwise lineSliceAlong fails
      const units = utils.getFormString(idUnits, 'units');
      const length = turf.lineDistance(line, units);
      if (start > length) {
        throw new Error('Start must be less than line length');
      }
      if (stop > length) {
        throw new Error('Stop must be less than line length');
      }

      // Collect polygons
      const output = turf.lineSliceAlong(line, start, stop, units);

      // Remove form and display results
      control.showForm();
      const inputs = {
        line: line,
        start: start,
        stop: stop,
        units: units,
      };
      control.toolbar.ol3turf.handler.callback(name, output, inputs);
    } catch (e) {
      control.showMessage(e);
    }
  };

  const onCancel = function() {
    control.showForm();
  };

  const controls = [
    utils.getControlNumber(idStart, 'Start',
        'Starting distance along the line', '0', 'any', '0'),
    utils.getControlNumber(idStop, 'Stop', 'Stoping distance along the line',
        '0', 'any', '0'),
    utils.getControlSelect(idUnits, 'Units', utils.getOptionsUnits()),
    utils.getControlInput(idOk, onOK, '', 'OK'),
    utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
  ];

  control.showForm(controls, idForm);
};

export default {
  create: function(toolbar, prefix) {
    const title = 'Create line slice';
    return Control.create(toolbar, prefix, name, title, action);
  },
};

