import pool from '../database/database';
import serverConfig from '../config/serverConfig';
import express from 'express';

const router = express.Router();

router.get('/getPrescription', async (req, res, next) => {
  const connection = await pool.getConnection();
  try{
    const sql = `select d.index as diagnosis_id, p.id as patient_id, p.name, p.age, d.location, d.eventDate, pre.addDateTime , pre.sap ,pre.syringe ,pre.zelco ,pre.alcoholSwap ,pre.tape ,pre.tourniquet , 
    pre.threeWay , pre.extentionTube, pre.finish from PRESCRIPTION as pre
        inner join DIAGNOSIS as d on pre.diagnosis_id = d.index 
        inner join PATIENT as p on p.id = d.id 
        where 1 order by addDateTime`
        if(serverConfig.SQL_DEBUG) console.log(sql);
    const result = await connection.query(sql);
    res.status(200).send(result[0]);
    await connection.release();
  }catch (err){
    if(serverConfig.ERROR_DEBUG) console.log(err);
    res.status(500).send();
  }
})

router.post('/insertPrescription', async (req, res, next) => {
  const connection = await pool.getConnection();
  const body = req.body;
  try{
    const sql = `insert into PRESCRIPTION(diagnosis_id, sap, syringe, alcoholSwap, zelco, tape, tourniquet, threeWay, extentionTube, finish, addDateTime) 
    values (${body["diagnosis_id"]}, ${body['sap']}, ${body['syringe']}, ${body['alcoholSwap']}, ${body['zelco']}, ${body['tape']} 
    , ${body['tourniquet']}, ${body['threeWay']}, ${body['extentionTube']}, 0, '${body['insertDate']}')`;
    if(serverConfig.SQL_DEBUG) console.log(sql);
    const result = await connection.query(sql);
    res.status(201).send(result[0]);
    await connection.release();
  }catch(err){
    if(serverConfig.ERROR_DEBUG) console.log(err);
    res.status(500).send();
  }
})

module.exports = router;