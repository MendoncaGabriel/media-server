
const Metadata = require('../db/models/metadata')



exports.register = async (req, res) => {
    try {
        const { name, type, releaseYear, genre, creator, rating, synopsis } = req.body;

        // Adicione o caminho do arquivo ao objeto req.body
        const coverPath = req.file ? req.file.path : ''; // Certifique-se de que req.file está disponível

        // Extraia apenas o nome do arquivo do caminho
        const coverFileName = req.file ? req.file.filename : '';

        const newMetaData = new Metadata({ name, type, releaseYear, genre, creator, rating, synopsis, cover: coverFileName });

        const newMetadata = await newMetaData.save();

        if (newMetadata) {
            res.send('Cadastro realizado com sucesso! ' + newMetadata);
        }
    } catch (error) {
        res.status(500).send(error.message);
    }
};

exports.get = async  (req, res) => {
    const name = req.params.name
    const metadata = await Metadata.findOne({name: name})

    if(metadata){
        res.status(200).json(metadata)
    }else{
        res.status(404).json({msg: 'Não encontrado!'})   
    }
}
