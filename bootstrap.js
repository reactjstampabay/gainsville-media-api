'use strict';

const Promise = require('bluebird');
const firebase = require('firebase');
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
          return initializFirebase();
        })
        .then(function(firebase) {
          infrastructure.firebase = firebase;
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

function initializFirebase() {
  return new Promise(
    (resolve, reject) => {
      const config = {
        serviceAccount: {
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY
        },
        databaseURL: process.env.FIREBASE_DATABASE_URL
      };
      firebase.initializeApp(config);
      resolve(firebase);
    }
  );
}
