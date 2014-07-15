(function () {

  "use strict";

  var authorization = RiseVision.Authorization,
    AUTH_SCOPE = "https://www.googleapis.com/auth/drive",

    rvDirectiveLink = function (scope, $element, attrs) {
      var viewId = attrs.viewId || "docs",
        pickerApiLoaded = false,
        viewMap = {
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
        };

      function onPickerAction(data) {
        if (data[google.picker.Response.ACTION] === google.picker.Action.PICKED) {
          scope.$emit("picked", data[google.picker.Response.DOCUMENTS]);
        }
      }

      function createPicker() {
        var parser = document.createElement('a'),
          origin,
          picker;

        if (document.referrer) {
          parser.href = document.referrer;
          origin = parser.protocol + "//" + parser.hostname;
        } else {
          /* Testing component locally (http://localhost:8099), so component is
           not within an iframe
           */
          origin = window.location.protocol + '//' + window.location.host;
        }

        if (pickerApiLoaded && authorization.getAuthToken()) {
          picker = new google.picker.PickerBuilder()
            .setOrigin(origin)
            .addView(viewMap[viewId])
            .setOAuthToken(authorization.getAuthToken())
            .setCallback(onPickerAction)
            .build();

          picker.setVisible(true);
        }
      }

      function onPickerApiLoaded() {
        pickerApiLoaded = true;

        createPicker();
      }

      $element.on("click", function () {
        if (pickerApiLoaded && authorization.getAuthToken()) {
          createPicker();
          return;
        }

        if (!authorization.getAuthToken()) {
          // Initiate the authorization this time with UI (immediate = false)
          authorization.authorize(false, AUTH_SCOPE, function (oauthToken) {
            if (oauthToken) {
              gapi.load('picker', {'callback': onPickerApiLoaded });
            }
          });
          return;
        }

        if (!pickerApiLoaded) {
          gapi.load('picker', {'callback': onPickerApiLoaded });
        }
      });
    };

  function createDirective() {
    // create the directive
    angular.module("risevision.widget.common")
      .directive("googleDrivePicker", ["$log"], function ($log) {
        return {
          restrict: 'AE',
          template: TEMPLATES['google-drive-picker-template.html'],
          scope: {
            viewId: "@"
          },
          link: rvDirectiveLink
        };
      });
  }

  if (!authorization.isApiLoaded()) {
    authorization.loadApi(function () {
      // Initiate the authorization without UI (immediate = true)
      authorization.authorize(true, AUTH_SCOPE, createDirective);
    });
  } else {
    createDirective();
  }

}());
