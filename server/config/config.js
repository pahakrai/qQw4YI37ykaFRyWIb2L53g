var app = {
  development: {
    db: 'mongodb://localhost/aftershipchallenge',
    port: process.env.PORT || 8080
  },
  production: {
    db: 'mongodb://pahakrai:aftership@ds045622.mongolab.com:45622/aftershipchallenge',
    port: process.env.PORT || 80

  }

}

module.exports = app;
