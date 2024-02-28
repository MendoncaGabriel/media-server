
module.exports =  async function test(options) {
  const { itemTest, nameItem,  file, reference, view } = options;
  const cor = itemTest ? '\x1b[32m' : '\x1b[31m';

  if (typeof itemTest !== 'object' || itemTest === null || Array.isArray(itemTest)) {
   await  console.log(`${cor}[ ( ${nameItem}: ${itemTest ? 'pass' : 'fail'} ) | ${view ? itemTest : ''} | ref: ${file}/${reference} ]\x1b[0m`);

  } else {
    await console.log(`${cor}[ ( ${nameItem}: ${itemTest ? 'pass' : 'fail'} ) | ${view ? itemTest : '-'} | ref: ${file}/${reference} ]\x1b[0m`);
  }

  
}
