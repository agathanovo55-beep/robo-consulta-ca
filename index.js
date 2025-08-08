// index.js
const venom = require('venom-bot');
const { consultarCA } = require('./scraper');

venom
  .create({
    session: 'consulta-ca-mte',
    catchQR: (base64Qr, asciiQR) => {
      console.log(asciiQR);
      console.log('Leia o QR Code com o WhatsApp para conectar.');
    },
    logQR: false,
  })
  .then((client) => start(client))
  .catch((erro) => { console.log(erro); });

function start(client) {
  console.log('[BOT] Cliente Venom iniciado com sucesso! Aguardando mensagens...');
  client.onMessage(async (message) => {
    if (message.isGroupMsg) { return; }
    const textoMensagem = message.body.trim().toLowerCase();
    let resposta = null;
    const matchCA = textoMensagem.match(/^(ca)\s*(\d+)$/);

    if (matchCA) {
      const numeroCA = matchCA[2];
      await client.sendText(message.from, `🔍 Consultando o CA *${numeroCA}*... Por favor, aguarde, isso pode levar alguns segundos.`);
      const dados = await consultarCA(numeroCA);
      if (dados.erro) {
        resposta = dados.erro;
      } else {
        resposta = `*✅ Resultado da Consulta do CA: ${dados['Nº do CA']}*\n\n` +
                   `*Data de Validade:* ${dados['Data de Validade']}\n` +
                   `*Situação:* ${dados['Situação']}\n` +
                   `*Equipamento:* ${dados['Equipamento']}\n\n` +
                   `*Fabricante:* ${dados['Fabricante']}`;
      }
    } else if (textoMensagem === 'oi' || textoMensagem === 'olá' || textoMensagem === 'ola') {
        resposta = 'Olá! Para consultar um Certificado de Aprovação, envie uma mensagem no formato: *CA 12345*';
    }

    if (resposta) {
      try {
        await client.sendText(message.from, resposta);
      } catch (error) {
        console.error('[ERRO AO ENVIAR]', error);
      }
    }
  });
}