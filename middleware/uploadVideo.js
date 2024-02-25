const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configuração do storage do Multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        console.log('Destination function');
        const dest = path.join(__dirname, '../videos');

        // Cria o diretório se não existir
        if (!fs.existsSync(dest)) {
            fs.mkdirSync(dest, { recursive: true });
        }

        console.log('Destination:', dest);
        cb(null, dest);
    },
    filename: function (req, file, cb) {
        // Obtém a extensão do arquivo original
        const originalExtension = path.extname(file.originalname);

        // Cria o novo nome do arquivo com o timestamp e a extensão original
        const newFileName = Date.now() + originalExtension;

        console.log('Filename function');
        console.log('New Filename:', newFileName);

        cb(null, newFileName);
    }
});

// Configuração do Multer
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1024 * 5 // Limite de 5gb (ajuste conforme necessário)
    },
    fileFilter: function (req, file, cb) {
        const allowedTypes = /mp4|avi|mkv|mov/;

        // Verifica se a extensão e o tipo de mídia são permitidos
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);

        if (extname && mimetype) {
            console.log('FileFilter function - File allowed');
            cb(null, true);
        } else {
            // Se não for permitido, rejeita o arquivo
            console.log('FileFilter function - File rejected');
            cb(new Error('Vídeos são permitidos!'));
        }
    }
}).single('video');

module.exports = (req, res, next) => {
    console.log('Middleware de upload iniciado');
    upload(req, res, (err) => {
        if (err) {
            console.error('Erro durante o upload:', err.message);
            return res.status(400).json({ error: err.message });
        }

        console.log('Upload concluído com sucesso!');
        // Chama next() para passar para o próximo middleware ou rota
        next();
    });
};
