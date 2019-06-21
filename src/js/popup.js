import utils from './utils';

/* globals document, ol3turf */

const ol3turf = {
  utils
};

//==================================================
// popup form
//--------------------------------------------------
export default (function (ol3turf) {

    "use strict";

    /**
     * Displays a message in a popup window.
     * @param {string} message Message to display
     * @param {function} callback Callback function when user closes popup.
     * @param {object} parent Popup parent element
     * @param {object} attributes Popup div attributes
     * @return Popup DOM element
     * @private
     */
    return function (message, callback, parent, attributes) {

        // Popup id
        var id = "ol3-turf-popup";

        // Remove existing popup
        var currentPopup = document.getElementById(id);
        var currentParent = null;
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
        function onClick() {
            if (callback !== undefined && callback !== null) {
                callback();
            }
            ol3turf.popup();
        }

        // If no parent then add to body
        var container = document.body;
        if (parent !== undefined && parent !== null) {
            container = parent;
        }

        // Create a div to contain popup
        var popup = document.createElement("div");
        popup.className = id;
        popup.id = id;
        ol3turf.utils.extend(attributes, popup);

        // Create a div to contain message
        var divMessage = document.createElement("div");
        divMessage.className = "ol3-turf-popup-message";
        divMessage.innerHTML = message;

        // Create a button
        var button = document.createElement("button");
        button.className = "ol3-turf-popup-button";
        button.innerHTML = "OK";
        button.onclick = onClick;
        button.type = "button";

        var divButton = document.createElement("div");
        divButton.className = "ol3-turf-popup-button-container";
        divButton.appendChild(button);

        // Create popup
        popup.appendChild(divMessage);
        popup.appendChild(divButton);
        container.appendChild(popup);

        return popup;

    };

}(ol3turf || {}));
