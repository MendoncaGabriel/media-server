// middleware
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('teste')
        const dest = path.join(__dirname, '../public/images');
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        const originalExtension = path.extname(file.originalname);
        const newFileName =  Date.now() + originalExtension;
        cb(null, newFileName);
    }
});

const uploadMiddleware = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // Limite de 5MB (ajuste conforme necessário)
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /jpeg|jpg|png|gif/;
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Apenas imagens são permitidas!'));
        }
    }
}).single('image');

module.exports = uploadMiddleware;
