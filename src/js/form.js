import utils from './utils';

/**
 * @description Properties of control form
 * @typedef {object} FormProperties
 * @memberOf ol3turf
 * @property {object} [properties] Form properties.
 * @property {string} [properties.title] Control display title.
 * @property {string} [properties.type] "input" or "select".
 * @property {object} [properties.attributes] Attributes.
 * @private
 */

/**
 * Creates a form as a table with one control per row, the control's title
 * in the first column and the control in the second column.
 * @param {string} parent Element or ID string of parent element.
 * @param {string} formId ID of new form element.
 * @param {ol3turf.FormProperties[]} controls Array defining form controls.
 * @param {object} attributes Form attributes.
 * @private
 * @return {Element} Form DOM element.
 */
export default function(parent, formId, controls, attributes) {
  let container = null;
  if (typeof parent === 'string') {
    container = document.getElementById(parent);
  } else {
    container = parent;
  }
  if (container === null) {
    throw new Error('ol3turf.form: Parent element not found.');
  }
  if (formId === undefined) {
    throw new Error('ol3turf.form: Form ID not provided.');
  }
  if (controls === undefined) {
    throw new Error('ol3turf.form: Form controls not provided.');
  }

  // Create a form to add to parent
  const form = document.createElement('form');
  form.id = formId;
  form.className = 'ol3-turf-form ol-unselectable ol-control';
  form.setAttribute('onsubmit', 'return false;');
  utils.extend(attributes, form);

  // Create a table to add to form
  const table = document.createElement('table');
  table.className = 'ol3-turf-form-table';

  // Each form control is a table row with a title in the
  // header column and the control in the data column.
  controls.forEach(function(element) {
    const row = document.createElement('tr');
    row.className = 'ol3-turf-form-row';

    const th = document.createElement('th');
    th.innerHTML = element.title;
    th.className = 'ol3-turf-form-header';
    row.appendChild(th);

    const td = document.createElement('td');
    td.className = 'ol3-turf-form-data';

    const control = document.createElement(element.type);
    control.className = 'ol3-turf-form-input';
    utils.extend(element.attributes, control);

    // Check if this is a selection and add pulldown options
    if (element.type === 'select') {
      control.className = 'ol3-turf-form-select';
      if (element.options !== undefined) {
        element.options.forEach(function(opt) {
          const option = document.createElement('option');
          option.innerHTML = opt.text;
          option.className = 'ol3-turf-form-option';
          utils.extend(opt.attributes, option);
          control.appendChild(option);
        });
      }
    }

    // Add control to table
    td.appendChild(control);
    row.appendChild(td);
    table.appendChild(row);
  });

  // Add table to form and form to container
  form.appendChild(table);
  container.appendChild(form);
  return form;
};

