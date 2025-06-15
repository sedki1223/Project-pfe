const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json'); // Replace with your real path

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});
module.exports = admin;
