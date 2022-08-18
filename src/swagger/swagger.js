import swaggerUi from 'swagger-ui-express';
import swaggereJsdoc from 'swagger-jsdoc';
import fs from 'fs';

// console.log(fs.readdirSync('./src'));
const options = {
  swaggerDefinition: {
    info: {
      title: 'Daily Hanbang API',
      version: '1.0.01',
      description: '매일 한방의 API 목록입니다.\nAPI는 변경될 수 있습니다.',
    },
    basePath: '/',
  },
  apis: ['./src/routes/*.js', './src/app.js'],
};

const specs = swaggereJsdoc(options);

module.exports = {
  swaggerUi,
  specs,
};
