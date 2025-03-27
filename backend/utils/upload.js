const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

// Configura lo storage di Cloudinary
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'blog_images', // Nome della cartella su Cloudinary
    allowed_formats: ['jpg', 'jpeg', 'png'], // Formati consentiti
  },
});

const upload = multer({ storage });

module.exports = upload;