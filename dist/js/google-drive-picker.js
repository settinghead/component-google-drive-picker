var CONFIG = {
  GOOGLE_CLIENT_ID: "614513768474.apps.googleusercontent.com"
};

if(typeof TEMPLATES === 'undefined') {var TEMPLATES = {};}
TEMPLATES['google-drive-picker-template.html'] = "<button class=\"btn btn-link btn-google\" type=\"button\">Google Drive &#8482;</button>\n" +
    ""; 
if (typeof RiseVision === "undefined") {
  var RiseVision = {Authorization: {}};
}

;(function (CONFIG, gapi, RiseVision) {
  "use strict";

  RiseVision.Authorization = (function () {

    var oauthToken = null,
      loaded = false;

    function authorize(immediate, scope, callbackFn) {
      gapi.auth.authorize({
        client_id : CONFIG.GOOGLE_CLIENT_ID,
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

  function Plugin(element, options) {
    var authorization = RiseVision.Authorization,

      AUTH_SCOPE = "https://www.googleapis.com/auth/drive",

      _$element = $(element),
      _$button = null,
      _origin,
      _pickerApiLoaded = false,
      _viewMap = {};

    options = $.extend({}, {"viewId": "docs"}, options);

    function _onPickerAction(data) {
      if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
        //TODO: Sort out what to do with data
      }
    }

    function _createPicker() {
      if (_pickerApiLoaded && authorization.getAuthToken()) {
        var picker = new google.picker.PickerBuilder()
          .setOrigin(_origin)
          .addView(_viewMap[options.viewId])
          .setOAuthToken(authorization.getAuthToken())
          .setCallback(_onPickerAction)
          .build();

        picker.setVisible(true);
      }
    }

    function _onPickerApiLoaded() {
      _pickerApiLoaded = true;

      _viewMap = {
        "docs": google.picker.ViewId.DOCS,
        "docs_images": google.picker.ViewId.DOCS_IMAGES,
        "documents": google.picker.ViewId.DOCUMENTS,
        "presentations": google.picker.ViewId.PRESENTATIONS,
        "spreadsheets": google.picker.ViewId.SPREADSHEETS,
        "forms": google.picker.ViewId.FORMS,
        "docs_images_and_videos": google.picker.ViewId.DOCS_IMAGES_AND_VIDEOS,
        "docs_videos": google.picker.ViewId.DOCS_VIDEOS,
        "folders": google.picker.ViewId.FOLDERS,
        "pdfs": google.picker.ViewId.PDFS
      }

      _createPicker();
    }

    function _bind() {
      _$button.on("click", function () {
        if (_pickerApiLoaded && authorization.getAuthToken()) {
          _createPicker();
          return;
        }

        if (!authorization.getAuthToken()) {
          // Initiate the authorization this time with UI (immediate = false)
          authorization.authorize(false, AUTH_SCOPE, function (oauthToken) {
            if (oauthToken) {
              gapi.load('picker', {'callback': _onPickerApiLoaded });
            }
          });
          return;
        }

        if (!_pickerApiLoaded) {
          gapi.load('picker', {'callback': _onPickerApiLoaded });
        }
      });
    }

    function _init() {
      // Get the HTML markup from the template.
      _$element.append(TEMPLATES['google-drive-picker-template.html']);

      _$button = _$element.find(".btn-google");

      _origin = document.referrer.split("/").slice(0, 3).join("/") + "/";

      if (!authorization.isApiLoaded()) {
        authorization.loadApi(function () {
          // Initiate the authorization without UI (immediate = true)
          authorization.authorize(true, AUTH_SCOPE, function () {
            _bind();
          });

        });
      } else {
        _bind();
      }
    }

    _init();

    return {
      //TODO: Provide any public API (if necessary)
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
