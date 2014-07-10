casper.test.begin("Google Drive Picker Tests", function (test) {
  casper.start("http://localhost:8099/test/e2e/google-drive-picker-scenarios.html", function () {
    test.assertTitle("Google Drive Picker - Test Page", "Page title is the one expected");
    test.assertExists("button.btn.btn-link.btn-google",
      "Button exists and applies bootstrap styling");
  });

  // Open Google Picker
  casper.then(function () {
    this.click(".btn-google");
    //TODO: mock tests with Google Client Auth and Google Picker
  });

  casper.run(function() {
    test.done();
  });
});
