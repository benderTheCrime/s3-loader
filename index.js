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
        depth = s3Options.depth,
        prefix = s3Options.prefix,
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
        callback(e, null);
        return;
    }

    if (depth && !isNaN(depth) && filenameArr.length > depth) {
        key = filenameArr.slice(
            filenameArr.length - depth, filenameArr.length
        ).join('/');
    } else {
        key = filenameArr.pop();
    }

    if (prefix) {
        key = filenameArr.join(prefix, key);
    }

    s3.getObject({ Key: key }, function(e, data) {
        var body = data && data.Body;

        if (!e && s3Options.overwrite) {
            fs.writeFileSync(filename, body);
            callback(null, body);
            return;
        }

        callback(e, null);
    });
};