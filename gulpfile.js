// const { src, dest, series, parallel, watch } = require("gulp");
// const browserSync = require("browser-sync").create();
// const del = require("del");
// const htmlMinify = require("gulp-htmlmin");
// const gulpIf = require("gulp-if");

import asc from "assemblyscript/asc";
import gulp from "gulp";
const { dest, parallel, series, src, watch } = gulp;
import { create as BrowserSyncCreate } from "browser-sync";
const browserSync = BrowserSyncCreate();
import del from "del";
import htmlmin from "gulp-htmlmin";
const htmlMinify = htmlmin;
import { exec } from "child_process";

// Utilities
function isArgumentPassed(...args) {
	for (let i = 0; i < args.length; i++) {
		if (!args[i].startsWith("--")) {
			if (args[i].length > 1) {
				args.unshift(`--${args[i]}`);
			} else {
				args.unshift(`-${args[i]}`);
			}

			i++;
		}
	}

	for (const key of args) {
		if (process.argv.includes(key)) return true;
		if (!key.startsWith("-") && key.toUpperCase() in process.env) return true;
	}

	return false;
}

// Env
const isProduction = isArgumentPassed("production", "prod");
console.log(isProduction ? "PRODUCTION" : "DEVELOPMENT");

// Options
const browserSyncOptions = {
	open: false,
	browser: false,
	ui: false,
	host: "0.0.0.0",
	server: {
		baseDir: "./dist",
		port: 3000,
	},
};

const htmlOptions = {
    collapseWhitespace: true,
    removeComments: true,
    removeRedundantAttributes: true,
};

// Tasks
function reload() {
    return browserSync.reload({ stream: true });
}

function handleHtml() {
    return src("src/**/*.html")
        .pipe(htmlMinify(htmlOptions))
        .pipe(dest("./dist"))
        .pipe(reload());
}

function watchHtml() {
    return watch("src/**/*.html", handleHtml);
}

function handleJs() {
    return src("src/**/*.js")
        .pipe(dest("./dist/scripts"))
        .pipe(reload());
}

function watchJs() {
    return watch("src/**/*.js", handleJs);
}

function copyWASMBuild() {
    return src("./build/**.*")
        .pipe(dest("./dist/wasm"))
        .pipe(reload());
}

function delay(amount) {
    return new Promise((resolve, reject) => {
        setTimeout(resolve, amount);
    });
}

function handleWASM(cb) {
    let cmd = null;
    if (isProduction) {
        cmd = "asc src/assembly/index.ts --target release";
    } else {
        cmd = "asc src/assembly/index.ts --target debug";
    }

   exec(cmd, function (err, stdout, stderr) {
       console.log(stdout);
       console.error(stderr);
       cb(err);
   });
}

function watchWASM() {
    return watch("src/assembly/**/*.ts", series(handleWASM, copyWASMBuild));
}

export function clean() {
    return del("dist").then(x => del("build/**/*.*"));
}

function initialize() {
    return browserSync.init(browserSyncOptions);
}

// Export tasks
export const html = handleHtml;
export const js = handleJs;
export const wasm = series(handleWASM, copyWASMBuild);
export const build = series(clean, parallel(html, js, wasm));
export const dev = series(build, parallel(watchHtml, watchJs, watchWASM, initialize));
export default build;