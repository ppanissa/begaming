const Env = use('Env');

module.exports = {
  files: {
    views: Env.get('NODE_ENV') !== 'development',
  },
};
