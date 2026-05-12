const path = require('path');

const defaultUploadsDirectory = path.join(__dirname, '..', 'uploads');

const uploadDirectory = process.env.UPLOAD_DIR
  ? path.resolve(process.env.UPLOAD_DIR)
  : defaultUploadsDirectory;

module.exports = {
  uploadDirectory,
};
