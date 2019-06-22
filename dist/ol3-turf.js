/**
 * ol3-turf v0.6.0
 * A Turf toolbar for OpenLayers.
 *
 * @author [object Object]
 * @license MIT
 * @preserve
 */

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.ol3turf = factory());
}(this, function () { 'use strict';

  /*
   * Object to encapsulate all available utility methods
   */
  const ol3turf = {
    utils: {},
  };

  /**
   * Extend properties from source to target objects recursively.
   * @param {object} source Source object
   * @param {object} target Target object
   * @private
   */
  ol3turf.utils.extend = function(source, target) {
    if ((source === undefined) || target === undefined) {
      return;
    }
    Object.keys(source).forEach(function(property) {
      const src = source[property];
      if ((src !== null) && (typeof src === 'object')) {
        if (target[property] === undefined) {
          target[property] = {};
        }
        ol3turf.utils.extend(src, target[property]);
        return;
      }
      target[property] = src;
    });
  };

  /**
   * Get ol3-turf class selector with given suffices
   * @param {string[]} suffices List of suffices to append to base name
   * @param {string} prefix Selector prefix
   * @private
   * @return {string} Class selector string ".ol3-turf-..."
   */
  ol3turf.utils.getClass = function(suffices, prefix) {
    return '.' + ol3turf.utils.getName(suffices, prefix);
  };

  /**
   * Get selected features collection
   * @param {ol3turf.Control} control Control to extract feature collection
   * @param {number} min Minimum number of expected features in collection
   * @param {number} max Maximum number of expected features in collection
   * @private
   * @return {object} GeoJSON FeatureCollection
   * @throws {Error} Invalid number of features found
   */
  ol3turf.utils.getCollection = function(control, min, max) {
    const collection = control.getFeatures();
    if (collection.features.length < min) {
      throw new Error('Number of features less than ' + min);
    }
    if (collection.features.length > max) {
      throw new Error('Number of features greater than ' + max);
    }
    return collection;
  };

  /**
   * Get control input attributes
   * @param {string} id Control ID
   * @param {string} onclick Callback function
   * @param {string} title Control header title
   * @param {string} value Control value
   * @private
   * @return {object} Control input attributes
   */
  ol3turf.utils.getControlInput = function(id, onclick, title, value) {
    return {
      title: title,
      type: 'input',
      attributes: {
        name: id,
        onclick: onclick,
        type: 'submit',
        value: value,
      },
    };
  };

  /**
   * Get control input attributes
   * @param {string} id Control ID
   * @param {string} title Control header title
   * @param {string} text Control attribute 'title' text
   * @param {string} value Control attribute 'value' value
   * @param {string} step Control attribute 'step' value
   * @param {string} min Control attribute 'min' value
   * @param {string} max Control attribute 'max' value
   * @private
   * @return {object} Control input attributes
   */
  ol3turf.utils.getControlNumber = function(id, title, text, value, step, min, max) {
    return {
      title: title,
      type: 'input',
      attributes: {
        id: id,
        name: id,
        min: min,
        max: max,
        step: step,
        title: text,
        type: 'number',
        value: value,
      },
    };
  };


  /**
   * Get control select attributes
   * @param {string} id Control ID
   * @param {string} title Control header title
   * @param {string} options Control options.
   * @private
   * @return {object} Control button attributes
   */
  ol3turf.utils.getControlSelect = function(id, title, options) {
    return {
      title: title,
      type: 'select',
      attributes: {
        id: id,
        name: id,
      },
      options: options,
    };
  };

  /**
   * Get control text attributes
   * @param {string} id Control ID
   * @param {string} title Control header title
   * @param {string} text Control text
   * @private
   * @return {object} Control text attributes
   */
  ol3turf.utils.getControlText = function(id, title, text) {
    return {
      title: title,
      type: 'input',
      attributes: {
        id: id,
        name: id,
        title: text,
        type: 'text',
      },
    };
  };

  /**
   * Get element string for a given array of ol3-turf suffices
   * @param {string} name Element name string (e.g., input, select)
   * @param {string[]} suffices List of suffices to append to base name
   * @param {string} prefix Selector prefix
   * @private
   * @return {string} Element string (e.g., "input[name=ol3-turf-...")
   */
  ol3turf.utils.getElement = function(name, suffices, prefix) {
    return name + '[name=\'' + ol3turf.utils.getName(suffices, prefix) + '\']';
  };

  /**
   * Get features in collection
   * @param {string[]} types Feature types allowed (e.g., LineString, Point)
   * @param {object} collection GeoJSON FeatureCollection
   * @param {number} min Minimum number of expected lines in collection
   * @param {number} max Maximum number of expected lines in collection
   * @private
   * @return {object[]} Features found
   * @throws {Error} Invalid number of features found
   */
  ol3turf.utils.getFeatures = function(types, collection, min, max) {
    const features = [];
    collection.features.forEach(function(feature) {
      if (types.indexOf(feature.geometry.type) > -1) {
        features.push(feature);
      }
    });
    if (features.length < min) {
      throw new Error('Number of \'' + types + '\' features less than ' + min);
    }
    if (features.length > max) {
      throw new Error('Number of \'' + types + '\' features greater than ' + max);
    }
    return features;
  };

  /**
   * Get array of numbers delimited by commas from form field
   * @param {string} id Selector ID of form field
   * @param {string} name Name of field
   * @private
   * @return {number[]} Numeric value of form field
   * @throws {Error} Field value is not numeric array
   */
  ol3turf.utils.getFormArray = function(id, name) {
    const input = ol3turf.utils.getFormString(id, name);
    const values = [];
    input.split(',').forEach(function(value) {
      const num = parseFloat(value);
      if (Number(num) !== num) {
        throw new Error('Invalid ' + name);
      }
      values.push(num);
    });
    return values;
  };

  /**
   * Get integer from form field
   * @param {string} id Selector ID of form field
   * @param {string} name Name of field
   * @private
   * @return {number} Integer value of form field
   * @throws {Error} Field value is not integer
   */
  ol3turf.utils.getFormInteger = function(id, name) {
    const value = parseInt(document.getElementById(id).value, 10);
    if (Number(value) !== value) {
      throw new Error('Invalid ' + name);
    }
    return value;
  };

  /**
   * Get number from form field
   * @param {string} id Selector ID of form field
   * @param {string} name Name of field
   * @private
   * @return {number} Numeric value of form field
   * @throws {Error} Field value is not numeric
   */
  ol3turf.utils.getFormNumber = function(id, name) {
    const value = parseFloat(document.getElementById(id).value);
    if (Number(value) !== value) {
      throw new Error('Invalid ' + name);
    }
    return value;
  };

  /**
   * Get string from form field
   * @param {string} id Selector ID of form field
   * @param {string} name Name of field
   * @private
   * @return {string} String value of form field
   * @throws {Error} Field value is not non-empty string
   */
  ol3turf.utils.getFormString = function(id, name) {
    const value = document.getElementById(id).value;
    if (!value || !value.trim()) {
      throw new Error('Invalid ' + name);
    }
    return value;
  };

  /**
   * Get ol3-turf id selector with given suffices
   * @param {string[]} suffices List of suffices to append to base name
   * @param {string} prefix Selector prefix
   * @private
   * @return {string} Id selector string "#ol3-turf-..."
   */
  ol3turf.utils.getId = function(suffices, prefix) {
    return '#' + ol3turf.utils.getName(suffices, prefix);
  };

  /**
   * Get lines in collection
   * @param {object} collection GeoJSON FeatureCollection
   * @param {number} min Minimum number of expected lines in collection
   * @param {number} max Maximum number of expected lines in collection
   * @private
   * @return {object[]} Lines found
   * @throws {Error} Invalid number of lines found
   */
  ol3turf.utils.getLines = function(collection, min, max) {
    return ol3turf.utils.getFeatures(['LineString'], collection, min, max);
  };

  /**
   * Get ol3-turf name with given suffices appended with hyphens
   * @param {string[]} suffices List of suffices to append to base name
   * @param {string} prefix Selector prefix
   * @private
   * @return {string} Control name string "ol3-turf-..."
   */
  ol3turf.utils.getName = function(suffices, prefix) {
    if (prefix === undefined) {
      prefix = 'ol3-turf';
    }
    let name = prefix;
    suffices.forEach(function(suffix) {
      name += '-' + suffix;
    });
    return name;
  };

  /**
   * Get turf geometry options for drop down menu
   * @private
   * @return {object[]} Geometry options
   */
  ol3turf.utils.getOptionsGeometry = function() {
    return [
      {
        text: 'Points',
        attributes: {
          selected: 'selected',
          value: 'points',
        },
      },
      {
        text: 'Polygons',
        attributes: {
          value: 'polygons',
        },
      },
    ];
  };

  /**
   * Get turf grid options for drop down menu
   * @private
   * @return {object[]} Grid options
   */
  ol3turf.utils.getOptionsGrids = function() {
    return [
      {
        text: 'Hexagons',
        attributes: {
          selected: 'selected',
          value: 'hexagons',
        },
      },
      {
        text: 'Triangles',
        attributes: {
          value: 'triangles',
        },
      },
    ];
  };

  /**
   * Get turf quality options for drop down menu
   * @private
   * @return {object[]} Quality options
   */
  ol3turf.utils.getOptionsQuality = function() {
    return [
      {
        text: 'High',
        attributes: {
          value: 'high',
        },
      },
      {
        text: 'Low',
        attributes: {
          selected: 'selected',
          value: 'low',
        },
      },
    ];
  };

  /**
   * Get turf unit options for drop down menu
   * @private
   * @return {object[]} Unit options
   */
  ol3turf.utils.getOptionsUnits = function() {
    return [
      {
        text: 'degrees',
        attributes: {
          value: 'degrees',
        },
      },
      {
        text: 'kilometers',
        attributes: {
          selected: 'selected',
          value: 'kilometers',
        },
      },
      {
        text: 'miles',
        attributes: {
          value: 'miles',
        },
      },
      {
        text: 'radians',
        attributes: {
          value: 'radians',
        },
      },
    ];
  };

  /**
   * Get points in collection
   * @param {object} collection GeoJSON FeatureCollection
   * @param {number} min Minimum number of expected points in collection
   * @param {number} max Maximum number of expected points in collection
   * @private
   * @return {object[]} Points found
   * @throws {Error} Invalid number of points found
   */
  ol3turf.utils.getPoints = function(collection, min, max) {
    return ol3turf.utils.getFeatures(['Point'], collection, min, max);
  };

  /**
   * Get polygons in collection
   * @param {object} collection GeoJSON FeatureCollection
   * @param {number} min Minimum number of expected polygons in collection
   * @param {number} max Maximum number of expected polygons in collection
   * @private
   * @return {object[]} Polygons found
   * @throws {Error} Invalid number of polygons found
   */
  ol3turf.utils.getPolygons = function(collection, min, max) {
    return ol3turf.utils.getFeatures(['Polygon'], collection, min, max);
  };

  /**
   * Get polygons and multipolygons in collection
   * @param {object} collection GeoJSON FeatureCollection
   * @param {number} min Minimum number of expected polygons in collection
   * @param {number} max Maximum number of expected polygons in collection
   * @private
   * @return {object[]} Polygons found
   * @throws {Error} Invalid number of polygons found
   */
  ol3turf.utils.getPolygonsAll = function(collection, min, max) {
    return ol3turf.utils.getFeatures(['Polygon', 'MultiPolygon'], collection, min, max);
  };

  var utils = ol3turf.utils;

  const ol3turf$1 = {
    utils,
  };


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
  function form(parent, formId, controls, attributes) {
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
    ol3turf$1.utils.extend(attributes, form);

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
      ol3turf$1.utils.extend(element.attributes, control);

      // Check if this is a selection and add pulldown options
      if (element.type === 'select') {
        control.className = 'ol3-turf-form-select';
        if (element.options !== undefined) {
          element.options.forEach(function(opt) {
            const option = document.createElement('option');
            option.innerHTML = opt.text;
            option.className = 'ol3-turf-form-option';
            ol3turf$1.utils.extend(opt.attributes, option);
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
  }

  const ol3turf$2 = {
    utils,
  };

  // popup form

  /**
   * Displays a message in a popup window.
   * @param {string} message Message to display
   * @param {function} callback Callback function when user closes popup.
   * @param {object} parent Popup parent element
   * @param {object} attributes Popup div attributes
   * @return {Element} Popup DOM element
   * @private
   */
  function display(message, callback, parent, attributes) {
    // Popup id
    const id = 'ol3-turf-popup';

    // Remove existing popup
    const currentPopup = document.getElementById(id);
    let currentParent = null;
    if (currentPopup !== null) {
      currentParent = currentPopup.parentNode;
      if (currentParent !== null) {
        currentParent.removeChild(currentPopup);
      }
    }

    // If no message then we are just closing the popup
    if (message === undefined || message === null) {
      return;
    }

    // onclose callback wrapper
    const onClick = function() {
      if (callback !== undefined && callback !== null) {
        callback();
      }
      display();
    };

    // If no parent then add to body
    let container = document.body;
    if (parent !== undefined && parent !== null) {
      container = parent;
    }

    // Create a div to contain popup
    const popup = document.createElement('div');
    popup.className = id;
    popup.id = id;
    ol3turf$2.utils.extend(attributes, popup);

    // Create a div to contain message
    const divMessage = document.createElement('div');
    divMessage.className = 'ol3-turf-popup-message';
    divMessage.innerHTML = message;

    // Create a button
    const button = document.createElement('button');
    button.className = 'ol3-turf-popup-button';
    button.innerHTML = 'OK';
    button.onclick = onClick;
    button.type = 'button';

    const divButton = document.createElement('div');
    divButton.className = 'ol3-turf-popup-button-container';
    divButton.appendChild(button);

    // Create popup
    popup.appendChild(divMessage);
    popup.appendChild(divButton);
    container.appendChild(popup);

    return popup;
  }

  const ol3turf$3 = {
    form,
    popup: display,
    utils,
  };


  /**
   * Fit left position of form within map
   * @param {object} sizeForm Form's absolute form position and size
   * @param {object} sizeMap Map's absolute form position and size
   * @param {object} sizeButton Button's absolute form position and size
   * @private
   */
  function fitFormLeft(sizeForm, sizeMap, sizeButton) {
    // Check if form is out-of-viewport to the right
    // Adjust by moving left if space is available
    const distanceToRight = sizeMap.right - (sizeForm.left + sizeForm.width);
    const distanceToLeft = sizeForm.left + distanceToRight;
    if ((distanceToRight < 0) && (distanceToLeft > 0)) {
      sizeForm.left += distanceToRight - (sizeButton.width / 2);
    }
  }

  /**
   * Fit top position of form within map
   * @param {object} sizeForm Form's absolute form position and size
   * @param {object} sizeMap Map's absolute form position and size
   * @param {object} sizeButton Button's absolute form position and size
   * @private
   */
  function fitFormTop(sizeForm, sizeMap, sizeButton) {
    // Check if form is out-of-viewport to the bottom
    // Adjust by moving up if space is available
    const distanceToBottom = sizeMap.bottom - (sizeForm.top + sizeForm.height);
    const distanceToTop = sizeForm.top + distanceToBottom;
    if ((distanceToBottom < 0) && (distanceToTop > 0)) {
      sizeForm.top += distanceToBottom - (sizeButton.height / 2);
    }
  }

  /**
   * Get absolute position and size object of element
   * @param {object} element Element of form to position
   * @return {object} Form's absolute form position and size
   * @private
   */
  function getAbsoluteRect(element) {
    const rect = element.getBoundingClientRect();

    // Compute absolute position of element
    let left = 0;
    let top = 0;
    do {
      top += element.offsetTop || 0;
      left += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);

    // Compute absolute size object
    const size = {
      bottom: top + rect.height,
      height: rect.height,
      left: left,
      right: left + rect.width,
      top: top,
      width: rect.width,
    };

    return size;
  }

  /**
   * Get absolute left position of form
   * @param {object} sizeForm Form's absolute form position and size
   * @param {object} sizeMap Map's absolute form position and size
   * @param {object} sizeToolbar Toolbar's absolute form position and size
   * @param {object} sizeButton Button's absolute form position and size
   * @return {number} Form's new left position
   * @private
   */
  function getFormLeft(sizeForm, sizeMap, sizeToolbar, sizeButton) {
    // Delta is amount to displace horizontally
    let delta = 0;

    // Toolbar is vertical so start by setting form at toolbar right
    let left = sizeToolbar.left + sizeToolbar.width;
    if ((sizeButton.left - sizeMap.left) > (0.5 * sizeMap.width)) {
      // Toolbar is near the right so move form left of the toolbar
      delta = -sizeToolbar.width +
        -sizeForm.width +
        -sizeButton.width / 2;
    } else {
      // Toolbar is near the left so move it right a bit
      delta = sizeButton.width / 2;
    }
    left += delta;

    return left;
  }

  /**
   * Get absolute top position of form
   * @param {object} sizeForm Form's absolute form position and size
   * @param {object} sizeMap Map's absolute form position and size
   * @param {object} sizeToolbar Toolbar's absolute form position and size
   * @param {object} sizeButton Button's absolute form position and size
   * @return {number} Form's new top position
   * @private
   */
  function getFormTop(sizeForm, sizeMap, sizeToolbar, sizeButton) {
    // Delta is amount to displace vertically
    let delta = 0;

    // Start by setting form at toolbar bottom
    let top = sizeToolbar.bottom;
    if ((sizeButton.top - sizeMap.top) > (0.5 * sizeMap.height)) {
      // Toolbar is near the bottom so move form above the toolbar
      delta = -sizeToolbar.height +
        -sizeForm.height +
        -sizeButton.height / 2;
    } else {
      // Toolbar is near the top so move it down a bit
      delta = sizeButton.height / 2;
    }
    top += delta;

    return top;
  }

  /**
   * Set absolute position of form
   * @param {object} sizeForm Form's absolute form position and size
   * @param {object} sizeMap Map's absolute form position and size
   * @param {object} sizeToolbar Toolbar's absolute form position and size
   * @param {object} sizeButton Button's absolute form position and size
   * @private
   */
  function setFormPosition(sizeForm, sizeMap, sizeToolbar, sizeButton) {
    if (sizeToolbar.width > sizeToolbar.height) {
      sizeForm.top = getFormTop(sizeForm, sizeMap, sizeToolbar, sizeButton);
    } else {
      sizeForm.left = getFormLeft(sizeForm, sizeMap, sizeToolbar, sizeButton);
    }
  }

  /**
   * Toolbar control base class
   * @constructor
   * @param {object} options Control button properties
   * @private
   */
  const Control = function(options) {
    const opts = options || {};

    // Define control button
    const self = this;
    this.button = document.createElement('button');
    this.button.addEventListener('click', this.run.bind(this), false);
    this.button.addEventListener('touchstart', this.run.bind(this), false);
    Object.keys(opts).forEach(function(key) {
      self.button[key] = opts[key];
    });
    this.element = document.createElement('div');
    this.element.className = 'ol3-turf-control';
    this.element.appendChild(this.button);

    // Initialize ol.control.Turf which needs to be set during creation
    this.toolbar = null;

    // Initialize form which needs to be set during creation
    this.form = null;

    // Initialize form which needs to be set during creation
    this.prefix = 'ol3-turf';
  };

  /**
   * Action performed by control.
   * @private
   * @warning This method should be implemented by derived controls.
   */
  Control.prototype.action = function() {
    throw new Error('Control action not implemented!');
  };

  /**
   * Add turf features to map
   * @param {object} features GeoJSON features to add.
   * @private
   */
  Control.prototype.addFeatures = function(features) {
    const projectionMap = this.getProjectionMap();
    const projectionTurf = this.getProjectionTurf();

    const format = new ol.format.GeoJSON();
    const layer = new ol.layer.Vector({
      source: new ol.source.Vector({
        features: format.readFeatures(features, {
          dataProjection: projectionTurf,
          featureProjection: projectionMap,
        }),
      }),
    });
    this.getMap().addLayer(layer);
  };

  /**
   * Get all features selected
   * @return {object} GeoJSON FeatureCollection
   * @private
   */
  Control.prototype.getFeatures = function() {
    const projectionMap = this.getProjectionMap();
    const projectionTurf = this.getProjectionTurf();

    const format = new ol.format.GeoJSON();

    const collection = [];
    const selectors = this.getSelectors();
    selectors.forEach(function(selector) {
      const features = selector.getFeatures();
      features.forEach(function(feature) {
        collection.push(format.writeFeatureObject(feature, {
          dataProjection: projectionTurf,
          featureProjection: projectionMap,
        }));
      });
    });
    return turf.featureCollection(collection);
  };

  /**
   * @description ol3-turf custom callback handler.
   * @typedef {object} ControlPosition
   * @memberOf ol3turf
   * @property {object} [position] Form position relative to parent map
   * @property {object} [position.top] Top position of form
   * @property {object} [position.left] Left position of form
   * @private
   */

  /**
   * Get control's form position
   * @param {object} form Element of form to position
   * @return {ol3turf.ControlPosition} Current form's form position.
   * @private
   */
  Control.prototype.getFormPosition = function(form) {
    // Get absolute position and size of elements
    const sizeButton = getAbsoluteRect(this.button);
    const sizeForm = getAbsoluteRect(form);
    const sizeMap = getAbsoluteRect(this.getMap().getTargetElement());
    const sizeToolbar = getAbsoluteRect(this.toolbar.ol3turf.element);

    // Initialize form to be at the parent button's position
    sizeForm.top = sizeButton.top;
    sizeForm.left = sizeButton.left;

    // Position the form based on whether it is horizontal or vertical
    setFormPosition(sizeForm, sizeMap, sizeToolbar, sizeButton);

    // Fit form in map viewport horizontally
    fitFormLeft(sizeForm, sizeMap, sizeButton);

    // Fit form in map viewport vertically
    fitFormTop(sizeForm, sizeMap, sizeButton);

    // Set form coordinates relative to map
    sizeForm.top -= sizeMap.top;
    sizeForm.left -= sizeMap.left;

    return {
      top: sizeForm.top,
      left: sizeForm.left,
    };
  };

  /**
   * Get parent map
   * @return {ol.Map|null} Current ol3 map
   * @private
   */
  Control.prototype.getMap = function() {
    if (this.toolbar === null) {
      return null;
    }
    const map = this.toolbar.getMap();
    return map;
  };

  /**
   * Get the projection of the ol.Map
   * @return {string} Projection code string
   * @private
   */
  Control.prototype.getProjectionMap = function() {
    let projectionMap = 'EPSG:3857';
    const projection = this.getMap().getView().getProjection();
    if (projection !== undefined) {
      projectionMap = projection.getCode();
    }
    return projectionMap;
  };

  /**
   * Get the projection of turf.js
   * @return {string} Projection code string
   * @private
   */
  Control.prototype.getProjectionTurf = function() {
    return 'EPSG:4326';
  };

  /**
   * Get all selection interactions of current map
   * @return {ol.interaction.Interaction[]} Array of map interactions
   * @private
   */
  Control.prototype.getSelectors = function() {
    const selectors = [];

    const map = this.getMap();
    if (map === null) {
      return selectors;
    }

    map.getInteractions().forEach(function(interaction) {
      if (interaction instanceof ol.interaction.Select) {
        selectors.push(interaction);
      }
    });
    return selectors;
  };

  /**
   * Run computation
   * @private
   */
  Control.prototype.run = function() {
    try {
      this.action();
    } catch (e) {
      this.showMessage(e.message);
    }
  };

  /**
   * Show form with given controls.
   * @param {object} controls Controls to display in form
   * @param {string} id Form ID
   * @private
   */
  Control.prototype.showForm = function(controls, id) {
    // Remove any existing form
    const oldiv = this.toolbar.element.parentNode;
    if (this.form !== null) {
      oldiv.removeChild(this.form);
      this.form = null;
    }

    // If no controls then we are just removing the form so return.
    if (controls === undefined) {
      return;
    }

    // Render the form but initially hide the it, then compute its size to
    // determine its position relative to toolbar
    const attributes = {
      style: {
        visibility: 'hidden',
      },
    };

    // Create new form
    if (id === undefined) {
      id = 'ol3-turf-form';
    }
    this.form = ol3turf$3.form(oldiv, id, controls, attributes);

    // Update form position and display
    const position = this.getFormPosition(this.form);
    this.form.style.left = position.left + 'px';
    this.form.style.top = position.top + 'px';
    this.form.style.visibility = 'visible';
  };

  /**
   * Show message.
   * @param {string} message Text message to display
   * @private
   */
  Control.prototype.showMessage = function(message) {
    // Create popup message and hide
    const callback = null;
    const parent = this.toolbar.ol3turf.element.parentNode;
    const attributes = {
      style: {
        visibility: 'hidden',
      },
    };
    const popup = ol3turf$3.popup(message, callback, parent, attributes);

    // Get placement and display
    const position = this.getFormPosition(popup);
    popup.style.left = position.left + 'px';
    popup.style.top = position.top + 'px';
    popup.style.visibility = 'visible';
  };

  /**
   * Create control then attach custom action and it's parent toolbar
   * @param {object} toolbar Parent toolbar
   * @param {string} prefix Selector prefix.
   * @param {string} name Name of control to create.
   * @param {string} title Tooltip text to display on control hover.
   * @param {function} action Event handler to call when control is clicked.
   *                   Will take newly created control as argument.
   * @private
   * @return {Control} Control instance.
   */
  Control.create = function(toolbar, prefix, name, title, action) {
    // Create control options
    const clsControl = ol3turf$3.utils.getName([name]);
    const clsButton = ol3turf$3.utils.getName(['control', 'button']);
    const idControl = ol3turf$3.utils.getName([name], prefix);
    const options = {
      className: clsControl + ' ' + clsButton,
      id: idControl,
      title: title,
    };

    const control = new Control(options);
    control.prefix = prefix;
    control.toolbar = toolbar;
    control.action = function() {
      return action(control);
    };
    return control;
  };

  const ol3turf$4 = {
    Control,
    utils,
  };

  // Control name
  const name = 'along';

  /*
   * Find point along line at given distance
   */
  const action = function(control) {
    // Define control ids
    const idCancel = ol3turf$4.utils.getName([name, 'cancel'], control.prefix);
    const idDistance = ol3turf$4.utils.getName([name, 'distance'], control.prefix);
    const idForm = ol3turf$4.utils.getName([name, 'form'], control.prefix);
    const idOk = ol3turf$4.utils.getName([name, 'ok'], control.prefix);
    const idUnits = ol3turf$4.utils.getName([name, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather line seleted
        const collection = ol3turf$4.utils.getCollection(control, 1, 1);
        const lines = ol3turf$4.utils.getLines(collection, 1, 1);
        const line = lines[0];

        // Gather form inputs
        const distance = ol3turf$4.utils.getFormNumber(idDistance, 'distance');
        const units = ol3turf$4.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const output = turf.along(line, distance, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          line: line,
          distance: distance,
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
      ol3turf$4.utils.getControlNumber(idDistance,
          'Distance', 'Distance along the line', '0', 'any', '0'),
      ol3turf$4.utils.getControlSelect(idUnits,
          'Units', ol3turf$4.utils.getOptionsUnits()),
      ol3turf$4.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$4.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var along = {
    create: function(toolbar, prefix) {
      const title = 'Find point along line at given distance';
      return ol3turf$4.Control.create(toolbar, prefix, name, title, action);
    },
  };

  const ol3turf$5 = {
    Control,
    utils,
  };

  // Control name
  const name$1 = 'area';

  /*
   * Compute area
   */
  const action$1 = function(control) {
    const collection = ol3turf$5.utils.getCollection(control, 1, Infinity);
    const output = turf.area(collection);
    const inputs = {
      input: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$1, output, inputs);
  };

  var area = {
    create: function(toolbar, prefix) {
      const title = 'Measure Area';
      return ol3turf$5.Control.create(toolbar, prefix, name$1, title, action$1);
    },
  };

  const ol3turf$6 = {
    Control,
    utils,
  };

  // Control name
  const name$2 = 'bearing';

  /*
   * Compute bearing between two points
   */
  const action$2 = function(control) {
    // Gather points seleted
    const collection = ol3turf$6.utils.getCollection(control, 2, 2);
    const points = ol3turf$6.utils.getPoints(collection, 2, 2);
    const start = points[0];
    const end = points[1];
    const output = turf.bearing(start, end);
    const inputs = {
      start: start,
      end: end,
    };
    control.toolbar.ol3turf.handler.callback(name$2, output, inputs);
  };

  var bearing = {
    create: function(toolbar, prefix) {
      const title = 'Measure Bearing';
      return ol3turf$6.Control.create(toolbar, prefix, name$2, title, action$2);
    },
  };

  const ol3turf$7 = {
    Control,
    utils,
  };

  // Control name
  const name$3 = 'bezier';

  /*
   * Create bezier curve of line
   */
  const action$3 = function(control) {
    // Define control ids
    const idCancel = ol3turf$7.utils.getName([name$3, 'cancel'], control.prefix);
    const idForm = ol3turf$7.utils.getName([name$3, 'form'], control.prefix);
    const idOk = ol3turf$7.utils.getName([name$3, 'ok'], control.prefix);
    const idResolution = ol3turf$7.utils.getName([name$3, 'resolution'],
        control.prefix);
    const idSharpness = ol3turf$7.utils.getName([name$3, 'sharpness'],
        control.prefix);

    const onOK = function() {
      try {
        // Gather line seleted
        const collection = ol3turf$7.utils.getCollection(control, 1, 1);
        const lines = ol3turf$7.utils.getLines(collection, 1, 1);
        const line = lines[0];

        // Gather form inputs
        const resolution = ol3turf$7.utils.getFormNumber(idResolution,
            'resolution');
        const sharpness = ol3turf$7.utils.getFormNumber(idSharpness, 'sharpness');

        // Create bezier curve
        const output = turf.bezier(line, resolution, sharpness);

        // Remove form and display results
        control.showForm();
        const inputs = {
          line: line,
          resolution: resolution,
          sharpness: sharpness,
        };
        control.toolbar.ol3turf.handler.callback(name$3, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$7.utils.getControlNumber(idResolution, 'Resolution',
          'Time between points (milliseconds)', '10000', 'any', '0'),
      ol3turf$7.utils.getControlNumber(idSharpness, 'Sharpness',
          'Measure of how curvy the path should be between splines', '0.85',
          '0.01', '0', '1'),
      ol3turf$7.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$7.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var bezier = {
    create: function(toolbar, prefix) {
      const title = 'Create bezier curve of line';
      return ol3turf$7.Control.create(toolbar, prefix, name$3, title, action$3);
    },
  };

  const ol3turf$8 = {
    Control,
    utils,
  };

  // Control name
  const name$4 = 'buffer';

  /*
   * Buffer feature by given radius
   */
  const action$4 = function(control) {
    // Define control ids
    const idCancel = ol3turf$8.utils.getName([name$4, 'cancel'], control.prefix);
    const idDistance = ol3turf$8.utils.getName([name$4, 'distance'], control.prefix);
    const idForm = ol3turf$8.utils.getName([name$4, 'form'], control.prefix);
    const idOk = ol3turf$8.utils.getName([name$4, 'ok'], control.prefix);
    const idUnits = ol3turf$8.utils.getName([name$4, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$8.utils.getCollection(control, 1, Infinity);

        // Gather form inputs
        const distance = ol3turf$8.utils.getFormNumber(idDistance, 'distance');
        const units = ol3turf$8.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const output = turf.buffer(collection, distance, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          feature: collection,
          distance: distance,
          unit: units,
        };
        control.toolbar.ol3turf.handler.callback(name$4, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$8.utils.getControlNumber(idDistance, 'Distance',
          'Distance to draw the buffer', '0', 'any', '0'),
      ol3turf$8.utils.getControlSelect(idUnits, 'Units',
          ol3turf$8.utils.getOptionsUnits()),
      ol3turf$8.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$8.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var buffer = {
    create: function(toolbar, prefix) {
      const title = 'Buffer feature by given radius';
      return ol3turf$8.Control.create(toolbar, prefix, name$4, title, action$4);
    },
  };

  const ol3turf$9 = {
    Control,
    utils,
  };

  // Control name
  const name$5 = 'center';

  /*
   * Compute center
   */
  const action$5 = function(control) {
    const collection = ol3turf$9.utils.getCollection(control, 1, Infinity);
    const output = turf.center(collection);
    const inputs = {
      features: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$5, output, inputs);
  };

  var center = {
    create: function(toolbar, prefix) {
      const title = 'Measure Center';
      return ol3turf$9.Control.create(toolbar, prefix, name$5, title, action$5);
    },
  };

  const ol3turf$a = {
    Control,
    utils,
  };

  // Control name
  const name$6 = 'center-of-mass';

  /*
   * Compute center-of-mass
   */
  const action$6 = function(control) {
    const collection = ol3turf$a.utils.getCollection(control, 1, Infinity);
    const output = turf.centerOfMass(collection);
    const inputs = {
      features: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$6, output, inputs);
  };

  var centerOfMass = {
    create: function(toolbar, prefix) {
      const title = 'Measure center of mass';
      return ol3turf$a.Control.create(toolbar, prefix, name$6, title, action$6);
    },
  };

  const ol3turf$b = {
    Control,
    utils,
  };

  // Control name
  const name$7 = 'centroid';

  /*
   * Compute centroid
   */
  const action$7 = function(control) {
    const collection = ol3turf$b.utils.getCollection(control, 1, Infinity);
    const output = turf.centroid(collection);
    const inputs = {
      features: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$7, output, inputs);
  };

  var centroid = {
    create: function(toolbar, prefix) {
      const title = 'Measure Centroid';
      return ol3turf$b.Control.create(toolbar, prefix, name$7, title, action$7);
    },
  };

  const ol3turf$c = {
    Control,
    utils,
  };

  // Control name
  const name$8 = 'circle';

  /*
   * Create circle
   */
  const action$8 = function(control) {
    // Define control ids
    const idCancel = ol3turf$c.utils.getName([name$8, 'cancel'], control.prefix);
    const idForm = ol3turf$c.utils.getName([name$8, 'form'], control.prefix);
    const idOk = ol3turf$c.utils.getName([name$8, 'ok'], control.prefix);
    const idRadius = ol3turf$c.utils.getName([name$8, 'radius'], control.prefix);
    const idSteps = ol3turf$c.utils.getName([name$8, 'steps'], control.prefix);
    const idUnits = ol3turf$c.utils.getName([name$8, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather center point
        const collection = ol3turf$c.utils.getCollection(control, 1, 1);
        const points = ol3turf$c.utils.getPoints(collection, 1, 1);
        const center = points[0];

        // Gather form inputs
        const radius = ol3turf$c.utils.getFormNumber(idRadius, 'radius');
        const steps = ol3turf$c.utils.getFormNumber(idSteps, 'steps');
        const units = ol3turf$c.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const output = turf.circle(center, radius, steps, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          center: center,
          radius: radius,
          steps: steps,
          units: units,
        };
        control.toolbar.ol3turf.handler.callback(name$8, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$c.utils.getControlNumber(idRadius, 'Radius', 'Radius of the circle',
          '0', 'any', '0'),
      ol3turf$c.utils.getControlNumber(idSteps, 'Steps',
          'Number of steps around circle', '3', '1', '3'),
      ol3turf$c.utils.getControlSelect(idUnits, 'Units',
          ol3turf$c.utils.getOptionsUnits()),
      ol3turf$c.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$c.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var circle = {
    create: function(toolbar, prefix) {
      const title = 'Create circle';
      return ol3turf$c.Control.create(toolbar, prefix, name$8, title, action$8);
    },
  };

  const ol3turf$d = {
    Control,
    utils,
  };


  // Control name
  const name$9 = 'collect';

  /*
   * Collect point attributes within polygon
   */
  const action$9 = function(control) {
    // Define control ids
    const idCancel = ol3turf$d.utils.getName([name$9, 'cancel'], control.prefix);
    const idForm = ol3turf$d.utils.getName([name$9, 'form'], control.prefix);
    const idIn = ol3turf$d.utils.getName([name$9, 'in', 'property'], control.prefix);
    const idOk = ol3turf$d.utils.getName([name$9, 'ok'], control.prefix);
    const idOut = ol3turf$d.utils.getName([name$9, 'out', 'property'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected points and polygons
        const collection = ol3turf$d.utils.getCollection(control, 2, Infinity);
        const points = ol3turf$d.utils.getPoints(collection, 1, collection.features.length - 1);
        const numPolygons = collection.features.length - points.length;
        const polygons = ol3turf$d.utils.getPolygons(collection, numPolygons, numPolygons);

        // Gather form inputs
        const inProperty = ol3turf$d.utils.getFormString(idIn, 'In-Property');
        const outProperty = ol3turf$d.utils.getFormString(idOut, 'Out-Property');

        // Collect polygons
        const inPolygons = turf.featureCollection(polygons);
        const inPoints = turf.featureCollection(points);
        const output = turf.collect(inPolygons,
            inPoints,
            inProperty,
            outProperty);

        // Remove form and display results
        control.showForm();
        const inputs = {
          polygons: inPolygons,
          points: inPoints,
          inProperty: inProperty,
          outProperty: outProperty,
        };
        control.toolbar.ol3turf.handler.callback(name$9, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$d.utils.getControlText(idIn, 'In Property', 'Property to be nested from'),
      ol3turf$d.utils.getControlText(idOut, 'Out Property', 'Property to be nested into'),
      ol3turf$d.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$d.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var collect = {
    create: function(toolbar, prefix) {
      const title = 'Collect points within polygons';
      return ol3turf$d.Control.create(toolbar, prefix, name$9, title, action$9);
    },
  };

  const ol3turf$e = {
    Control,
    utils,
  };


  // Control name
  const name$a = 'combine';

  /*
   * Compute combine of feature collection
   */
  const action$a = function(control) {
    const collection = ol3turf$e.utils.getCollection(control, 1, Infinity);

    const output = turf.combine(collection);
    const inputs = {
      fc: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$a, output, inputs);
  };

  var combine = {
    create: function(toolbar, prefix) {
      const title = 'Combine feature collection';
      return ol3turf$e.Control.create(toolbar, prefix, name$a, title, action$a);
    },
  };

  const ol3turf$f = {
    Control,
    utils,
  };


  // Control name
  const name$b = 'concave';

  /*
   * Buffer feature by given radius
   */
  const action$b = function(control) {
    // Define control ids
    const idCancel = ol3turf$f.utils.getName([name$b, 'cancel'], control.prefix);
    const idForm = ol3turf$f.utils.getName([name$b, 'form'], control.prefix);
    const idMaxEdge = ol3turf$f.utils.getName([name$b, 'max', 'edge'], control.prefix);
    const idOk = ol3turf$f.utils.getName([name$b, 'ok'], control.prefix);
    const idUnits = ol3turf$f.utils.getName([name$b, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$f.utils.getCollection(control, 3, Infinity);
        const numPoints = collection.features.length;
        const pts = ol3turf$f.utils.getPoints(collection, numPoints, numPoints);

        // Gather form inputs
        const maxEdge = ol3turf$f.utils.getFormNumber(idMaxEdge, 'Max Edge');
        const units = ol3turf$f.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const points = turf.featureCollection(pts);
        const output = turf.concave(points, maxEdge, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          points: points,
          maxEdge: maxEdge,
          units: units,
        };
        control.toolbar.ol3turf.handler.callback(name$b, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$f.utils.getControlNumber(idMaxEdge, 'Max Edge Size', 'Maximum size of an edge necessary for part of the hull to become concave', '0', 'any', '0'),
      ol3turf$f.utils.getControlSelect(idUnits, 'Units', ol3turf$f.utils.getOptionsUnits()),
      ol3turf$f.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$f.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var concave = {
    create: function(toolbar, prefix) {
      const title = 'Create Concave Hull';
      return ol3turf$f.Control.create(toolbar, prefix, name$b, title, action$b);
    },
  };

  const ol3turf$g = {
    Control,
    utils,
  };


  // Control name
  const name$c = 'convex';

  /*
   * Compute convex hull
   */
  const action$c = function(control) {
    const collection = ol3turf$g.utils.getCollection(control, 1, Infinity);

    const output = turf.convex(collection);
    const inputs = {
      featurecollection: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$c, output, inputs);
  };

  var convex = {
    create: function(toolbar, prefix) {
      const title = 'Create Convex Hull';
      return ol3turf$g.Control.create(toolbar, prefix, name$c, title, action$c);
    },
  };

  const ol3turf$h = {
    Control,
    utils,
  };


  // Control name
  const name$d = 'destination';

  /*
   * Find destination point from given point
   */
  const action$d = function(control) {
    // Define control ids
    const idBearing = ol3turf$h.utils.getName([name$d, 'bearing'], control.prefix);
    const idCancel = ol3turf$h.utils.getName([name$d, 'cancel'], control.prefix);
    const idDistance = ol3turf$h.utils.getName([name$d, 'distance'], control.prefix);
    const idForm = ol3turf$h.utils.getName([name$d, 'form'], control.prefix);
    const idOk = ol3turf$h.utils.getName([name$d, 'ok'], control.prefix);
    const idUnits = ol3turf$h.utils.getName([name$d, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather point seleted
        const collection = ol3turf$h.utils.getCollection(control, 1, 1);
        const points = ol3turf$h.utils.getPoints(collection, 1, 1);
        const point = points[0];

        // Gather form inputs
        const distance = ol3turf$h.utils.getFormNumber(idDistance, 'distance');
        const bearing = ol3turf$h.utils.getFormNumber(idBearing, 'bearing');
        const units = ol3turf$h.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const output = turf.destination(point,
            distance,
            bearing,
            units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          from: point,
          distance: distance,
          bearing: bearing,
          units: units,
        };
        control.toolbar.ol3turf.handler.callback(name$d, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$h.utils.getControlNumber(idBearing, 'Bearing', 'Bearing angle (degrees)', '0', 'any', '-180', '180'),
      ol3turf$h.utils.getControlNumber(idDistance, 'Distance', 'Distance from the starting point', '0', 'any', '0'),
      ol3turf$h.utils.getControlSelect(idUnits, 'Units', ol3turf$h.utils.getOptionsUnits()),
      ol3turf$h.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$h.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var destination = {
    create: function(toolbar, prefix) {
      const title = 'Find destination point from given point';
      return ol3turf$h.Control.create(toolbar, prefix, name$d, title, action$d);
    },
  };

  const ol3turf$i = {
    Control,
    utils,
  };


  // Control name
  const name$e = 'difference';

  /*
   * Compute difference between two polygons
   */
  const action$e = function(control) {
    const collection = ol3turf$i.utils.getCollection(control, 2, 2);
    const polygons = ol3turf$i.utils.getPolygons(collection, 2, 2);
    const poly1 = polygons[0];
    const poly2 = polygons[1];
    const output = turf.difference(poly1, poly2);
    const inputs = {
      poly1: poly1,
      poly2: poly2,
    };
    control.toolbar.ol3turf.handler.callback(name$e, output, inputs);
  };

  var difference = {
    create: function(toolbar, prefix) {
      const title = 'Create Difference Polygon';
      return ol3turf$i.Control.create(toolbar, prefix, name$e, title, action$e);
    },
  };

  const ol3turf$j = {
    Control,
    utils,
  };


  // Control name
  const name$f = 'distance';

  /*
   * Find distance between points
   */
  const action$f = function(control) {
    // Define control ids
    const idCancel = ol3turf$j.utils.getName([name$f, 'cancel'], control.prefix);
    const idForm = ol3turf$j.utils.getName([name$f, 'form'], control.prefix);
    const idOk = ol3turf$j.utils.getName([name$f, 'ok'], control.prefix);
    const idUnits = ol3turf$j.utils.getName([name$f, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather points seleted
        const collection = ol3turf$j.utils.getCollection(control, 2, 2);
        const points = ol3turf$j.utils.getPoints(collection, 2, 2);
        const from = points[0];
        const to = points[1];

        // Gather form inputs
        const units = ol3turf$j.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const output = turf.distance(from, to, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          from: from,
          to: to,
          units: units,
        };
        control.toolbar.ol3turf.handler.callback(name$f, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$j.utils.getControlSelect(idUnits, 'Units', ol3turf$j.utils.getOptionsUnits()),
      ol3turf$j.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$j.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var distance = {
    create: function(toolbar, prefix) {
      const title = 'Find distance between points';
      return ol3turf$j.Control.create(toolbar, prefix, name$f, title, action$f);
    },
  };

  const ol3turf$k = {
    Control,
    utils,
  };


  // Control name
  const name$g = 'envelope';

  /*
   * Compute envelope
   */
  const action$g = function(control) {
    const collection = ol3turf$k.utils.getCollection(control, 1, Infinity);

    const output = turf.envelope(collection);
    const inputs = {
      fc: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$g, output, inputs);
  };

  var envelope = {
    create: function(toolbar, prefix) {
      const title = 'Measure Envelope';
      return ol3turf$k.Control.create(toolbar, prefix, name$g, title, action$g);
    },
  };

  const ol3turf$l = {
    Control,
    utils,
  };


  // Control name
  const name$h = 'explode';

  /*
   * Compute explode of feature collection
   */
  const action$h = function(control) {
    const collection = ol3turf$l.utils.getCollection(control, 1, Infinity);

    const output = turf.explode(collection);
    const inputs = {
      geojson: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$h, output, inputs);
  };

  var explode = {
    create: function(toolbar, prefix) {
      const title = 'Explode feature collection';
      return ol3turf$l.Control.create(toolbar, prefix, name$h, title, action$h);
    },
  };

  const ol3turf$m = {
    Control,
    utils,
  };


  // Control name
  const name$i = 'flip';

  /*
   * Compute feature coordinate flip
   */
  const action$i = function(control) {
    const collection = ol3turf$m.utils.getCollection(control, 1, Infinity);

    const output = turf.flip(collection);
    const inputs = {
      input: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$i, output, inputs);
  };

  var flip = {
    create: function(toolbar, prefix) {
      const title = 'Flip features coordinates';
      return ol3turf$m.Control.create(toolbar, prefix, name$i, title, action$i);
    },
  };

  const ol3turf$n = {
    Control,
    utils,
  };


  // Control name
  const name$j = 'hex-grid';

  /*
   * Generate Hex Grid
   */
  const action$j = function(control) {
    // Define control ids
    const idCancel = ol3turf$n.utils.getName([name$j, 'cancel'], control.prefix);
    const idCellSize = ol3turf$n.utils.getName([name$j, 'cell-size'], control.prefix);
    const idForm = ol3turf$n.utils.getName([name$j, 'form'], control.prefix);
    const idType = ol3turf$n.utils.getName([name$j, 'type'], control.prefix);
    const idOk = ol3turf$n.utils.getName([name$j, 'ok'], control.prefix);
    const idUnits = ol3turf$n.utils.getName([name$j, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$n.utils.getCollection(control, 1, Infinity);

        // Gather form inputs
        const cellSize = ol3turf$n.utils.getFormNumber(idCellSize, 'cell size');
        const type = ol3turf$n.utils.getFormString(idType, 'grid type');
        const units = ol3turf$n.utils.getFormString(idUnits, 'units');
        const isTriangles = (type === 'triangles');

        // Collect polygons
        const bbox = turf.bbox(collection);
        const output = turf.hexGrid(bbox, cellSize, units, isTriangles);

        // Remove form and display results
        control.showForm();
        const inputs = {
          bbox: bbox,
          cellSize: cellSize,
          units: units,
          triangles: isTriangles,
        };
        control.toolbar.ol3turf.handler.callback(name$j, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$n.utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1', 'any', '0'),
      ol3turf$n.utils.getControlSelect(idUnits, 'Units', ol3turf$n.utils.getOptionsUnits()),
      ol3turf$n.utils.getControlSelect(idType, 'Type', ol3turf$n.utils.getOptionsGrids()),
      ol3turf$n.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$n.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var hexGrid = {
    create: function(toolbar, prefix) {
      const title = 'Generate Hex Grid';
      return ol3turf$n.Control.create(toolbar, prefix, name$j, title, action$j);
    },
  };

  const ol3turf$o = {
    Control,
    utils,
  };


  // Control name
  const name$k = 'inside';

  /*
   * Compute if point is inside polygon
   */
  const action$k = function(control) {
    // Gather point and polygon selected
    const collection = ol3turf$o.utils.getCollection(control, 2, 2);
    const points = ol3turf$o.utils.getPoints(collection, 1, 1);
    const polygons = ol3turf$o.utils.getPolygonsAll(collection, 1, 1);
    const point = points[0];
    const polygon = polygons[0];

    const output = turf.inside(point, polygon);
    const inputs = {
      point: point,
      polygon: polygon,
    };
    control.toolbar.ol3turf.handler.callback(name$k, output, inputs);
  };

  var inside = {
    create: function(toolbar, prefix) {
      const title = 'Point inside polygon?';
      return ol3turf$o.Control.create(toolbar, prefix, name$k, title, action$k);
    },
  };

  const ol3turf$p = {
    Control,
    utils,
  };


  // Control name
  const name$l = 'intersect';

  /*
   * Compute intersection of two polygons
   */
  const action$l = function(control) {
    const collection = ol3turf$p.utils.getCollection(control, 2, 2);
    const polygons = ol3turf$p.utils.getPolygonsAll(collection, 2, 2);

    const poly1 = polygons[0];
    const poly2 = polygons[1];
    const output = turf.intersect(poly1, poly2);
    const inputs = {
      poly1: poly1,
      poly2: poly2,
    };
    control.toolbar.ol3turf.handler.callback(name$l, output, inputs);
  };

  var intersect = {
    create: function(toolbar, prefix) {
      const title = 'Create Intersection Polygon';
      return ol3turf$p.Control.create(toolbar, prefix, name$l, title, action$l);
    },
  };

  const ol3turf$q = {
    Control,
    utils,
  };


  // Control name
  const name$m = 'isolines';

  /*
   * Create isolines
   */
  const action$m = function(control) {
    // Define control ids
    const idBreaks = ol3turf$q.utils.getName([name$m, 'breaks'], control.prefix);
    const idCancel = ol3turf$q.utils.getName([name$m, 'cancel'], control.prefix);
    const idForm = ol3turf$q.utils.getName([name$m, 'form'], control.prefix);
    const idOk = ol3turf$q.utils.getName([name$m, 'ok'], control.prefix);
    const idResolution = ol3turf$q.utils.getName([name$m, 'resolution'], control.prefix);
    const idZ = ol3turf$q.utils.getName([name$m, 'z'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$q.utils.getCollection(control, 1, Infinity);

        // Gather form inputs
        const breaks = ol3turf$q.utils.getFormArray(idBreaks, 'breaks');
        const resolution = ol3turf$q.utils.getFormNumber(idResolution, 'resolution');
        const z = ol3turf$q.utils.getFormString(idZ, 'z');

        // Generate isolines features
        const output = turf.isolines(collection, z, resolution, breaks);

        // Remove form and display results
        control.showForm();
        const inputs = {
          points: collection,
          z: z,
          resolution: resolution,
          breaks: breaks,
        };
        control.toolbar.ol3turf.handler.callback(name$m, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$q.utils.getControlNumber(idResolution, 'Resolution', 'Resolution of the underlying grid', '1', 'any', '0.01'),
      ol3turf$q.utils.getControlText(idZ, 'Z Property', 'Property name in points from which z-values will be pulled'),
      ol3turf$q.utils.getControlText(idBreaks, 'Breaks', 'Comma separated list of where to draw contours'),
      ol3turf$q.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$q.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var isolines = {
    create: function(toolbar, prefix) {
      const title = 'Create isolines';
      return ol3turf$q.Control.create(toolbar, prefix, name$m, title, action$m);
    },
  };

  const ol3turf$r = {
    Control,
    utils,
  };


  // Control name
  const name$n = 'kinks';

  /*
   * Compute polygon kinks
   */
  const action$n = function(control) {
    const collection = ol3turf$r.utils.getCollection(control, 1, 1);
    const polygons = ol3turf$r.utils.getPolygons(collection, 1, 1);
    const polygon = polygons[0];
    const output = turf.kinks(polygon);
    if (output.features.length === 0) {
      throw new Error('No kinks found.');
    }
    const inputs = {
      polygon: polygon,
    };
    control.toolbar.ol3turf.handler.callback(name$n, output, inputs);
  };

  var kinks = {
    create: function(toolbar, prefix) {
      const title = 'Create polygon self-intersections';
      return ol3turf$r.Control.create(toolbar, prefix, name$n, title, action$n);
    },
  };

  const ol3turf$s = {
    Control,
    utils,
  };


  // Control name
  const name$o = 'line-distance';

  /*
   * Compute length of feature
   */
  const action$o = function(control) {
    // Define control ids
    const idCancel = ol3turf$s.utils.getName([name$o, 'cancel'], control.prefix);
    const idForm = ol3turf$s.utils.getName([name$o, 'form'], control.prefix);
    const idOk = ol3turf$s.utils.getName([name$o, 'ok'], control.prefix);
    const idUnits = ol3turf$s.utils.getName([name$o, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$s.utils.getCollection(control, 1, Infinity);

        // Gather form inputs
        const units = ol3turf$s.utils.getFormString(idUnits, 'units');

        // Compute length
        const output = turf.lineDistance(collection, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          line: collection,
          units: units,
        };
        control.toolbar.ol3turf.handler.callback(name$o, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$s.utils.getControlSelect(idUnits, 'Units', ol3turf$s.utils.getOptionsUnits()),
      ol3turf$s.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$s.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var lineDistance = {
    create: function(toolbar, prefix) {
      const title = 'Measure Length';
      return ol3turf$s.Control.create(toolbar, prefix, name$o, title, action$o);
    },
  };

  const ol3turf$t = {
    Control,
    utils,
  };


  // Control name
  const name$p = 'line-slice-along';

  /*
   * Compute line slice
   */
  const action$p = function(control) {
    // Define control ids
    const idCancel = ol3turf$t.utils.getName([name$p, 'cancel'], control.prefix);
    const idForm = ol3turf$t.utils.getName([name$p, 'form'], control.prefix);
    const idOk = ol3turf$t.utils.getName([name$p, 'ok'], control.prefix);
    const idStart = ol3turf$t.utils.getName([name$p, 'start'], control.prefix);
    const idStop = ol3turf$t.utils.getName([name$p, 'stop'], control.prefix);
    const idUnits = ol3turf$t.utils.getName([name$p, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather line seleted
        const collection = ol3turf$t.utils.getCollection(control, 1, 1);
        const lines = ol3turf$t.utils.getLines(collection, 1, 1);
        const line = lines[0];

        // Gather form inputs
        const start = ol3turf$t.utils.getFormNumber(idStart, 'start');
        const stop = ol3turf$t.utils.getFormNumber(idStop, 'stop');

        const isOrdered = (start < stop);
        if (isOrdered !== true) {
          throw new Error('Start must be less than stop');
        }

        // Truncate at line length otherwise lineSliceAlong fails
        const units = ol3turf$t.utils.getFormString(idUnits, 'units');
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
        control.toolbar.ol3turf.handler.callback(name$p, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$t.utils.getControlNumber(idStart, 'Start', 'Starting distance along the line', '0', 'any', '0'),
      ol3turf$t.utils.getControlNumber(idStop, 'Stop', 'Stoping distance along the line', '0', 'any', '0'),
      ol3turf$t.utils.getControlSelect(idUnits, 'Units', ol3turf$t.utils.getOptionsUnits()),
      ol3turf$t.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$t.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var lineSliceAlong = {
    create: function(toolbar, prefix) {
      const title = 'Create line slice';
      return ol3turf$t.Control.create(toolbar, prefix, name$p, title, action$p);
    },
  };

  const ol3turf$u = {
    Control,
    utils,
  };


  // Control name
  const name$q = 'midpoint';

  /*
   * Compute midpoint
   */
  const action$q = function(control) {
    const collection = ol3turf$u.utils.getCollection(control, 2, 2);
    const points = ol3turf$u.utils.getPoints(collection, 2, 2);
    const from = points[0];
    const to = points[1];
    const output = turf.midpoint(from, to);
    const inputs = {
      from: from,
      to: to,
    };
    control.toolbar.ol3turf.handler.callback(name$q, output, inputs);
  };

  var midpoint = {
    create: function(toolbar, prefix) {
      const title = 'Measure Midpoint';
      return ol3turf$u.Control.create(toolbar, prefix, name$q, title, action$q);
    },
  };

  const ol3turf$v = {
    Control,
    utils,
  };


  // Control name
  const name$r = 'nearest';

  /*
   * Compute nearest point
   */
  const action$r = function(control) {
    const collection = ol3turf$v.utils.getCollection(control, 2, Infinity);
    const numPoints = collection.features.length;
    const pts = ol3turf$v.utils.getPoints(collection, numPoints, numPoints);
    const targetPoint = pts[0];
    const points = turf.featureCollection(pts.slice(1));

    const output = turf.nearest(targetPoint, points);
    const inputs = {
      targetPoint: targetPoint,
      points: points,
    };
    control.toolbar.ol3turf.handler.callback(name$r, output, inputs);
  };

  var nearest = {
    create: function(toolbar, prefix) {
      const title = 'Find set point nearest to first point';
      return ol3turf$v.Control.create(toolbar, prefix, name$r, title, action$r);
    },
  };

  const ol3turf$w = {
    Control,
    utils,
  };


  // Control name
  const name$s = 'planepoint';

  /*
   * Triangulate a point in a plane
   */
  const action$s = function(control) {
    const collection = ol3turf$w.utils.getCollection(control, 2, 2);
    const pt = ol3turf$w.utils.getPoints(collection, 1, 1);
    const tr = ol3turf$w.utils.getPolygons(collection, 1, 1);
    const point = pt[0];
    const triangle = tr[0];

    const output = turf.planepoint(point, triangle);
    const inputs = {
      point: point,
      triangle: triangle,
    };
    control.toolbar.ol3turf.handler.callback(name$s, output, inputs);
  };

  var planepoint = {
    create: function(toolbar, prefix) {
      const title = 'Triangulate a point in a plane';
      return ol3turf$w.Control.create(toolbar, prefix, name$s, title, action$s);
    },
  };

  const ol3turf$x = {
    Control,
    utils,
  };


  // Control name
  const name$t = 'point-grid';

  /*
   * Generate Point Grid
   */
  const action$t = function(control) {
    // Define control ids
    const idCancel = ol3turf$x.utils.getName([name$t, 'cancel'], control.prefix);
    const idCellSize = ol3turf$x.utils.getName([name$t, 'cell-size'], control.prefix);
    const idForm = ol3turf$x.utils.getName([name$t, 'form'], control.prefix);
    const idOk = ol3turf$x.utils.getName([name$t, 'ok'], control.prefix);
    const idUnits = ol3turf$x.utils.getName([name$t, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$x.utils.getCollection(control, 1, Infinity);

        // Gather form inputs
        const cellSize = ol3turf$x.utils.getFormNumber(idCellSize, 'cell size');
        const units = ol3turf$x.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const bbox = turf.bbox(collection);
        const output = turf.pointGrid(bbox, cellSize, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          bbox: bbox,
          cellSize: cellSize,
          units: units,
        };
        control.toolbar.ol3turf.handler.callback(name$t, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$x.utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1', 'any', '0'),
      ol3turf$x.utils.getControlSelect(idUnits, 'Units', ol3turf$x.utils.getOptionsUnits()),
      ol3turf$x.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$x.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var pointGrid = {
    create: function(toolbar, prefix) {
      const title = 'Generate Point Grid';
      return ol3turf$x.Control.create(toolbar, prefix, name$t, title, action$t);
    },
  };

  const ol3turf$y = {
    Control,
    utils,
  };


  // Control name
  const name$u = 'point-on-line';

  /*
   * Compute point on line
   */
  const action$u = function(control) {
    const collection = ol3turf$y.utils.getCollection(control, 2, 2);
    const points = ol3turf$y.utils.getPoints(collection, 1, 1);
    const lines = ol3turf$y.utils.getLines(collection, 1, 1);
    const line = lines[0];
    const point = points[0];

    const output = turf.pointOnLine(line, point);
    const inputs = {
      line: line,
      point: point,
    };
    control.toolbar.ol3turf.handler.callback(name$u, output, inputs);
  };

  var pointOnLine = {
    create: function(toolbar, prefix) {
      const title = 'Project point on line';
      return ol3turf$y.Control.create(toolbar, prefix, name$u, title, action$u);
    },
  };

  const ol3turf$z = {
    Control,
    utils,
  };


  // Control name
  const name$v = 'point-on-surface';

  /*
   * Compute pointOnSurface
   */
  const action$v = function(control) {
    const collection = ol3turf$z.utils.getCollection(control, 1, Infinity);

    const output = turf.pointOnSurface(collection);
    const inputs = {
      fc: collection,
    };
    control.toolbar.ol3turf.handler.callback(name$v, output, inputs);
  };

  var pointOnSurface = {
    create: function(toolbar, prefix) {
      const title = 'Measure Point on Surface';
      return ol3turf$z.Control.create(toolbar, prefix, name$v, title, action$v);
    },
  };

  const ol3turf$A = {
    Control,
    utils,
  };


  // Control name
  const name$w = 'random';

  /*
   * Create random data
   */
  const action$w = function(control) {
    // Define control ids
    const idCancel = ol3turf$A.utils.getName([name$w, 'cancel'], control.prefix);
    const idCount = ol3turf$A.utils.getName([name$w, 'count'], control.prefix);
    const idForm = ol3turf$A.utils.getName([name$w, 'form'], control.prefix);
    const idMaxRadialLength = ol3turf$A.utils.getName([name$w, 'max-radial-length'], control.prefix);
    const idNumVertices = ol3turf$A.utils.getName([name$w, 'num-vertices'], control.prefix);
    const idOk = ol3turf$A.utils.getName([name$w, 'ok'], control.prefix);
    const idType = ol3turf$A.utils.getName([name$w, 'type'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        let bbox = null;
        const collection = ol3turf$A.utils.getCollection(control, 0, Infinity);
        if (collection.features.length !== 0) {
          bbox = turf.bbox(collection);
        }

        // Get form inputs
        const count = ol3turf$A.utils.getFormInteger(idCount, 'count');
        const maxRadialLength = ol3turf$A.utils.getFormInteger(idMaxRadialLength, 'maximum radial length');
        const numVertices = ol3turf$A.utils.getFormInteger(idNumVertices, 'number of vertices');
        const type = ol3turf$A.utils.getFormString(idType, 'type');

        // Generate random polygons
        const options = {
          max_radial_length: maxRadialLength,
          num_vertices: numVertices,
        };
        if (bbox !== null) {
          options.bbox = bbox;
        }
        const output = turf.random(type, count, options);

        // Remove form and display results
        control.showForm();
        const inputs = {
          type: type,
          count: count,
          options: options,
        };
        control.toolbar.ol3turf.handler.callback(name$w, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$A.utils.getControlSelect(idType, 'Type', ol3turf$A.utils.getOptionsGeometry()),
      ol3turf$A.utils.getControlNumber(idCount, 'Count', 'How many geometries should be generated', '1', '1', '1'),
      ol3turf$A.utils.getControlNumber(idNumVertices, '# Vertices', 'Used only for polygon type', '10', '1', '3'),
      ol3turf$A.utils.getControlNumber(idMaxRadialLength, 'Max Length', 'Maximum degrees a polygon can extent outwards from its center (degrees)', '10', '0.01', '0', '180'),
      ol3turf$A.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$A.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var random = {
    create: function(toolbar, prefix) {
      const title = 'Create random data';
      return ol3turf$A.Control.create(toolbar, prefix, name$w, title, action$w);
    },
  };

  const ol3turf$B = {
    Control,
    utils,
  };


  // Control name
  const name$x = 'sample';

  /*
   * Randomly sample features
   */
  const action$x = function(control) {
    // Define control ids
    const idCancel = ol3turf$B.utils.getName([name$x, 'cancel'], control.prefix);
    const idCount = ol3turf$B.utils.getName([name$x, 'count'], control.prefix);
    const idForm = ol3turf$B.utils.getName([name$x, 'form'], control.prefix);
    const idOk = ol3turf$B.utils.getName([name$x, 'ok'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$B.utils.getCollection(control, 1, Infinity);

        // Get form inputs
        const count = ol3turf$B.utils.getFormInteger(idCount, 'count');
        if (count > collection.features.length) {
          throw new Error('Feature count must be greater than sampling count.');
        }

        // Generate sample features
        const output = turf.sample(collection, count);

        // Remove form and display results
        control.showForm();
        const inputs = {
          featurecollection: collection,
          num: count,
        };
        control.toolbar.ol3turf.handler.callback(name$x, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$B.utils.getControlNumber(idCount, 'Count', 'Number of random features to sample', '1', '1', '1'),
      ol3turf$B.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$B.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var sample = {
    create: function(toolbar, prefix) {
      const title = 'Randomly sample features';
      return ol3turf$B.Control.create(toolbar, prefix, name$x, title, action$x);
    },
  };

  const ol3turf$C = {
    Control,
    utils,
  };


  // Control name
  const name$y = 'simplify';

  /*
   * Simplify shape
   */
  const action$y = function(control) {
    // Define control ids
    const idCancel = ol3turf$C.utils.getName([name$y, 'cancel'], control.prefix);
    const idForm = ol3turf$C.utils.getName([name$y, 'form'], control.prefix);
    const idOk = ol3turf$C.utils.getName([name$y, 'ok'], control.prefix);
    const idQuality = ol3turf$C.utils.getName([name$y, 'quality'], control.prefix);
    const idTolerance = ol3turf$C.utils.getName([name$y, 'tolerance'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$C.utils.getCollection(control, 1, Infinity);

        // Get form inputs
        const tolerance = ol3turf$C.utils.getFormNumber(idTolerance, 'tolerance');
        const quality = ol3turf$C.utils.getFormString(idQuality, 'quality');
        const highQuality = (quality === 'high');

        // Collect polygons
        const output = turf.simplify(collection, tolerance, highQuality);

        // Remove form and display results
        control.showForm();
        const inputs = {
          feature: collection,
          tolerance: tolerance,
          highQuality: highQuality,
        };
        control.toolbar.ol3turf.handler.callback(name$y, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$C.utils.getControlNumber(idTolerance, 'Tolerance', 'Simplification tolerance', '1', '0.01', '0'),
      ol3turf$C.utils.getControlSelect(idQuality, 'Quality', ol3turf$C.utils.getOptionsQuality()),
      ol3turf$C.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$C.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var simplify = {
    create: function(toolbar, prefix) {
      const title = 'Simplify shape';
      return ol3turf$C.Control.create(toolbar, prefix, name$y, title, action$y);
    },
  };

  const ol3turf$D = {
    Control,
    utils,
  };


  // Control name
  const name$z = 'square-grid';

  /*
   * Generate Square Grid
   */
  const action$z = function(control) {
    // Define control ids
    const idCancel = ol3turf$D.utils.getName([name$z, 'cancel'], control.prefix);
    const idCellSize = ol3turf$D.utils.getName([name$z, 'cell-size'], control.prefix);
    const idForm = ol3turf$D.utils.getName([name$z, 'form'], control.prefix);
    const idOk = ol3turf$D.utils.getName([name$z, 'ok'], control.prefix);
    const idUnits = ol3turf$D.utils.getName([name$z, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$D.utils.getCollection(control, 1, Infinity);

        // Get form inputs
        const cellSize = ol3turf$D.utils.getFormNumber(idCellSize, 'cell size');
        const units = ol3turf$D.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const bbox = turf.bbox(collection);
        const output = turf.squareGrid(bbox, cellSize, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          bbox: bbox,
          cellSize: cellSize,
          units: units,
        };
        control.toolbar.ol3turf.handler.callback(name$z, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$D.utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1', 'any', '0'),
      ol3turf$D.utils.getControlSelect(idUnits, 'Units', ol3turf$D.utils.getOptionsUnits()),
      ol3turf$D.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$D.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var squareGrid = {
    create: function(toolbar, prefix) {
      const title = 'Generate Square Grid';
      return ol3turf$D.Control.create(toolbar, prefix, name$z, title, action$z);
    },
  };

  const ol3turf$E = {
    Control,
    utils,
  };


  // Control name
  const name$A = 'square';

  /*
   * Compute square
   */
  const action$A = function(control) {
    // Gather selected features
    const collection = ol3turf$E.utils.getCollection(control, 1, Infinity);
    const bbox = turf.bbox(collection);
    const square = turf.square(bbox);

    const output = turf.bboxPolygon(square);
    const inputs = {
      bbox: bbox,
    };
    control.toolbar.ol3turf.handler.callback(name$A, output, inputs);
  };

  var square = {
    create: function(toolbar, prefix) {
      const title = 'Create Square';
      return ol3turf$E.Control.create(toolbar, prefix, name$A, title, action$A);
    },
  };

  const ol3turf$F = {
    Control,
    utils,
  };


  // Control name
  const name$B = 'tag';

  /*
   * Collect point attributes within polygon
   */
  const action$B = function(control) {
    // Define control ids
    const idCancel = ol3turf$F.utils.getName([name$B, 'cancel'], control.prefix);
    const idField = ol3turf$F.utils.getName([name$B, 'field-property'], control.prefix);
    const idForm = ol3turf$F.utils.getName([name$B, 'form'], control.prefix);
    const idOk = ol3turf$F.utils.getName([name$B, 'ok'], control.prefix);
    const idOutField = ol3turf$F.utils.getName([name$B, 'out-field-property'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$F.utils.getCollection(control, 2, Infinity);
        const points = ol3turf$F.utils.getPoints(collection, 1, collection.features.length - 1);
        const numPolygons = collection.features.length - points.length;
        const polygons = ol3turf$F.utils.getPolygons(collection, numPolygons, numPolygons);

        // Get form inputs
        const field = ol3turf$F.utils.getFormString(idField, 'field');
        const outField = ol3turf$F.utils.getFormString(idOutField, 'out field');

        // Collect polygons
        const inPolygons = turf.featureCollection(polygons);
        const inPoints = turf.featureCollection(points);
        const output = turf.tag(inPoints, inPolygons, field, outField);

        // Remove form and display results
        control.showForm();
        const inputs = {
          points: inPoints,
          polygons: inPolygons,
          field: field,
          outField: outField,
        };
        control.toolbar.ol3turf.handler.callback(name$B, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$F.utils.getControlText(idField, 'Field', 'Property in polygons to add to joined point features'),
      ol3turf$F.utils.getControlText(idOutField, 'Out Field', 'Property in points in which to store joined property from polygons'),
      ol3turf$F.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$F.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var tag = {
    create: function(toolbar, prefix) {
      const title = 'Perform spatial join of points and polygons';
      return ol3turf$F.Control.create(toolbar, prefix, name$B, title, action$B);
    },
  };

  const ol3turf$G = {
    Control,
    utils,
  };


  // Control name
  const name$C = 'tesselate';

  /*
   * Compute tesselation
   */
  const action$C = function(control) {
    const collection = ol3turf$G.utils.getCollection(control, 1, 1);
    const polygons = ol3turf$G.utils.getPolygons(collection, 1, 1);
    const polygon = polygons[0];

    const output = turf.tesselate(polygon);
    const inputs = {
      polygon: polygon,
    };
    control.toolbar.ol3turf.handler.callback(name$C, output, inputs);
  };

  var tesselate = {
    create: function(toolbar, prefix) {
      const title = 'Create tesselation';
      return ol3turf$G.Control.create(toolbar, prefix, name$C, title, action$C);
    },
  };

  const ol3turf$H = {
    Control,
    utils,
  };


  // Control name
  const name$D = 'tin';

  /*
   * Compute tin mesh
   */
  const action$D = function(control) {
    // Define control ids
    const idCancel = ol3turf$H.utils.getName([name$D, 'cancel'], control.prefix);
    const idForm = ol3turf$H.utils.getName([name$D, 'form'], control.prefix);
    const idOk = ol3turf$H.utils.getName([name$D, 'ok'], control.prefix);
    const idZ = ol3turf$H.utils.getName([name$D, 'z'], control.prefix);

    const onOK = function() {
      try {
        let collection = ol3turf$H.utils.getCollection(control, 3, Infinity);
        const numPoints = collection.features.length;
        const points = ol3turf$H.utils.getPoints(collection, numPoints, numPoints);
        collection = turf.featureCollection(points);

        // Get form inputs
        const z = ol3turf$H.utils.getFormString(idZ, 'z');

        const output = turf.tin(collection, z);
        const inputs = {
          points: collection,
          z: z,
        };
        control.toolbar.ol3turf.handler.callback(name$D, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$H.utils.getControlText(idZ, 'Z', '(Optional) Property from which to pull z values'),
      ol3turf$H.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$H.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var tin = {
    create: function(toolbar, prefix) {
      const title = 'Create TIN';
      return ol3turf$H.Control.create(toolbar, prefix, name$D, title, action$D);
    },
  };

  /**
   * @description Aggregation toolbar controls
   * @typedef {string[]} ToolbarAggregation
   * @memberOf ol3turf.toolbars
   * @property {string} collect collect control
   */

  /**
   * Aggregation toolbar
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarAggregation} Control names for the aggregation toolbar
   */
  function aggregation() {
    return ['collect'];
  }
  /**
   * @description Classification toolbar controls
   * @typedef {string[]} ToolbarClassification
   * @memberOf ol3turf.toolbars
   * @property {string} nearest nearest control
   */

  /**
   * Classification toolbar
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarClassification} Control names for the classification toolbar
   */
  function classification() {
    return ['nearest'];
  }
  /**
   * @description Data toolbar controls
   * @typedef {string[]} ToolbarData
   * @memberOf ol3turf.toolbars
   * @property {string} random random control
   * @property {string} sample sample control
   */

  /**
   * Data toolbar
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarData} Control names for the data toolbar
   */
  function data() {
    return [
      'random',
      'sample',
    ];
  }
  /**
   * @description Grids toolbar controls
   * @typedef {string[]} ToolbarGrids
   * @memberOf ol3turf.toolbars
   * @property {string} hex-grid hex-grid control
   * @property {string} point-grid point-grid control
   * @property {string} square-grid square-grid control
   * @property {string} tesselate tesselate control
   * @property {string} triangle-grid triangle-grid control
   */

  /**
   * Grids toolbar
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarGrids} Control names for the grids toolbar
   */
  function grids() {
    return [
      'hex-grid',
      'point-grid',
      'square-grid',
      'triangle-grid',
      'tesselate',
    ];
  }
  /**
   * @description Interpolation toolbar controls
   * @typedef {string[]} ToolbarInterpolation
   * @memberOf ol3turf.toolbars
   * @property {string} isolines isolines control
   * @property {string} planepoint planepoint control
   * @property {string} tin tin control
   */

  /**
   * Interpolation toolbar
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarInterpolation} Control names for the interpolation toolbar
   */
  function interpolation() {
    return [
      'isolines',
      'planepoint',
      'tin',
    ];
  }
  /**
   * @description Joins toolbar controls
   * @typedef {string[]} ToolbarJoins
   * @memberOf ol3turf.toolbars
   * @property {string} inside inside control
   * @property {string} tag tag control
   * @property {string} within within control
   */

  /**
   * Joins toolbar
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarJoins} Control names for the joins toolbar
   */
  function joins() {
    return [
      'inside',
      'tag',
      'within',
    ];
  }
  /**
   * @description Measurement toolbar controls
   * @typedef {string[]} ToolbarMeasurement
   * @memberOf ol3turf.toolbars
   * @property {string} along along control
   * @property {string} area area control
   * @property {string} bearing bearing control
   * @property {string} center center control
   * @property {string} center-of-mass center-of-mass control
   * @property {string} centroid centroid control
   * @property {string} circle circle control
   * @property {string} destination destination control
   * @property {string} distance distance control
   * @property {string} envelope envelope control
   * @property {string} line-distance line-distance control
   * @property {string} midpoint midpoint control
   * @property {string} point-on-surface point-on-surface control
   * @property {string} square square control
   */

  /**
   * Measurement toolbar
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarMeasurement} Control names for the measurement toolbar
   */
  function measurement() {
    return [
      'distance',
      'line-distance',
      'area',
      'bearing',
      'center-of-mass',
      'center',
      'centroid',
      'midpoint',
      'point-on-surface',
      'envelope',
      'square',
      'circle',
      'along',
      'destination',
    ];
  }
  /**
   * @description Miscellaneous toolbar controls
   * @typedef {string[]} ToolbarMisc
   * @memberOf ol3turf.toolbars
   * @property {string} combine combine control
   * @property {string} explode explode control
   * @property {string} flip flip control
   * @property {string} kinks kinks control
   * @property {string} line-slice-along line-slice-along control
   * @property {string} point-on-line point-on-line control
   */

  /**
   * Miscellaneous toolbar
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarMisc} Control names for the miscellaneous toolbar
   */
  function misc() {
    return [
      'combine',
      'explode',
      'flip',
      'kinks',
      'line-slice-along',
      'point-on-line',
    ];
  }
  /**
   * @description Transformation toolbar controls
   * @typedef {string[]} ToolbarTransformation
   * @memberOf ol3turf.toolbars
   * @property {string} bezier bezier control
   * @property {string} buffer buffer control
   * @property {string} concave concave control
   * @property {string} convex convex control
   * @property {string} difference difference control
   * @property {string} intersect intersect control
   * @property {string} simplify simplify control
   * @property {string} union union control
   */

  /**
   * Transformation toolbar
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarTransformation} Control names for the transformation toolbar
   */
  function transformation() {
    return [
      'bezier',
      'buffer',
      'concave',
      'convex',
      'difference',
      'intersect',
      'simplify',
      'union',
    ];
  }
  /**
   * @description Concatenation of all the toolbars
   * @typedef {string[]} ToolbarAll
   * @memberOf ol3turf.toolbars
   * @property {ol3turf.toolbars.ToolbarAggregation} aggregation Aggregation toolbar
   * @property {ol3turf.toolbars.ToolbarClassification} classification Classification toolbar
   * @property {ol3turf.toolbars.ToolbarData} data Data toolbar
   * @property {ol3turf.toolbars.ToolbarGrids} grids Grids toolbar
   * @property {ol3turf.toolbars.ToolbarInterpolation} interpolation Interpolation toolbar
   * @property {ol3turf.toolbars.ToolbarJoins} joins Joins toolbar
   * @property {ol3turf.toolbars.ToolbarMeasurement} measurement Measurement toolbar
   * @property {ol3turf.toolbars.ToolbarMisc} miscellaneous Miscellaneous toolbar
   * @property {ol3turf.toolbars.ToolbarTransformation} transformation Transformation toolbar
   */

  /**
   * Toolbar with all controls
   * @memberof ol3turf.toolbars
   * @return {ol3turf.toolbars.ToolbarAll} Control names for all the controls
   */
  function all() {
    const all = [];
    all.push(...measurement());
    all.push(...transformation());
    all.push(...misc());
    all.push(...joins());
    all.push(...classification());
    all.push(...aggregation());
    all.push(...data());
    all.push(...interpolation());
    all.push(...grids());
    return all;
  }
  var toolbars = {
    aggregation,
    all,
    classification,
    data,
    grids,
    interpolation,
    joins,
    measurement,
    misc,
    transformation,
  };

  const ol3turf$I = {
    Control,
    utils,
  };


  // Control name
  const name$E = 'triangle-grid';

  /*
   * Generate Triangle Grid
   */
  const action$E = function(control) {
    // Define control ids
    const idCancel = ol3turf$I.utils.getName([name$E, 'cancel'], control.prefix);
    const idCellSize = ol3turf$I.utils.getName([name$E, 'cell-size'], control.prefix);
    const idForm = ol3turf$I.utils.getName([name$E, 'form'], control.prefix);
    const idOk = ol3turf$I.utils.getName([name$E, 'ok'], control.prefix);
    const idUnits = ol3turf$I.utils.getName([name$E, 'units'], control.prefix);

    const onOK = function() {
      try {
        // Gather selected features
        const collection = ol3turf$I.utils.getCollection(control, 1, Infinity);

        // Get form inputs
        const cellSize = ol3turf$I.utils.getFormNumber(idCellSize, 'cell size');
        const units = ol3turf$I.utils.getFormString(idUnits, 'units');

        // Collect polygons
        const bbox = turf.bbox(collection);
        const output = turf.triangleGrid(bbox, cellSize, units);

        // Remove form and display results
        control.showForm();
        const inputs = {
          bbox: bbox,
          cellSize: cellSize,
          units: units,
        };
        control.toolbar.ol3turf.handler.callback(name$E, output, inputs);
      } catch (e) {
        control.showMessage(e);
      }
    };

    const onCancel = function() {
      control.showForm();
    };

    const controls = [
      ol3turf$I.utils.getControlNumber(idCellSize, 'Cell Size', 'Dimension of cell', '1', 'any', '0'),
      ol3turf$I.utils.getControlSelect(idUnits, 'Units', ol3turf$I.utils.getOptionsUnits()),
      ol3turf$I.utils.getControlInput(idOk, onOK, '', 'OK'),
      ol3turf$I.utils.getControlInput(idCancel, onCancel, '', 'Cancel'),
    ];

    control.showForm(controls, idForm);
  };

  var triangleGrid = {
    create: function(toolbar, prefix) {
      const title = 'Generate Triangle Grid';
      return ol3turf$I.Control.create(toolbar, prefix, name$E, title, action$E);
    },
  };

  const ol3turf$J = {
    Control,
    utils,
  };


  // Control name
  const name$F = 'union';

  /*
   * Compute union of two polygons
   */
  const action$F = function(control) {
    const collection = ol3turf$J.utils.getCollection(control, 2, 2);
    const polygons = ol3turf$J.utils.getPolygons(collection, 2, 2);
    const poly1 = polygons[0];
    const poly2 = polygons[1];

    const output = turf.union(poly1, poly2);
    const inputs = {
      poly1: poly1,
      poly2: poly2,
    };
    control.toolbar.ol3turf.handler.callback(name$F, output, inputs);
  };

  var union = {
    create: function(toolbar, prefix) {
      const title = 'Create Union Polygon';
      return ol3turf$J.Control.create(toolbar, prefix, name$F, title, action$F);
    },
  };

  const ol3turf$K = {
    Control,
    utils,
  };


  // Control name
  const name$G = 'within';

  /*
   * Compute points within polygons
   */
  const action$G = function(control) {
    const collection = ol3turf$K.utils.getCollection(control, 2, Infinity);
    const pts = ol3turf$K.utils.getPoints(collection, 1, collection.features.length - 1);
    const numPolygons = collection.features.length - pts.length;
    const polys = ol3turf$K.utils.getPolygons(collection, numPolygons, numPolygons);

    const points = turf.featureCollection(pts);
    const polygons = turf.featureCollection(polys);

    const output = turf.within(points, polygons);
    if (output.features.length === 0) {
      throw new Error('No points found within.');
    }
    const inputs = {
      points: points,
      polygons: polygons,
    };
    control.toolbar.ol3turf.handler.callback(name$G, output, inputs);
  };

  var within = {
    create: function(toolbar, prefix) {
      const title = 'Find points within polygons';
      return ol3turf$K.Control.create(toolbar, prefix, name$G, title, action$G);
    },
  };

  var controls = {
    along,
    area,
    bearing,
    bezier,
    buffer,
    center,
    'center-of-mass': centerOfMass,
    centroid,
    circle,
    collect,
    combine,
    concave,
    convex,
    destination,
    difference,
    distance,
    envelope,
    explode,
    flip,
    'hex-grid': hexGrid,
    inside,
    intersect,
    isolines,
    kinks,
    'line-distance': lineDistance,
    'line-slice-along': lineSliceAlong,
    midpoint,
    nearest,
    planepoint,
    'point-grid': pointGrid,
    'point-on-line': pointOnLine,
    'point-on-surface': pointOnSurface,
    popup: display,
    random,
    sample,
    simplify,
    'square-grid': squareGrid,
    square,
    tag,
    tesselate,
    tin,
    toolbars,
    'triangle-grid': triangleGrid,
    union,
    utils,
    within,
  };

  /*
   * Callback handler
   * @constructor
   * @param toolbar ol3-turf toolbar
   * @private
   */
  const Handler = function(toolbar) {
    this.toolbar = toolbar;
  };

  /*
   * Default function called by each control when turf function is completed.
   * @param name Name of ol3-turf control being handled
   * @param output Output of turf function
   * @param inputs Object with inputs provided to turf function as properties
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

  /**
   * @namespace ol3turf
   */
  const ol3turf$L = {
    controls,
    Handler,
    toolbars,
  };

  /**
   * ol3 main namespace
   * @external ol
   * @see {@link http://openlayers.org/en/latest/apidoc/ol.html}
   */

  /**
   * ol3 control namespace
   * @memberof external:ol
   * @namespace control
   * @see {@link http://openlayers.org/en/latest/apidoc/ol.control.html}
   */

  /**
   * ol3 control base class
   * @class Control
   * @memberof external:ol.control
   * @see {@link http://openlayers.org/en/latest/apidoc/ol.control.Control.html}
   */

  /**
   * Function that handles processing the output of the ol3-turf controls.
   * @callback ToolbarCallback
   * @memberOf ol3turf
   * @param {string} name Name of control to process
   * @param {object} inputs Inputs passed to the control's corresponding turf function
   * @param {*} output Output returned by the turf function
   */

  /**
   * @description ol3-turf custom callback handler.
   * @typedef {object} ToolbarHandler
   * @memberOf ol3turf
   * @property {ol3turf.ToolbarCallback} callback Function to handle processing turf commands.
   */

  /**
   * @description ol3-turf constructor options.
   * @typedef {object} ToolbarOptions
   * @memberOf ol3turf
   * @property {string[]} [controls={@link ol3turf.toolbars.ToolbarAll}] Controls to enable
   * @property {ol3turf.ToolbarHandler} [handler=ol3turf.Handler] Optional function that handles
   *                                                              processing the output of the
   *                                                              ol3-turf controls. This is
   *                                                              useful to bypass the default
   *                                                              handler and provide custom
   *                                                              processing of the results. The
   *                                                              default handler adds features
   *                                                              to the map or displays a message
   *                                                              with any values returned by the
   *                                                              turf function.
   * @property {string} [prefix=ol3-turf] Prefix to apply to control element IDs.
   *                                      Only needed to make IDs unique if
   *                                      multiple instances of an ol3-turf
   *                                      toolbar are used on the same page.
   * @property {string} [style=ol3-turf-toolbar] The name of the class to apply
   *                                             to the toolbar.
   */

  /**
   * OpenLayers 3 Turf Control
   * @constructor
   * @extends {external:ol.control.Control}
   * @param {object} [options] Control options extends ol.control.Control options
   * @param {ol3turf.ToolbarOptions} [options.ol3turf] ol3-turf specific options
   */
  const Toolbar = function(options) {
    const self = this;

    // Process options
    const opts = options || {};
    opts.ol3turf = opts.ol3turf || {};
    if (opts.ol3turf.controls === undefined) {
      // Default is to enable all controls and display them in this order.
      opts.ol3turf.controls = ol3turf$L.toolbars.all();
    }

    // Set control handler
    if (opts.ol3turf.handler === undefined) {
      opts.ol3turf.handler = new ol3turf$L.Handler(self);
    }

    // Define default style
    if (opts.ol3turf.style === undefined) {
      opts.ol3turf.style = 'ol3-turf-toolbar';
    }

    // Define default prefix
    if (opts.ol3turf.prefix === undefined) {
      opts.ol3turf.prefix = 'ol3-turf';
    }

    // Create turf toolbar DOM if not provided by user
    if (opts.element === undefined) {
      opts.element = document.createElement('div');
    }
    if (opts.element.className === '') {
      opts.element.className = opts.ol3turf.style + ' ol-unselectable ol-control';
    }

    // Add controls to toolbar
    const ol3turfcontrols = {};
    opts.ol3turf.controls.forEach(function(name) {
      if (ol3turf$L.controls[name] !== undefined) {
        // Store control in ol3turf member and add button to div
        const control = ol3turf$L.controls[name].create(self, opts.ol3turf.prefix);
        ol3turfcontrols[name] = control;
        opts.element.appendChild(control.element);
      }
    });

    // Object to internally store ol3-turf specific attributes
    this.ol3turf = {
      controls: ol3turfcontrols,
      element: opts.element,
      handler: opts.ol3turf.handler,
    };

    ol.control.Control.call(this, opts);
  };
  ol.inherits(Toolbar, ol.control.Control);

  var main = {
    toolbars,
    Toolbar,
  };

  return main;

}));
