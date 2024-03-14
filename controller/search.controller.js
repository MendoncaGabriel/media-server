const MetadataSchema = require('../db/models/metadata.schema')

exports.search = async (req, res) => {
  try {
    const termoPesquisa = req.body.arguments;
    console.log(termoPesquisa);

    // Função para escapar caracteres especiais
    const escapeRegex = (text) => {
      return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
    };

    // Usar expressão regular para buscar semelhanças
    const pesquisaRegex = new RegExp(escapeRegex(termoPesquisa), 'i');
    console.log(pesquisaRegex);

    // Criar índice de texto se ainda não existir
    await MetadataSchema.ensureIndexes();

    // Realizar a pesquisa no banco de dados e limitar a 20 resultados
    const resultados = await MetadataSchema.find({ $text: { $search: termoPesquisa } }).limit(20);
    console.log(resultados);

    res.json(resultados);
  } catch (erro) {
    res.status(500).json({ msg: 'Erro interno servidor | searchController' });
  }
};
  

exports.searchItem = async (req, res) =>{
  const termoPesquisa = req.params.arguments

  // Função para escapar caracteres especiais
  const escapeRegex = (text) => {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
  };

  // Usar expressão regular para buscar semelhanças
  const pesquisaRegex = new RegExp(escapeRegex(termoPesquisa), 'i');

  // Criar índice de texto se ainda não existir
  await MetadataSchema.ensureIndexes();

  // Realizar a pesquisa no banco de dados e limitar a 20 resultados
  const resultados = await MetadataSchema.find({ $text: { $search: termoPesquisa } }).limit(20);

  if(resultados.length > 0){

    res.render('resultSearch', {seriesPage: resultados , arguments: termoPesquisa})
  }else{
    res.render('resultSearch', {seriesPage: resultados , arguments: termoPesquisa, msg: 'Não encontrado :('})

  }
}