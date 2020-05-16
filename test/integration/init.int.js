const { MongoMemoryServer } = require('mongodb-memory-server');

mongoServer = new MongoMemoryServer();
mongoServer.getUri().then(mongoUri => {
  process.env.MONGODB_URI = mongoUri;
  app = require('../../app');
  run();
});

after(async () => {
  await mongoServer.stop();
});
