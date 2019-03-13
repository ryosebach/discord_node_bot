FROM node:10.2.1

EXPOSE 3000

ARG NODE_ENV
ENV NODE_ENV $NODE_ENV

# UTCからJSTに変更します
RUN ln -sf  /usr/share/zoneinfo/Asia/Tokyo /etc/localtime

RUN apt-get update
RUN apt-get install -y \
        libpng-dev \
        libjpeg-dev \
        libtiff5-dev \
        libfreetype6-dev \
        graphicsmagick-imagemagick-compat \
        gconf-service \
        libasound2 \
        libatk1.0-0 \
        libc6 \
        libcairo2 \
        libcups2 \
        libdbus-1-3 \
        libexpat1 \
        libfontconfig1 \
        libgcc1 \
        libgconf-2-4 \
        libgdk-pixbuf2.0-0 \
        libglib2.0-0 \
        libgtk-3-0 \
        libnspr4 \
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
        ca-certificates \
        fonts-liberation \
        libappindicator1 \
        libnss3 \
        lsb-release \
        xdg-utils \
        wget

ADD . /opt/discord-bot/
WORKDIR /opt/discord-bot/

RUN npm install
RUN npm i puppeteer
RUN npm run build

CMD npm run start
