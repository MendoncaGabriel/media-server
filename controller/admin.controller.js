//### CONTROLLER ADMIN ###


//SCHEMAS DATABASE
const MetadataSchema = require('../db/models/metadata.schema') 
const SerieSchema = require('../db/models/serie.schema')
const FilmSchema = require('../db/models/film.schema')
const UserSchema = require('../db/models/user.schema')

const fs = require('fs');
const path = require('path');
const rangeParser = require('range-parser');
const { promisify } = require('util');
const readdir = promisify(fs.readdir);
//--------------------------------------------------------------------


exports.dataRefresh = async (req, res) => {
  try {

    //BUSCAR MEDATADOS CADASTRADOS
    const metadados = await MetadataSchema.find();

    for (const element of metadados) {
      if(element.type == 'serie'){
        //FORMATAR NOME PARA NOME DA PASTA
        const nameFolder = element.name.toLowerCase().replace(/[^a-z0-9- ]/g, '').replace(/\s+/g, '-').trim();
        //CAMINHO PARA SERIE ESPECIFICA
        const seriePath = path.join(`${element.disc}:`, 'media-server', `${element.type}`, `${nameFolder}`);


        //LISTAR TEMPORADAS
        const seasons = await readdir(seriePath);

        if(seasons.length > 0){
          //LISTAR EPISODIOS
          seasons.forEach(async (se) => {
            const seasonPath = path.join(`${element.disc}:`, 'media-server', `${element.type}`, `${nameFolder}`, `${se}`);
            const videos = await readdir(seasonPath)
  
            console.log( `SERIES: ${nameFolder} - TEMPORADA: ${se} - EPISODIOS: ${videos.length > 0 ? videos : 'SEM EPISODIOS!'} ` )
          })
  
        }else{
          console.log('Sem temporadas')
        }

      }else if(element.type == 'film'){
        //CAMINHO PARA FILMES
        const filmPath = path.join(`${element.disc}:`, 'media-server', `${element.type}`);

        //LISTAR FILMES
        const films = await readdir(filmPath);

        films.forEach(film => {
          const caminhoCompletoFilm = `${filmPath}\\${film}`
          console.log( caminhoCompletoFilm )

        })


      }else{
        return res.status(422).json({msg: 'Tipo não definido', element})
      }
     






    }

    res.status(200).json({ msg: "ok" });
  } catch (error) {
    console.error('Erro durante a execução:', error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}