/**
 * Callback handler
 * @constructor
 * @param {ol3turf.Toolbar} toolbar ol3-turf toolbar
 * @private
 */
const Handler = function(toolbar) {
  this.toolbar = toolbar;
};

/**
 * Default function called by each control when turf function is completed.
 * @param {string} name Name of ol3-turf control being handled
 * @param {object} output Output of turf function
 * @param {object} inputs Inputs provided to turf function as properties
 * @private
 */
Handler.prototype.callback = function(name, output, inputs) {
  const control = this.toolbar.ol3turf.controls[name];

  // First handle controls with custom messages
  // then handle controls that add output features to map
  if (name === 'area') {
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
