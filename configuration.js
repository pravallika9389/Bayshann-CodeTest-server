var configuration = {
  server: {
    // port that this sever will listen on
    port: 9064,
    },
  mongo: {
    development: {connectionString: 'mongodb://localhost/Bayshann',},
    test: {connectionString: 'mongodb://localhost/Bayshann',},
    production: {connectionString: 'mongodb://<pravallika.ragipani@gmail.com>:<pp65794276>@ds211558.mlab.com:11558/bayshann',},
  },
  inputFilePath : "./test/resources/output.json"
};

module.exports = {configuration};
