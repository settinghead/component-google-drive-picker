casper.test.begin("google drive picker: button", function (test) {
  casper.start("http://localhost:8099/test/e2e/google-drive-picker-scenarios.html", function () {
    test.assertTitle("Google Drive Picker - Test Page", "Page title is the one expected");
    // TODO: more tests
  });

  // TODO: more tests

  casper.run(function() {
    test.done();
  });
});
