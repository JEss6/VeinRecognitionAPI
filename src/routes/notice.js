import pool from '../database/database';
import serverConfig from '../config/serverConfig';
import express from 'express';

const router = express.Router();

router.get('/getRecentNotice', async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    try {
      const sql = `select n.id, n.title, n.content, n.idOpened, n.insertDate, ui.name as uploaderName from NOTICE n 
      inner join USER_INFO ui on ui.user_index = n.uploader 
      order by n.insertDate desc limit ${req.query.num_of_data}`;
      if (serverConfig.SQL_DEBUG) console.log(sql);
      const result = await connection.query(sql);
      if (serverConfig.RESULT_DEBUG) console.log(result[0]);
      res.status(200).send(result[0]);
    } catch (err) {
      if (serverConfig.ERROR_DEBUG) console.log(err);
      res.status(401).send();
    }
    await connection.release();
  } catch (err) {
    if (serverConfig.ERROR_DEBUG) console.log(err);
    res.status(500).send();
  }
});

router.get('/getRecentPrimaryNotice', async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    try {
      const sql = `select n.id as noticeID, n.content, n.idOpened, n.insertDate, ui.name from NOTICE n 
        inner join USER_INFO ui on ui.user_index = n.uploader 
        where n.isPrimary is true 
        order by n.insertDate desc limit ${req.query.num_of_data}`;
      if (serverConfig.SQL_DEBUG) console.log(sql);
      const result = await connection.query(sql);
      if (serverConfig.RESULT_DEBUG) console.log(result[0]);
      res.status(200).send(result[0]);
    } catch (err) {
      if (serverConfig.ERROR_DEBUG) console.log(err);
      res.status(401).send();
    }
    await connection.release();
  } catch (err) {
    if (serverConfig.ERROR_DEBUG) console.log(err);
    res.status(500).send();
  }
});

router.post('/insertNotice', async (req, res, next) => {
  try{
    const connection = await pool.getConnection();
    const body = req.body;
    const sql = `insert into NOTICE(title, content, uploader, isPrimary, idOpened) values ('${body["title"]}', '${body["content"]}', 
    ${body["uploader"]}, ${body["isPrimary"]}, ${body["idOpened"]});`
    if(serverConfig.SQL_DEBUG) console.log(sql);
    const result = await connection.query(sql);
    if(serverConfig.RESULT_DEBUG) console.log(result[0]);
    res.status(201).send();
  }catch(err){
    if(serverConfig.ERROR_DEBUG) console.log(err);
    res.status(500).send();
  }
})

module.exports = router;
