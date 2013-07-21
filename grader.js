#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs'),
    sys = require('util'),
    program = require('commander'),
    cheerio = require('cheerio'),
    sys = require('util'),
    rest = require('restler');
    // HTMLFILE_DEFAULT = "index.html",
    // CHECKSFILE_DEFAULT = "checks.json",
    // HTMLURL_DEFAULT = null;
    // rest.get('www.google.com').on('complete', function(result) {
    //     console.log(result);
    // });
var flag = 'f';

var assertUrlExists = function(url) {
    var inurl = url.toString();
    // console.log(inurl);
    return inurl;
};


var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
    return instr;
};

var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    // console.log(typeof(htmlfile));
    if (flag === 'f') {
        $ = cheerioHtmlFile(htmlfile);
        var checks = loadChecks(checksfile).sort();
        var out = {};
        for(var ii in checks) {
            var present = $(checks[ii]).length > 0;
            out[checks[ii]] = present;
        }
        return out;
    } else {
        rest.get(htmlfile).on('complete', function(result) {
        // console.log(result);
            if (result instanceof Error) {
                sys.puts('Error: ' + result.message);
                // this.retry(5000); // try again after 5 sec
            } else {
                // html = result;
                $ = cheerio.load(result);
                var checks = loadChecks(checksfile).sort();
                var out = {};
                for(var ii in checks) {
                    var present = $(checks[ii]).length > 0;
                    out[checks[ii]] = present;
                }
                // return out;
                var outJson = JSON.stringify(out, null, 4);
                console.log(outJson);

            }
        });
    }
};

var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists))
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists))
        .option('-u, --url <url>', 'Url to page', clone(assertUrlExists))
        .parse(process.argv);

    var checkJson;
    if (program.file) {
        // console.log(program.file);
        checkJson = checkHtmlFile(program.file, program.checks);
        var outJson = JSON.stringify(checkJson, null, 4);
        console.log(outJson);
    } else if (program.url){
        // console.log(program.url);
        flag = 'u';
        checkJson = checkHtmlFile(program.url, program.checks);
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}
