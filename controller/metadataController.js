
const fs = require('fs/promises');
const Metadata = require('../db/models/metadata')
const path = require('path')

exports.update = async (req, res) => {
    try {
        const {id, name, cover, type, synopsis, rating, creator, genre, releaseYear} = req.body
        if (!id) {
            return res.status(400).json({msg: 'O campo "id" é obrigatório para a atualização.'});
        }

        // Obtenha os metadados atuais antes da atualização
        const metadataToUpdate = await Metadata.findById(id);
        if (!metadataToUpdate) {
            return res.status(404).json({ msg: 'Documento não encontrado para o ID fornecido.' });
        }

        // Obtenha o caminho da imagem anterior
        const previousCoverPath = metadataToUpdate.cover;
        
        const metaUpdate = {};
        if(req.file){metaUpdate.cover = req.file.filename} //se tiver imagem salva o caminho

        if (name) {metaUpdate.name = name;} 
        if (type) { metaUpdate.type = type;}    
        if (synopsis) {metaUpdate.synopsis = synopsis;}     
        if (rating) {metaUpdate.rating = rating;}      
        if (creator) { metaUpdate.creator = creator;}
        if (genre) {metaUpdate.genre = genre;}
        if (releaseYear) { metaUpdate.releaseYear = releaseYear;}

        const updatedMetadata = await Metadata.findByIdAndUpdate(id, metaUpdate, { new: true });

        // Remova a imagem anterior do sistema de arquivos
        if (req.file && previousCoverPath) {
            try {
                await fs.unlink(path.join(__dirname, '../public/covers', previousCoverPath));
                return res.status(200).json({ msg: 'Atualizado com sucesso!', data: updatedMetadata });
            } catch (unlinkError) {
                console.error('Erro ao excluir a imagem anterior:', unlinkError);
                return res.status(404).json({msg: 'Documento não encontrado para o ID fornecido.' });
            }
        }

        if (updatedMetadata) {
            return res.status(200).json({ msg: 'Atualizado com sucesso!', data: updatedMetadata });
        } else {
            return res.status(404).json({msg: 'Documento não encontrado para o ID fornecido.' });
        }



        
    } catch (error) {
        console.error(error);
        res.status(500).json(error.message || 'Ocorreu um erro durante a atualização.');
    }
};



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

exports.getId = async (req, res) => {
    try {
        console.log('okokokokok');
        const id = req.body.id;

        if (!id) {
            return res.status(400).json({ error: 'ID is required in the request body' });
        }

        const metadata = await Metadata.findById(id);

        if (!metadata) {
            return res.status(404).json({ error: 'Metadata not found' });
        }

        res.status(200).json(metadata);
    } catch (error) {
        console.error('Error in getId:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
};


exports.renderUpdate = async (req, res) =>{
    const metadataList = await Metadata.find().select('name _id');
    
    res.render('updateMetadata', {metadataList: metadataList})
}

