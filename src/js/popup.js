import utils from './utils';


const ol3turf = {
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
export default function display(message, callback, parent, attributes) {
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
  ol3turf.utils.extend(attributes, popup);

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
};

