# Usar uma imagem oficial do Node.js
FROM node:18-slim

# Adicionado para evitar que pacotes peçam interação durante a instalação
ENV DEBIAN_FRONTEND=noninteractive

# Instalar as dependências necessárias para o Puppeteer
RUN apt-get update && apt-get install -y \
    ca-certificates \
    fonts-liberation \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcairo2 \
    libcups2 \
    libdbus-1-3 \
    libexpat1 \
    libfontconfig1 \
    libgbm1 \
    libgcc1 \
    libgdk-pixbuf2.0-0 \
    libglib2.0-0 \
    libgtk-3-0 \
    libnspr4 \
    libnss3 \
    libpango-1.0-0 \
    libpangocairo-1.0-0 \
    libstdc++6 \
    libx11-6 \
    libx11-xcb1 \
    libxcb1 \
    libxcomposite1 \
    libxcursor1 \
    libxdamage1 \
    libxext6 \
    libxfixes3 \
    libxi6 \
    libxrandr2 \
    libxrender1 \
    libxss1 \
    libxtst6 \
    lsb-release \
    wget \
    xdg-utils \
    --no-install-recommends

# Define o diretório de trabalho
WORKDIR /usr/src/app

# Copia os arquivos de configuração do Node.js
COPY package*.json ./

# Diz ao npm para NÃO baixar o Chrome, pois já instalamos no sistema
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

# Instala as dependências do Node.js (agora será mais rápido)
RUN npm install

# Copia o resto do código da aplicação
COPY . .

# Comando para iniciar a aplicação
CMD [ "node", "index.js" ]