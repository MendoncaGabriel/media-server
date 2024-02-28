//### CONTROLLER METADATA ###


//SCHEMAS DATABASE
const MetadataSchema = require('../db/models/metadata.schema') 
const SerieSchema = require('../db/models/serie.schema')
const FilmSchema = require('../db/models/film.schema')
const UserSchema = require('../db/models/user.schema')

const fs = require('fs/promises');
const path = require('path')
const Metadata = require('../db/models/metadata.schema')
//--------------------------------------------------------------------



//SALVAR METADADOS
exports.newMetadata = async (req, res) => {
    const imageCover = req.file ? req.file.filename : ''
    const { name, type, releaseYear, genre, creator, rating, synopsis, disc } = req.body;

    try {
        const newMetaData = new Metadata({ name, type, releaseYear, genre, creator, rating, synopsis, disc, image:  '/images/' + imageCover });
        const doc = await newMetaData.save();

        if (doc) {
            res.status(200).json({msg: 'Cadastro realizado com sucesso!', doc})
        }
    } catch (error) {

        res.status(500).send(error.message);
    }
}

//ATUALIZAR METADADOS
exports.update = async (req, res) => {
    try {
        const {id, name, image, type, synopsis, rating, creator, genre, releaseYear} = req.body
        if (!id) {
            return res.status(400).json({msg: 'O campo "id" é obrigatório para a atualização.'});
        }

        // Obtenha os metadados atuais antes da atualização
        const metadataToUpdate = await Metadata.findById(id);
        if (!metadataToUpdate) {
            return res.status(404).json({ msg: 'Documento não encontrado para o ID fornecido.' });
        }

        // Obtenha o caminho da imagem anterior
        const previousCoverPath = metadataToUpdate.image;
        
        const metaUpdate = {};
        if(req.file){metaUpdate.image = '/images/' + req.file.filename} //se tiver imagem salva o caminho

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
                const fullPath = path.join(__dirname, '../public', previousCoverPath.replace(/\\/g, '/'));

                await fs.unlink(fullPath);
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
}

//PEGAR METADADOS POR NOME
exports.get = async  (req, res) => {
    const name = req.params.name
    const metadata = await Metadata.findOne({name: name})
    
    if(metadata){
        res.status(200).json(metadata)
    }else{
        res.status(404).json({msg: 'Não encontrado!'})   
    }
}

//PEGAR METADADOS POR ID
exports.getId = async (req, res) => {
    try {

        const id = req.params.id;

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
}

