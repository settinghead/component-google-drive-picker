/*global casper: false */

var testUrl = "http://localhost:8099/test/e2e/google-drive-picker-test.html";

casper.test.begin("Google Drive Picker: Should load", function (test) {

  casper.start(testUrl, function () {
    test.assertTitle("Google Drive Picker - Test Page", "Page title is the one expected");
    test.assertExists("button.btn.btn-link.btn-google",
      "Button exists and applies bootstrap styling");
  });

  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Google Drive Picker: Pick a file", function (test) {
  // Open Google Picker

  casper.start(testUrl);
  casper.then(function () {
    this.click(".btn-google");
    this.evaluate(function simulateFilePick () {
      //simulate a file pick
      window.pickFiles(["test_file"]);
    });
    this.evaluateOrDie(function () {
      return window.filesPicked[0] === "test_file";
    });
  });
  casper.run(function() {
    test.done();
  });
});

casper.test.begin("Google Drive Picker: Cancel Dialog", function (test) {
  casper.start(testUrl);
  // Open Google Picker
  casper.then(function () {
    this.click(".btn-google");
    this.evaluate(function simulateDialogCancel () {
      window.dialogCancel();
    });
    this.evaluateOrDie(function () {
      return window.cancelled === true;
    });
  });

  casper.run(function() {
    test.done();
  });
});
