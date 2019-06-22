const utils = {};

/**
 * Extend properties from source to target objects recursively.
 * @param {object} source Source object
 * @param {object} target Target object
 * @private
 */
utils.extend = function(source, target) {
  if ((source === undefined) || target === undefined) {
    return;
  }
  Object.keys(source).forEach(function(property) {
    const src = source[property];
    if ((src !== null) && (typeof src === 'object')) {
      if (target[property] === undefined) {
        target[property] = {};
      }
      utils.extend(src, target[property]);
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
utils.getClass = function(suffices, prefix) {
  return '.' + utils.getName(suffices, prefix);
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
utils.getCollection = function(control, min, max) {
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
utils.getControlInput = function(id, onclick, title, value) {
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
utils.getControlNumber = function(id, title, text, value, step, min, max) {
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
utils.getControlSelect = function(id, title, options) {
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
utils.getControlText = function(id, title, text) {
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
utils.getElement = function(name, suffices, prefix) {
  return name + '[name=\'' + utils.getName(suffices, prefix) + '\']';
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
utils.getFeatures = function(types, collection, min, max) {
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
utils.getFormArray = function(id, name) {
  const input = utils.getFormString(id, name);
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
utils.getFormInteger = function(id, name) {
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
utils.getFormNumber = function(id, name) {
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
utils.getFormString = function(id, name) {
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
utils.getId = function(suffices, prefix) {
  return '#' + utils.getName(suffices, prefix);
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
utils.getLines = function(collection, min, max) {
  return utils.getFeatures(['LineString'], collection, min, max);
};

/**
 * Get ol3-turf name with given suffices appended with hyphens
 * @param {string[]} suffices List of suffices to append to base name
 * @param {string} prefix Selector prefix
 * @private
 * @return {string} Control name string "ol3-turf-..."
 */
utils.getName = function(suffices, prefix) {
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
utils.getOptionsGeometry = function() {
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
utils.getOptionsGrids = function() {
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
utils.getOptionsQuality = function() {
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
utils.getOptionsUnits = function() {
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
utils.getPoints = function(collection, min, max) {
  return utils.getFeatures(['Point'], collection, min, max);
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
utils.getPolygons = function(collection, min, max) {
  return utils.getFeatures(['Polygon'], collection, min, max);
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
utils.getPolygonsAll = function(collection, min, max) {
  return utils.getFeatures(['Polygon', 'MultiPolygon'], collection, min, max);
};

export default utils;
