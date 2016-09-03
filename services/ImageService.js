'use strict';

const Promise = require('bluebird');
const uuid = require('uuid');
var gm = require('gm').subClass({ imageMagick: true });

module.exports = {
  createImageJpg: createImageJpg
};

function createImageJpg(base64Image) {
  return new Promise(
    (resolve, reject) => {
      let buffer = new Buffer(base64Image.replace(/^data:image\/\w+;base64,/, ""), 'base64');
      let fileKey = uuid.v4() + '.png';
      // Convert to JPG and compress
      gm(buffer, fileKey)
        .quality(60)
        .toBuffer('JPG', function(err, jpgBuffer) {
          if (err) {
            return reject(err);
          } else {
            const payload = {
              fileName: fileKey.replace('.png', '.jpg'),
              fileBuffer: jpgBuffer,
              contentType: 'image/jpeg'
            };
            return resolve(payload);
          }
        });
    }
  );
}