
var test        = require('tap').test
,   imagemagick = require('..')
,   fs          = require('fs')
,   debug       = 0
;

console.log("image magick's version is: " + imagemagick.version());
var versions = imagemagick.version().split(".");

function readSrc(file, mode) {
    var path = require('path').join(__dirname, file);
    return require('fs').readFileSync(path, mode);
}

function readStream(file) {
    var path = require('path').join(__dirname, file);
    return require('fs').createReadStream(path);
}

function writeStream(file) {
    var path = require('path').join(__dirname, file);
    return require('fs').createWriteStream(path);
}

test( 'stream.convert returns a stream like object', function (t) {
    t.plan(2);
    var stream = imagemagick.streams.convert({
        width: 100,
        height: 100,
        filter: 'Lagrange',
        quality: 80,
        format: 'PNG',
        debug: debug
    });

    t.equal( typeof(stream.on), 'function' );
    t.equal( typeof(stream.pipe), 'function' );
    t.end()
});

test( 'stream.convert can pipes streams', function (t) {
    t.plan(2);
    var stream = imagemagick.streams.convert({
        width: 100,
        height: 100,
        filter: 'Lagrange',
        quality: 80,
        format: 'PNG',
        debug: debug
    });

    var input = readStream('test.png');
    var output = writeStream('test-async-temp.png');

    output.on('close',function(){
        var ret = imagemagick.identify({
            srcData: readSrc( 'test-async-temp.png' )
        });
        t.equal( ret.width, 100 );
        t.equal( ret.height, 100 );
        fs.unlinkSync( 'test-async-temp.png' );
        t.end();
    });

    input.pipe(stream).pipe(output);
});
