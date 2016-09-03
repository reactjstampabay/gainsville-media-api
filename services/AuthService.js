var log = require('winston');

module.exports = {
  validate: validate
};

function validate(token) {
  return new Promise(
    function(resolve, reject) {
      redisClient.multi()
        .select(redisConfig.databases.tokens)
        .hget(token, 'userId')
        .execAsync()
        .then(function(res) {
          // Check for doctoring
          if (res[1]) {
            log.info(res[1] + ' validated for media upload');
            return resolve();
          } else {
            return reject(new Error('You are not authorized to perform that action'));
          }
        })
        .catch(function(err) {
          return reject(err);
        });
    }
  );
}