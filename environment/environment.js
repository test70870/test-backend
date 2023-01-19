const environment = {
  app_name: process.env.NODE_ENV === 'production' ? 'Test_Backend' : 'Test_Backend',
  dbUrl: 'mongodb+srv://chatApp:N4dbapIYcIX56Mfq@chatappcluster.m1lspob.mongodb.net/?retryWrites=true&w=majority',
};

module.exports = environment;
