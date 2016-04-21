var extend = require('util')._extend,
    path = require('path'),
    fs = require('fs'),
    loaderUtils = require('loader-utils'),
    AWS = require('aws-sdk');

module.exports = function(source) {
    this.cacheable();

    var chain = loaderUtils.getRemainingRequest(this).split('!'),
        filename = chain.slice(-1)[ 0 ],
        filenameArr = filename.split('/'),
        query = loaderUtils.parseQuery(this.query),
        s3Options = extend(this.options.s3Options || {}, query),
        root = path.resolve(process.cwd(), s3Options.root || ''),
        depth = s3Options.depth || 0,
        prefix = s3Options.prefix,
        overwrite = s3Options.overwrite || false,
        callback = this.async(),
        key,
        s3;

    try {
        s3 = new AWS.S3({
            accessKeyId: s3Options.accessKeyId,
            secretAccessKey: s3Options.secretAccessKey,
            params: { Bucket: s3Options.bucketName }
        });
    } catch (e) {
        return callback(e, null);
    }

    if (!isNaN(depth) && filenameArr.length > depth) {
        var index = depth > 0 ? filenameArr.length - depth : 0;

        key = filenameArr
            .slice(index, filenameArr.length)
            .join('/');
    } else {
        key = filenameArr.pop();
    }

    if (root) {
        if (root.charAt(root.length - 1) !== '/') {
            root += '/';
        }

        key = key.replace(root, '');
    }

    if (prefix) {
        key = filenameArr.join(prefix, key);
    }

    s3.getObject({ Key: key }, function(e, data) {
        var body = data && data.Body;

        if (!e) {
            if (overwrite) {
                fs.writeFileSync(filename, body);
            }

            return callback(null, body);
        }

        callback(e, null);
    });
};