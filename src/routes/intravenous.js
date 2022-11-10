import pool from '../database/database';
import serverConfig from '../config/serverConfig';
import express from 'express';

const router = express.Router();

router.get('/getIntravenous', async (req, res, next) => {
  const connection = await pool.getConnection();
  try{
    const sql = `select d.index as diagnosis_id, p.id as patient_id, p.name, p.age, d.location, d.eventDate, i.addDateTime, i.bodyDirection , i.bodyPart ,i.niddleSize ,i.treatMaterial ,i.etcWork ,i.bloodDVA ,i.bloodTryNum , 
    i.injectMethod , i.dvaSort,i.additionalRecord, i.finish from INTRAVENOUS as i
        inner join DIAGNOSIS as d on i.diagnosis_id = d.index 
        inner join PATIENT as p on p.id = d.id 
        where 1 order by addDateTime`
        if(serverConfig.SQL_DEBUG) console.log(sql);
    if(serverConfig.SQL_DEBUG) console.log(sql);
    const result = await connection.query(sql);
    await connection.release();
    res.status(200).send(result[0]);
  }catch (err){
    if(serverConfig.ERROR_DEBUG) console.log(err);
    res.status(500).send();
  }
})

router.post('/insertIntravenous', async (req, res, next) => {
  const connection = await pool.getConnection();
  const body = req.body;
  try{
    const sql = `insert into INTRAVENOUS(diagnosis_id, bodyDirection, bodyPart, niddleSize, treatMaterial, etcWork, bloodDVA, bloodTryNum, injectMethod, dvaSort, additionalRecord, finish, addDateTime) 
    values (${body["diagnosis_id"]}, '${body['bodyDirection']}', '${body['bodyPart']}', '${body['niddleSize']}', '${body['treatMaterial']}', '${body['etcWork']}' 
    , '${body['bloodDVA']}', ${body['bloodTryNum']}, '${body['injectMethod']}','${body['dvaSort']}', '${body['additionalRecord']}', 0, '${body['insertDate']}')`;
    if(serverConfig.SQL_DEBUG) console.log(sql);
    const result = await connection.query(sql);
    await connection.release();
    res.status(201).send(result[0]);
  }catch(err){
    if(serverConfig.ERROR_DEBUG) console.log(err);
    res.status(500).send();
  }
})

module.exports = router;