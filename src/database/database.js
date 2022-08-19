import mysql from 'mysql2/promise';
import serverConfig from '../config/serverConfig';

const dbConfig = {
  host: serverConfig.host,
  port: serverConfig.port,
  user: serverConfig.user,
  password: serverConfig.password,
  database: serverConfig.database,
  multipleStatements: true,
};

module.exports = mysql.createPool(dbConfig);
