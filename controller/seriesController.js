const fs = require('fs');
const path = require('path');
const rangeParser = require('range-parser');

const Serie = require('../db/models/serie')
const Metadata = require('../db/models/metadata')

//ASSISTIR
exports.play = async (req, res) => {
  const id = req.params.id;
  const episode = await Serie.findById(id);
  if(!episode){
    return res.status(404).json({ error: 'Episodio não encontrado' });
  }


  try {

    // const videoPath = 'videos/series/' + episode.file 
    const videoPath = path.join('D:', 'midia-server', 'series', episode.file);
    const stat = fs.statSync(videoPath);
    const fileSize = stat.size;

    const range = req.headers.range || 'bytes=0-';
    const positions = rangeParser(fileSize, range, { combine: false })[0];
    const start = positions.start;
    const end = positions.end;

    const chunkSize = Math.min(1024 * 1024, end - start + 1);

    const stream = fs.createReadStream(videoPath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': 'video/mp4',
      'Cache-Control': 'public, max-age=3600', // Ajustado para 1 hora
    });

    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).send('Internal Server Error');
  }
}

//PAGINAÇÃO DE SERIES
exports.page = async (req, res) => {
  try {
    const page = parseInt(req.params.page);

    if (isNaN(page)) {
      return res.status(400).json({ msg: "Invalid page number" });
    }

    const itemsPerPage = 10;
    const skip = (page - 1) * itemsPerPage;

    const seriesPage = await Metadata.find({type: "serie"}).skip(skip).limit(itemsPerPage);

    res.status(200).json(seriesPage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
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


//PEGAR INFORMAÇÕES DA SERIE
exports.getData = async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch metadata based on id
    const metadataSerie = await Metadata.findById(id);
    const nameMetadata = metadataSerie.name.toLocaleLowerCase().replace(/'/, '').replace(/:/, '').trim()


    if (!metadataSerie) {
      return res.status(404).json({ error: 'Metadados não encontrados' });
    }

    // Use the actual name directly without JSON.stringify

    const episodes = await Serie.find({ name: nameMetadata }).exec();
    const organizedData = episodes.reduce((acc, episode) => {
      const seasonKey = `${episode.season}`;
      acc[seasonKey] = acc[seasonKey] || [];
      acc[seasonKey].push({
         _id: episode._id,
        // type: episode.type,
        // name: episode.name,
        // season: episode.season,
        episode: episode.episode,
        // extension: episode.extension,
        file: episode.file,
        // __v: episode.__v
      });
      return acc;
    }, {});

    res.json({ metadata: metadataSerie, season: organizedData  });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erro do Servidor Interno' });
  }
};