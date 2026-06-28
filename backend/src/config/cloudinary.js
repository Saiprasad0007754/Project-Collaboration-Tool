const cloudinary = require('cloudinary').v2;
const env = require('./env');
const logger = require('./logger');

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Uploads a file buffer or local path to Cloudinary.
 * @param {string} filePathOrBase64 - Local file path or base64 data URI.
 * @param {object} options - Additional Cloudinary upload options (e.g. folder).
 * @returns {Promise<object>} Cloudinary upload result.
 */
const uploadToCloudinary = async (filePathOrBase64, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(filePathOrBase64, {
      folder: options.folder || 'project-collab-tool',
      resource_type: options.resourceType || 'auto',
      ...options,
    });
    return result;
  } catch (error) {
    logger.error(`Cloudinary upload failed: ${error.message}`);
    throw error;
  }
};

/**
 * Deletes an asset from Cloudinary by its public_id.
 * @param {string} publicId
 * @param {object} options
 */
const deleteFromCloudinary = async (publicId, options = {}) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: options.resourceType || 'image',
    });
    return result;
  } catch (error) {
    logger.error(`Cloudinary deletion failed: ${error.message}`);
    throw error;
  }
};

module.exports = { cloudinary, uploadToCloudinary, deleteFromCloudinary };
