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
