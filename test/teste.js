const request = require('supertest');
const app = require('../app'); // Importe o seu aplicativo Express
const path = require('path');

describe('Testes para a rota page', () => {
  it('Deve retornar status 200 e uma mensagem de sucesso quando os itens são cadastrados corretamente', async () => {
    const response = await request(app)
      .post('/auth/register') // Substitua pela rota real
      .expect(200);

    expect(response.body.msg).toBe('Itens Cadastrados');
    expect(response.body.itensCadastrados.length).toBeGreaterThan(0);
  });

  it('Deve retornar status 422 e uma mensagem de erro quando o nome do arquivo está incorreto', async () => {
    const response = await request(app)
      .post('/serie/page/1') // Substitua pela rota real
      .expect(422);

    expect(response.body.msg).toBe('nome do arquivo está incorreto ( serie+nome-da-serie+se1+ep1.mp4 )');
  });

  // Adicione mais testes conforme necessário
});
