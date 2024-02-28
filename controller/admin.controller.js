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
const metadataSchema = require('../db/models/metadata.schema');
const readdir = promisify(fs.readdir);
//--------------------------------------------------------------------

//ROTA 100% FUNCIONAL
exports.dataRefresh = async (req, res) => {
  try {
    const listForSave = [];
    const listForSaveFilm = []

    // BUSCAR METADADOS CADASTRADOS
    const metadados = await MetadataSchema.find();

    //BUSCAR ARQUIVOS SALVOS NA PASTA
    for (const element of metadados) {
      if (element.type === 'serie') {
        // FORMATAR NOME PARA NOME DA PASTA
        const nameFolder = element.name.toLowerCase().replace(/[^a-z0-9- ]/g, '').replace(/\s+/g, '-').trim();

        // CAMINHO PARA SERIE ESPECIFICA
        const seriePath = path.join(`${element.disc}:`, 'media-server', element.type, nameFolder);

        // LISTAR TEMPORADAS
        const seasons = await readdir(seriePath);

        if (seasons.length > 0) {
          // LISTAR EPISODIOS
          for (const se of seasons) {
            const seasonNumber = Number(se.replace('se', ''));

            const seasonPath = path.join(`${element.disc}:`, 'media-server', element.type, nameFolder, se);
            const videos = await readdir(seasonPath);

            for (const ep of videos) {
              const caminhoCompletoEpisodioSerie = path.join(seasonPath, ep);
              const regex = /ep(\d+)(?:\..+)?$/;
              const match = ep.match(regex);
    

              if (match) {
                const episodeNumber = Number(match[1]);

                listForSave.push({
                  type: element.type,
                  name: element.name,
                  season: seasonNumber,
                  episode: episodeNumber,
                  file: caminhoCompletoEpisodioSerie,
                });
              }
            }
          }
        } else {
          console.log('Sem temporadas');
        }
      } else if (element.type === 'film') {
        // CAMINHO PARA FILMES
        const filmPath = path.join(`${element.disc}:`, 'media-server', element.type);

        // LISTAR FILMES
        const films = await readdir(filmPath);

        for (const film of films) {
          const caminhoCompletoFilm = path.join(filmPath, film);
          //REMOVE EXTENÇÃO DO ARQUIVO
          const nomeSemExtensao = film.split(".")[0].replace(/-/g, ' ').trim();


          listForSaveFilm.push({
            type: element.type,
            name: nomeSemExtensao,
            file: caminhoCompletoFilm,
          })
        }
      } else {
        return res.status(422).json({ msg: 'Tipo não definido', element });
      }
    }


    /////////////SINCRONIZAR SERIES
    const seriesInDataBase = await SerieSchema.find();

    // Itens salvos no banco de dados mas não localmente - REMOVER DA BASE DE DADOS
    const itemsToRemove = seriesInDataBase.filter(existingElement =>
      !listForSave.some(element => element.file === existingElement.file)
    );
    
    for (const item of itemsToRemove) {
      // Implemente a lógica para remover o item da base de dados
      await SerieSchema.findOneAndDelete({ file: item.file });
      console.log(`Episódio removido do banco de dados: ${item.file}`);
    }


    // Itens salvos localmente mas não no banco de dados - SALVAR NA BASE DE DADOS
    const itemsToSave = listForSave.filter(element =>
      !seriesInDataBase.some(existingElement => existingElement.file === element.file)
    );
    
    for (const item of itemsToSave) {
      // Implemente a lógica para salvar o item na base de dados
      const newEpisode = new SerieSchema(item);
      await newEpisode.save();
      console.log(`Episódio adicionado ao banco de dados: ${item.file}`);
    }

    //////////////////////SINCRONIZAR FILMES
    const filmInDataBase = await FilmSchema.find();

    // Filmes salvos no banco de dados mas não localmente - REMOVER DA BASE DE DADOS
    const filmsToRemove = filmInDataBase.filter(existingFilm =>
      !listForSaveFilm.some(localFilm => localFilm.file === existingFilm.file)
    );

    for (const film of filmsToRemove) {
      // Implemente a lógica para remover o filme da base de dados
      await FilmSchema.findOneAndDelete({ file: film.file });
      console.log(`Filme removido do banco de dados: ${film.file}`);
    }

    // Filmes salvos localmente mas não no banco de dados - SALVAR NA BASE DE DADOS
    const filmsToSave = listForSaveFilm.filter(localFilm =>
      !filmInDataBase.some(existingFilm => existingFilm.file === localFilm.file)
    );

    for (const film of filmsToSave) {
      // Implemente a lógica para salvar o filme na base de dados
      const newFilm = new FilmSchema(film);
      await newFilm.save();
      console.log(`Filme adicionado ao banco de dados: ${film.file}`);
    }



    
    return res.json({msg:'ARQUIVOS SINCRONIZADOS COM A BASE DE DADOS'})
 
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};



//SALVAR ARQUIVOS NO BANCO DE DADOS
exports.saveSerie = async (req, res)=>{
  const pasta = path.join(__dirname, '..', 'videos', 'series');

  const parseFilename = (filename) => {
    const regex = /^(?<type>serie|filme)\+(?<name>[^+]+)(?:\+se(?<season>\d+))?(?:\+ep(?<episode>\d+))?\.(?<extension>(mp4|mkv|rmvb))$/;
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
  }


  // Lê o conteúdo do diretório
  let arquivosDaPasta = [];
  async function listarArquivos(pasta) {
      return new Promise((resolve) => {
        fs.readdir(pasta, (err, arquivos) => {
          if (err) {
            return res.status(404).send({msg: 'Erro ao ler o diretório:', err});
          }
    
          arquivos.forEach((arquivo) => {
              arquivosDaPasta.push(arquivo);
          });
    
          resolve();
        });
      });
  }
  await listarArquivos(pasta)
    

  //transformar nome dos arquivos em json
  const arquivosJson = arquivosDaPasta.map(element =>{
    return parseFilename(element)
  })


  const series = await Serie.find();
  const cadastrar = []
  const apagar = []
  let ocorrencia = false
  

  //verificarer se itens precisam ser cadastrados 
  arquivosJson.forEach(async element =>{
    const registro = series.find(e => e.file == element.file)

    if(!registro){
      //verificar se todos as propriedades foram reconhecidas
      if(!element.type || element.type !== 'serie' || !element.name || !element.season || !element.episode){
        return ocorrencia = element
      }else{
        cadastrar.push(element)
      }
    }
  })


  // Verificar vídeos salvos no banco de dados mas não salvos em arquivos
  const videosNoArquivosJson = series.filter(element => !arquivosJson.some(e => e.file === element.file));

  if (videosNoArquivosJson.length > 0) {
    // Usando Promise.all para lidar com operações assíncronas
    await Promise.all(videosNoArquivosJson.map(async (element) => {
      await Serie.findByIdAndDelete(element._id);
    }));
  }



  if(ocorrencia != false){
    return res.status(422).json({item: ocorrencia, msg: 'nome do arquivo esta incorreto ( serie+nome-da-serie+se1+ep1.mp4 )'});
  }


  //salvar itens no banco de dados
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
  }else if(videosNoArquivosJson.length > 0){

    return res.status(200).json({msg: 'Alguns dados foram apagados na base de dados pois não estavam salvas em arquivo'});
  }
  else{
    return res.status(200).json({msg: 'Nenhum video foi salvo'});
  } 
}

