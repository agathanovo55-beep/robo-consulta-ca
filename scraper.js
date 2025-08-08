// scraper.js - VERSÃO DE TESTE (SIMULADA)
async function consultarCA(numeroCA) {
  console.log(`[SCRAPER SIMULADO] Recebido pedido para o CA: ${numeroCA}`);
  await new Promise(resolve => setTimeout(resolve, 3000));
  if (numeroCA === "12345") {
    console.log("[SCRAPER SIMULADO] Retornando dados de SUCESSO de exemplo.");
    return {
      'Nº do CA': '12345 (DADO DE TESTE)',
      'Data de Validade': '01/01/2099',
      'Situação': 'Válido (TESTE)',
      'Equipamento': 'Equipamento de Teste Fictício',
      'Fabricante': 'Empresa Teste LTDA'
    };
  } else {
    console.log("[SCRAPER SIMULADO] Retornando mensagem de ERRO de exemplo.");
    return { erro: `O CA "${numeroCA}" não foi encontrado (este é um teste).` };
  }
}
module.exports = { consultarCA };