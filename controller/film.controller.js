//### CONTROLLER FILM ###


//SCHEMAS DATABASE
const MetadataSchema = require('../db/models/metadata.schema') 
const SerieSchema = require('../db/models/serie.schema')
const FilmSchema = require('../db/models/film.schema')
const UserSchema = require('../db/models/user.schema')

const fs = require('fs');
const path = require('path');
const rangeParser = require('range-parser');

//--------------------------------------------------------------------

//ASSISTIR
exports.play = async (req, res) => {
  const id = req.params.id;
  const episode = await Film.findById(id);
  if(!episode){
    return res.status(404).json({ error: 'Episodio não encontrado' });
  }


  try {

    const videoPath = 'videos/films/' + episode.file 
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

//PAGINAÇÃO DE FILMES - ok
exports.page = async (req, res) => {
  try {
    const page = parseInt(req.params.page);

    if (isNaN(page)) {
      return res.status(400).json({ msg: "Invalid page number" });
    }

    const itemsPerPage = 10;
    const skip = (page - 1) * itemsPerPage;

    const filmsPage = await Metadata.find({type: 'film'}).skip(skip).limit(itemsPerPage);

    res.status(200).json(filmsPage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

//SALVAR ARQUIVOS NO BANCO DE DADOS - ok
exports.saveFilm = async (req, res) => {
  const pasta = path.join(__dirname, '..', 'videos', 'films');
  
  const parseFilename = (filename) => {
    const regex = /^(?<type>serie|film)\+(?<name>[^+]+)\.(?<extension>(mp4|mkv|rmvb))$/;

    const match = filename.match(regex);

    if (match) {
      const { type, name, extension } = match.groups;

      // Remover traços do nome
      const cleanedName = name.replace(/-/g, ' ');

      // Criar a propriedade "file" com o nome original
      const file = `${type}+${name}.${extension}`;

      return {
        type,
        name: cleanedName,
        extension,
        file,
      };
    } else {
      return null;
    }
  };

  // Lê o conteúdo do diretório
  const arquivosDaPasta = await listarArquivos(pasta);

  // Transformar nome dos arquivos em JSON
  const arquivosJson = arquivosDaPasta.map(parseFilename).filter(Boolean);

  const films = await Film.find();
  const cadastrar = [];

  // Verificar se itens precisam ser cadastrados
  for (const element of arquivosJson) {
    const registro = films.find(e => e.file === element.file);

    if (!registro) {
      // Verificar se todas as propriedades foram reconhecidas
      if (element.type !== 'film' || !element.name) {
        return res.status(422).json({ item: element, msg: 'Nome do arquivo está incorreto (film+nome-do-filme.mp4)' });
      } else {
        cadastrar.push(element);
      }
    }
  }

  // Salvar itens no banco de dados
  if (cadastrar.length > 0) {
    const itensCadastrados = [];

    for (const element of cadastrar) {
      itensCadastrados.push(element);
      const newFilm = new Film({
        type: element.type,
        name: element.name,
        extension: element.extension,
        file: element.file,
      });

      await newFilm.save();
    }

    return res.status(200).json({ msg: 'Itens Cadastrados', itensCadastrados });
  } else {
    return res.status(200).json({ msg: 'Nenhum vídeo foi salvo' });
  }

  async function listarArquivos(pasta) {
    return new Promise((resolve, reject) => {
      fs.readdir(pasta, (err, arquivos) => {
        if (err) {
          reject({ msg: 'Erro ao ler o diretório:', err });
        }

        resolve(arquivos);
      });
    });
  }
};

//BUSCAR DADOS  - ok
exports.getData = async (req, res) => {
  try {
    const id = req.params.id;

    // Fetch metadata based on id
    const metadataFilm = await Metadata.findById(id);
    if (!metadataFilm) {
      return res.status(404).json({ error: 'Metadados não encontrados' });
    }

    // Fetch film data based on metadata name
    const dataFilm = await Film.findOne({ name: metadataFilm.name });
    if (!dataFilm) {
      return res.status(404).json({ error: 'Filme não encontrado' });
    }

    let filme = {
      _id: dataFilm._id,
      file: dataFilm.file,
    };

    res.json({ metadata: metadataFilm, filme: filme });
  } catch (error) {
    res.status(500).json({ error: 'Erro do Servidor Interno' });
  }
};
