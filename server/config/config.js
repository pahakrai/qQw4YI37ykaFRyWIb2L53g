var app = {
  development: {
    db: 'mongodb://localhost/newscloud',
    port: process.env.PORT || 8080
  },
  production: {
    db: 'mongodb://pahak:newscloud@ds061278.mongolab.com:61278/newscloud',
    port: process.env.PORT || 80

  }

}

module.exports = app;
