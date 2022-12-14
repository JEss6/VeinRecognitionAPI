import express, { query } from 'express';
import bodyparser from 'body-parser';
import http from 'http';
import https from 'https';
import fs from 'fs';
// import { connect } from 'http2';
// import { swaggerUi, specs } from './swagger/swagger';
// import pool from './database/database';
import serverConfig from './config/serverConfig';
import authRouter from './routes/auth';
import noticeRouter from './routes/notice';
import prescriptionRouter from './routes/prescription'
import intravenousRouter from './routes/intravenous'

const app = express();

const options = {
  key: fs.readFileSync('auth/vein-recognition.key'),
  cert: fs.readFileSync('auth/vein-recognition.crt'),
};
const httpsServer = https.createServer(options, app);
const httpServer = http.createServer(app);

app.use(function(req, res, next) { res.header("Access-Control-Allow-Origin", "*");    res.header("Access-Control-Allow-Headers", "X-Requested-With");    res.header("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE");    next();});
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

app.use('/sksksk', function (req, res, next) {
  console.log(req.path);
  res.redirect(`/imgs${req.path}`);
});

app.use('/imgs', express.static(__dirname + '/../upload_imgs'));

/**
 * @swagger
 * tags:
 *   name: Authenticate
 *   description: 인증에 관련된 API입니다.
 */
app.use('/api/Authenticate', authRouter);

app.use('/api/Notice', noticeRouter);
app.use('/api/Prescription', prescriptionRouter);
app.use('/api/Intravenous', intravenousRouter)
// app.use('/api/Notice', noticeRouter);

httpServer.listen(25493, '0.0.0.0', () => {
  console.log('Database Server Opened!');
});
