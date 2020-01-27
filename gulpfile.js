const { src, dest, parallel, watch } = require("gulp");
const sass = require("gulp-sass"),
	postcss = require("gulp-postcss"),
	autoprefixer = require("autoprefixer"),
	cssnano = require("cssnano"),
	sourcemaps = require("gulp-sourcemaps"),
	browserSync = require("browser-sync").create();

const paths = {
	styles: {
		// By using styles/**/*.sass we're telling gulp to check all folders for any sass file
		src: "src/sass/*",
		// Compiled files will end up in whichever folder it's found in (partials are not compiled)
		dest: "css"
	},
};

function style() {
	return (
		src(paths.styles.src)
			// Initialize sourcemaps before compilation starts
			.pipe(sourcemaps.init())
			.pipe(sass())
			.on("error", sass.logError)
			// Use postcss with autoprefixer and compress the compiled file using cssnano
			//.pipe(postcss([autoprefixer()]))
			// Now add/write the sourcemaps
			.pipe(sourcemaps.write())
			.pipe(dest(paths.styles.dest))
			// Add browsersync stream pipe after compilation
			.pipe(browserSync.stream())
	);
}
exports.style = style;

function style_prod() {
	return (
		src(paths.styles.src)
			// Initialize sourcemaps before compilation starts
			.pipe(sourcemaps.init())
			.pipe(sass())
			.on("error", sass.logError)
			// Use postcss with autoprefixer and compress the compiled file using cssnano
			.pipe(postcss([
				autoprefixer(),
				cssnano(),
			]))
			// Now add/write the sourcemaps
			.pipe(sourcemaps.write('.'))
			.pipe(dest(paths.styles.dest))
			// Add browsersync stream pipe after compilation
			.pipe(browserSync.stream())
	);
}
exports.style_prod = style_prod;

// A simple task to reload the page
function reload() {
	browserSync.reload();
}

// Add browsersync initialization at the start of the watch task
function dev() {
	browserSync.init({
        server: {
            baseDir: "./"
        }
    });
	watch(paths.styles.src, style);
	// We should tell gulp which files to watch to trigger the reload
	// This can be html or whatever you're using to develop your website
	// Note -- you can obviously add the path to the Paths object
}
exports.dev = dev;
