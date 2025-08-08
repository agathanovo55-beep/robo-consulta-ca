// scraper.js - VERSÃO FINAL OTIMIZADA
const puppeteer = require('puppeteer');

async function consultarCA(numeroCA) {
  console.log(`[SCRAPER] Iniciando consulta para o CA: ${numeroCA}`);
  const browser = await puppeteer.launch({
    headless: 'new',
    // Aponta para o Chrome instalado pelo nosso Dockerfile
    executablePath: '/usr/bin/chromium',
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--single-process', // Apenas um processo para o navegador
      '--disable-gpu'
    ],
  });
  const page = await browser.newPage();
  try {
    // Aumentamos o tempo máximo de espera para 90 segundos
    await page.goto('https://caepi.mte.gov.br/internet/consultacainternet.aspx', { waitUntil: 'networkidle2', timeout: 90000 });
    await page.type('#txtNumeroCA', numeroCA);
    await page.click('#btnConsultar');
    // Aumentamos o tempo máximo de espera para a navegação também
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 90000 });
    const mensagemErro = await page.$('#lblMensagem');

    if (mensagemErro) {
      const textoErro = await page.evaluate(el => el.textContent, mensagemErro);
      if (textoErro.includes('nenhum Equipamento de Proteção Individual')) {
        await browser.close();
        return { erro: `O CA "${numeroCA}" não foi encontrado ou não existe.` };
      }
    }

    const dadosCA = await page.evaluate(() => {
      const tabela = document.querySelector('#gridDados');
      if (!tabela) return null;
      const linhas = tabela.querySelectorAll('tr');
      const dados = {};
      linhas.forEach(linha => {
        const celulas = linha.querySelectorAll('td.rotulo_ca_internet, td.ca_internet');
        if (celulas.length === 2) {
          const chave = celulas[0].innerText.trim().replace(':', '');
          const valor = celulas[1].innerText.trim();
          dados[chave] = valor;
        }
      });
      return dados;
    });
    await browser.close();

    if (!dadosCA) { throw new Error('Tabela de dados não encontrada na página.'); }
    return dadosCA;
  } catch (error) {
    console.error('[SCRAPER] Erro durante a busca:', error);
    await browser.close();
    return { erro: 'Ocorreu um erro ao tentar consultar o CA. O site do MTE pode estar instável ou o tempo de espera esgotou.' };
  }
}

module.exports = { consultarCA };