const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccount.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "cosmetics-9eb81.firebasestorage.app" // Replace with your Firebase Storage bucket URL
});

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
