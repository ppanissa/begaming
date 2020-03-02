'use strict';

const Env = use('Env');

module.exports = {
  // redis connection
  connection: Env.get('BULL_CONNECTION', 'bull'),
  bull: {
    redis: {
      host: Env.get('BULL_HOST', '127.0.0.1'),
      port: Env.get('BULL_PORT', 6379),
      password: Env.get('BULL_PASSWORD', null),
      db: 1,
      keyPrefix: Env.get('BULL_PREFIX', ''),
    },
  },
  remote: Env.get(
    'BULL_REMOTE',
    'redis://redis.example.com?password=correcthorsebatterystaple',
  ),
};
