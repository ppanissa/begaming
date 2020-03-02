const Bull = use('Rocketseat/Bull');
const Env = use('Env');

const portUi = Env.get('NODE_ENV') === 'testing' ? 9998 : 10000;

Bull.process()
  // Optionally you can start BullBoard:
  .ui(portUi); // http://localhost:9999
// You don't need to specify the port, the default number is 9999
