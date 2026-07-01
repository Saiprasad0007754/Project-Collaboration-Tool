const { initializeApp, cert, getApps } = require('firebase-admin/app');
const admin = require('firebase-admin');
const env = require('./env');
const logger = require('./logger');

if (getApps().length === 0) {
  const hasCredentials =
    env.FIREBASE_PROJECT_ID &&
    env.FIREBASE_CLIENT_EMAIL &&
    env.FIREBASE_PRIVATE_KEY;

  if (hasCredentials) {
    try {
      initializeApp({
        credential: cert({
          projectId: env.FIREBASE_PROJECT_ID,
          clientEmail: env.FIREBASE_CLIENT_EMAIL,
          privateKey: env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }),
      });

      logger.info('Firebase Admin SDK initialized.');
    } catch (error) {
      logger.error(
        `Firebase Admin SDK failed to initialize: ${error.message}`
      );
    }
  } else {
    logger.warn(
      'Firebase Admin credentials are missing. Protected routes will reject requests until they are configured.'
    );
  }
}

module.exports = admin;