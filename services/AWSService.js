'use strict';

const Promise = require('bluebird');
const uuid = require('uuid');
const ImageService = require('./ImageService');

var S3 = {
  bucket: process.env.S3_BUCKET,
};

module.exports = {
  upload: upload
};

function upload(base64Image) {
  return new Promise(
    function(resolve, reject) {
      var s3 = new infrastructure.aws.S3();
      ImageService.createImageJpg(base64Image)
        .then(payload => {
          let params = {
            ACL: 'public-read',
            Key: payload.fileName,
            Bucket: S3.bucket,
            Body: payload.fileBuffer,
            ContentEncoding: 'base64',
            ContentType: payload.contentType
          };

          s3.putObject(params, function (err, data) {
            if (err) {
              reject(err)
            } else {
              // Grab the URL
              s3.getSignedUrl('getObject',
                {
                  Key: payload.fileName,
                  Bucket: S3.bucket
                }, function (err, url) {
                  var unsignedUrl = url.substring(0, url.indexOf('?'));
                  resolve({url: unsignedUrl});
                });
            }
          });
        })
        .catch(err => {
          return reject(err);
        });
    }
  );
}
