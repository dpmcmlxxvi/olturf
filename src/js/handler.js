/**
 * Callback handler
 * @constructor
 * @param {olturf.Toolbar} toolbar olturf toolbar
 * @private
 */
const Handler = function(toolbar) {
  this.toolbar = toolbar;
};

/**
 * Default function called by each control when turf function is completed.
 * @param {string} name Name of olturf control being handled
 * @param {object} output Output of turf function
 * @param {object} inputs Inputs provided to turf function as properties
 * @private
 */
Handler.prototype.callback = function(name, output, inputs) {
  const control = this.toolbar.olturf.controls[name];

  // First handle controls with custom messages
  // then handle controls that add output features to map
  if (output === null) {
    control.showMessage(name + ' returned null');
  } else if (name === 'area') {
    control.showMessage('area = ' + output + ' msq');
  } else if (name === 'bearing') {
    control.showMessage('bearing = ' + output + ' degrees');
  } else if (name === 'distance') {
    control.showMessage('distance = ' + output + ' ' + inputs.units);
  } else if (name === 'inside') {
    let message = 'Point is';
    if (output === false) {
      message += ' not';
    }
    message += ' inside polygon.';
    control.showMessage(message);
  } else if (name === 'line-distance') {
    control.showMessage('length = ' + output + ' ' + inputs.units);
  } else if (name === 'planepoint') {
    control.showMessage('z = ' + output);
  } else {
    control.addFeatures(output);
  }
};

export default Handler;
