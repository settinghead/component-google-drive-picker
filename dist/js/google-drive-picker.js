var CONFIG = {};

if(typeof TEMPLATES === 'undefined') {var TEMPLATES = {};}
TEMPLATES['google-drive-picker-template.html'] = "<button class=\"btn btn-link btn-google\" type=\"button\">Google Drive &#8482;</button>\n" +
    ""; 
if (typeof RiseVision === "undefined") {
  var RiseVision = {Authorization: {}};
}

;(function (CONFIG, gapi, RiseVision) {
  "use strict";

  RiseVision.Authorization = (function () {

    var DEFAULT_CLIENT_ID = "614513768474.apps.googleusercontent.com",

      oauthToken = null,
      loaded = false;

    function authorize(immediate, scope, callbackFn) {
      var clientId = CONFIG.GOOGLE_CLIENT_ID || DEFAULT_CLIENT_ID;

      gapi.auth.authorize({
        client_id : clientId,
        scope : scope,
        immediate : immediate
      }, function (authResult) {
        if (authResult && !authResult.error) {
          oauthToken = authResult.access_token;
        } else {
          if (window.console) {
            console.info("Authorization Fail: " + authResult.error);
          }
        }
        callbackFn.call(null, oauthToken);
      });
    }

    function isApiLoaded() {
      return loaded;
    }

    function loadApi(callbackFn) {
      // Use the API Loader script to load the Authentication script.
      gapi.load('auth', {'callback': function () {
        loaded = true;
        if (typeof callbackFn === 'function') {
          callbackFn.apply(null);
        }
      }});
    }

    function getAuthToken() {
      return oauthToken;
    }

    return {
      authorize: authorize,
      getAuthToken: getAuthToken,
      isApiLoaded: isApiLoaded,
      loadApi: loadApi
    };
  })();
})(CONFIG, gapi, RiseVision);

/*  Copyright © 2014 Rise Vision Incorporated.
 *  Use of this software is governed by the GPLv3 license
 *  (reproduced in the LICENSE file).
 */
;(function ($, window, document, TEMPLATES, CONFIG, undefined) {
  "use strict";

  var _pluginName = "googleDrivePicker";

  function Plugin(element) {
    var authorization = RiseVision.Authorization,
      $element = $(element),
      $button = null;

    function _bind() {
      $button.on("click", function () {
        console.log("button clicked");
        // TODO: write logic
       });
    }

    function _init() {
      // Get the HTML markup from the template.
      $element.append(TEMPLATES['google-drive-picker-template.html']);

      $button = $element.find(".btn-google");

      _bind();
    }

    _init();

    return {

    };
  }

  /*
   *  A lightweight plugin wrapper around the constructor that prevents
   *  multiple instantiations.
   */
  $.fn.googleDrivePicker = function(options) {
    return this.each(function() {
      if (!$.data(this, "plugin_" + _pluginName)) {
        $.data(this, "plugin_" + _pluginName, new Plugin(this, options));
      }
    });
  };
})(jQuery, window, document, TEMPLATES, CONFIG);
