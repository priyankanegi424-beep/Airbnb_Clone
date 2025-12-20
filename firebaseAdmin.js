const admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert(require("./firebase-service.json"))
});

module.exports = admin;
