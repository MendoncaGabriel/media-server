// middleware
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const dest = path.join(__dirname, '../media/series');
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }
        console.log('Destination:', dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        //cb(null, Date.now());
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 5 // Limite de 5gb (ajuste conforme necessário)
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /mp4|avi|mkv|mov/; // Adicione os tipos de vídeo desejados
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            cb(null, true);
        } else {
            cb(new Error('Vídeos são permitidos!'));
        }
    }
}).single('video');  // Alteração aqui

module.exports = upload;
