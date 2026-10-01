const multer = require('multer');
const path = require('path');
const fs = require('fs');

const createStorage = (folderPath) => {
  return multer.diskStorage({
    destination(req, file, cb) {
      const uploadPath = path.join(process.env.UPLOAD_PATH || './uploads', folderPath);
      fs.mkdirSync(uploadPath, { recursive: true });
      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });
};

const fileFilter = (req, file, cb) => {
  const allowedFileTypes = /jpeg|jpg|png|webp/;
  const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedFileTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error('Images only (jpeg, jpg, png, webp)'));
  }
};

const uploadProductImage = multer({
  storage: createStorage('products'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
}).single('image');

const uploadPaymentScreenshot = multer({
  storage: createStorage('payments'),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter
}).single('screenshot');

module.exports = {
  uploadProductImage,
  uploadPaymentScreenshot
};
