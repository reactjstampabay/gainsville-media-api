const log = require('winston');

module.exports = {
  validate: validate
};

function validate(token) {
  return new Promise(
    (resolve, reject) => {
      infrastructure.firebase.auth().verifyIdToken(token)
        .then(profile => {
          resolve();
        })
        .catch(err => {
          reject({responseCode: 401, error: JSON.stringify(err)});
        });
    }
  );
}