
const { getApps } = require('firebase-admin/app');
const { getAuth } = require('firebase-admin/auth');
require('../config/firebaseAdmin');
const ApiError = require('../utils/ApiError');
const asyncHandler = require('../utils/asyncHandler');

/**
 * Verifies the Firebase ID token sent by the frontend as:
 *   Authorization: Bearer <idToken>
 *
 * On success, attaches a normalized user object to req.user:
 *   { uid, email, name, picture }
 *
 * This is what lets the Project controller know who is creating/reading/
 * updating/deleting a project, without the backend needing its own
 * separate login system — Firebase remains the single source of truth
 * for identity.
 */
const verifyFirebaseToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers.authorization || '';
  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) {
    throw ApiError.unauthorized('Missing or malformed Authorization header.');
  }

 if (getApps().length === 0)  {
    throw ApiError.internal(
      'Server authentication is not configured. Firebase Admin credentials are missing.'
    );
  }

  try {
   const decoded = await getAuth().verifyIdToken(token);

    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      name: decoded.name || null,
      picture: decoded.picture || null,
    };

    next();
  } catch (error) {
  console.error("Firebase Error:", error);
  throw ApiError.unauthorized('Invalid or expired authentication token.');
}
});

module.exports = verifyFirebaseToken;
