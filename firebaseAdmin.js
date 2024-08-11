const admin = require('firebase-admin');
const path = require('path');
const serviceAccountPath = path.join(__dirname, 'config', 'email-53d16-firebase-adminsdk-ao5sf-e5cdfd4363.json');

const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    // databaseURL is not needed for Firestore
});

module.exports = admin;
