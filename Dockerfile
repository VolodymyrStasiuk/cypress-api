FROM cypress/base:10.18.0

RUN mkdir /app
WORKDIR /app
COPY . /app

RUN npm install --save-dev cypress
RUN $(npm bin)/cypress verify
RUN ["npx cypress run"]