(function () {
  "use strict";

  var gulp = require("gulp");
  var spawn = require("spawn-cmd").spawn;
  var gutil = require("gulp-util");
  var connect = require("gulp-connect");
  var html2string = require("gulp-html2string");
  var path = require("path");
  var rename = require("gulp-rename");
  var rimraf = require("gulp-rimraf");
  var concat = require("gulp-concat");
  var bump = require("gulp-bump");
  var sass = require("gulp-sass");
  var minifyCSS = require("gulp-minify-css");
  var runSequence = require("run-sequence");
  var uglify = require("gulp-uglify");
  var httpServer;

  gulp.task("clean-dist", function () {
    return gulp.src("dist", {read: false})
      .pipe(rimraf());
  });

  gulp.task("clean-tmp", function () {
    return gulp.src("tmp", {read: false})
      .pipe(rimraf());
  });

  gulp.task("clean", ["clean-dist", "clean-tmp"]);

  gulp.task("config", function() {
    var env = process.env.NODE_ENV || "dev";
    gutil.log("Environment is", env);

    return gulp.src(["./src/config/" + env + ".js"])
      .pipe(rename("config.js"))
      .pipe(gulp.dest("./src/config"));
  });

  // Defined method of updating:
  // Semantic
  gulp.task("bump", function(){
    return gulp.src(["./package.json", "./bower.json"])
    .pipe(bump({type:"patch"}))
    .pipe(gulp.dest("./"));
  });

  gulp.task("e2e:server", ["build"], function() {
    httpServer = connect.server({
      root: "./",
      port: 8099,
      livereload: false
    });
    return httpServer;
  });

  gulp.task("sass", function () {
    return gulp.src("src/sass/main.scss")
      .pipe(sass())
      .pipe(gulp.dest("tmp/css"));
  });

  gulp.task("css", ["sass"], function () {
    return gulp.src("tmp/css/main.css")
      .pipe(rename("google-drive-picker.css"))
      .pipe(gulp.dest("dist/css"));
  });

  gulp.task("css-min", ["css"], function () {
    return gulp.src("dist/css/google-drive-picker.css")
      .pipe(minifyCSS({keepBreaks:true}))
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist/css"));
  });

  gulp.task("html2js", function () {
    return gulp.src("src/html/*.html")
      .pipe(html2string({ createObj: true, base: path.join(__dirname, "src/html"), objName: "TEMPLATES" }))
      .pipe(rename({extname: ".js"}))
      .pipe(gulp.dest("tmp/templates/"));
  });

  gulp.task("concat-js", ["clean", "config", "html2js"], function () {
    return gulp.src([
      "src/config/config.js",
      "tmp/templates/*.js", //template js files
      "src/js/*.js"])

      .pipe(concat("google-drive-picker.js"))
      .pipe(gulp.dest("dist/js"));
  });

  gulp.task("js-uglify", ["concat-js"], function () {
    gulp.src("dist/js/*.js")
      .pipe(uglify())
      .pipe(rename(function (path) {
        path.basename += ".min";
      }))
      .pipe(gulp.dest("dist/js"));
  });

  gulp.task("e2e:test", ["build", "e2e:server"], function () {
      var tests = ["test/e2e/google-drive-picker-scenarios.js"];

      var casperChild = spawn("casperjs", ["test"].concat(tests));

      casperChild.stdout.on("data", function (data) {
          gutil.log("CasperJS:", data.toString().slice(0, -1)); // Remove \n
      });

      casperChild.on("close", function (code) {
          var success = code === 0; // Will be 1 in the event of failure
          connect.serverClose();
          // Do something with success here
      });
  });

  gulp.task("build", function (cb) {
    runSequence("clean", ["js-uglify", "css-min"], cb);
  });

  gulp.task("test", ["e2e:test"]);

  gulp.task("default", ["build"]);

})();
