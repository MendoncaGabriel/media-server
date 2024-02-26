const express = require('express')
const router = express.Router()
const fs = require('fs');
const path = require('path');
const Serie = require('../db/models/serie')

router.get('/:folder', async (req, res)=>{
    const folder = req.params.folder
    const pasta = path.join(__dirname, '..', 'videos', folder);
    
    const parseFilename = (filename) => {
        const regex = /^(?<type>serie|filme)\+(?<name>[^+]+)(?:\+se(?<season>\d+))?(?:\+ep(?<episode>\d+))?\.(?<extension>mp4)$/;
        
        const match = filename.match(regex);
        
        if (match) {
            const { type, name, season, episode, extension } = match.groups;
            
            // Remover traços do nome
            const cleanedName = name.replace(/-/g, ' ');
            
            // Criar a propriedade "file" com o nome original
            const file = `${type}+${name}+se${season}+ep${episode}.${extension}`;
            
            return {
                type,
                name: cleanedName,
                season: season ? parseInt(season) : null,
                episode: episode ? parseInt(episode) : null,
                extension,
                file,
            };
        } else {

            return filename; 
        }
    };

    // Lê o conteúdo do diretório
    let arquivosFim = [];
    async function listarArquivos(pasta) {
        return new Promise((resolve) => {
          fs.readdir(pasta, (err, arquivos) => {
            if (err) {
              return res.status(404).send({msg: 'Erro ao ler o diretório:', err});
            }
      
            arquivos.forEach((arquivo) => {
              arquivosFim.push(arquivo);
            });
      
            resolve();
          });
        });
    }
    await listarArquivos(pasta)
      

    //transformar nome dos arquivos em json
    const filesJson = arquivosFim.map(element =>{
        return parseFilename(element)
    })


    
    const series = await Serie.find();
    
    const cadastrar = []
    let ocorrencia = false
    
    //verificarer se itens precisam ser cadastrados 
    filesJson.forEach(async element =>{
        const registro = series.find(e => e.file == element.file)

        if(!registro){
            //verificar se todos as propriedades foram reconhecidas
            if(!element.type || !element.name || !element.season || !element.episode){
                return ocorrencia = element
            }else{
                //se tiver todoas as propriedades legiveis então pode ser cadastrada
                cadastrar.push(element)
            }
        }
    })

    if(ocorrencia != false){
        return res.status(422).json({item: ocorrencia, msg: 'nome do arquivo esta incorreto ( serie+nome-da-serie+se1+ep1.mp4 )'});
    }



    //cadastar itens
    if(cadastrar.length > 0){
        const itensCadastrados = []

        cadastrar.forEach(async(element)=>{
            itensCadastrados.push(element)
            const newEpisode = new Serie({
                type: element.type,
                name: element.name,
                season: element.season,
                episode: element.episode,
                extension: element.extension,
                file: element.file,
            })
            await newEpisode.save()
    
        })

        return res.status(200).json({msg: 'Itens Cadastrados', itensCadastrados});
        


    }else{
        return res.status(200).json({msg: 'Nenhum video foi salvo'});
    }
        
})

module.exports = router