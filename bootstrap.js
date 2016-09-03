'use strict';

const Promise = require('bluebird');
const AWS = require('aws-sdk');

module.exports = {
  initialize: initialize
};

function initialize() {
  return new Promise(
    (resolve, reject) => {
      let infrastructure = {};
      initializeAWS()
        .then(function(aws) {
          infrastructure.aws = aws;
          resolve(infrastructure);
        })
        .catch(function(err) {
          return reject(err);
        });
    }
  )
}

function initializeAWS() {
  return new Promise(
    (resolve, reject) => {
      AWS.config.update({
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
        region: process.env.AWS_REGION
      });

      resolve(AWS);
    }
  );
}
