
require('dotenv').config()
const User = require('../db/models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')


exports.register = async (req, res) =>{
    const {name, email, password} = req.body


    // criar senha hash
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
        name: name,
        email: email,
        password: passwordHash
    })

    newUser.save()
    .then((doc)=>{
        
        // criar e assinar token
        const secret = process.env.SECRET;
        const token = jwt.sign({ id: newUser._id }, secret);

        return res.status(200).json({msg: 'Usuario registrado com sucesso!: ' + doc, token})
    })
    .catch((err)=>{
       return res.status(400).json({msg: 'Erro ao registar usuario: ' + err})
    })
}


exports.login = async (req, res) => {
    const {email} = req.body
	const UserLogin = await User.findOne({email: email})

    //gerar token
    const secret = process.env.SECRET
    const token = jwt.sign(
        {
            id: UserLogin._id
        }, secret
    )


    return res.status(200).json({msg: 'Autenticação realizada com sucesso!', token})
}

exports.loginFront = async (req, res) => {
    return res.render('login')
}
exports.registerFront = async (req, res) => {
    return res.render('register')
}


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
  
  