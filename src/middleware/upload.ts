import multer, { MulterError } from 'multer';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 30 * 1024 * 1024,
  },
  fileFilter: (_req, file, cb) =>{
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if(!allowedTypes.includes(file.mimetype)){
      const err = new MulterError('LIMIT_UNEXPECTED_FILE');
      err.message = 'Only JPEG, JPG, or PNG files are allowed';
      return cb(err);
    }
    cb(null, true);
  },
});

export default upload;
