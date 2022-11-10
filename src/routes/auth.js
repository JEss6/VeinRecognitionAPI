import pool from '../database/database';
import serverConfig from '../config/serverConfig';
import express from 'express';

const router = express.Router();

/**
 * @swagger
 * paths:
 *  /api/Authenticate/checkIDDuplication?userID={userID}:
 *    get:
 *      summary: "아이디 중복 여부 조회"
 *      description: ""
 *      parameters:
 *        - in: query
 *          name: userID
 *          type: string
 *          required: true
 *          description: 유저 아이디
 *          schema:
 *            type: string
 *      tags: [Authenticate]
 *      responses:
 *        "200":
 *          description: Success
 *          schema:
 *            properties:
 *              isDuplicated:
 *                type: boolean
 *        "400":
 *          description: Request Failed
 */
router.get('/checkIDDuplication', async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    try {
      let sql = `select * from USER_INFO where id = '${req.query.userID}'`;
      if (serverConfig.SQL_DEBUG) console.log(sql);
      let result = await connection.query(sql);
      if (serverConfig.RESULT_DEBUG) console.log(result[0]);
      if (result[0].length !== 0) {
        res.status(200).send({ isDuplicated: true });
      } else {
        res.status(200).send({ isDuplicated: false });
      }
    } catch (err) {
      if (serverConfig.ERROR_DEBUG) console.log(err);
      res.status(400).send('Error');
    }
    await connection.release();
  } catch (err) {
    if (serverConfig.ERROR_DEBUG) console.log(err);
    res.status(400).send('Error');
  }
});

/**
 * @swagger
 * paths:
 *  /api/Authenticate/login:
 *    post:
 *      summary: "로그인"
 *      description: ""
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters: [
 *        {
 *          "in": "formData",
 *          "name": "userID",
 *          "description": "유저 아이디",
 *          "required": true,
 *        },
 *        {
 *          "in": "formData",
 *          "name": "password",
 *          "description": "유저 패스워드(SHA-512 Encrypted)",
 *          "required": true,
 *        }
 *      ]
 *      tags: [Authenticate]
 *      responses:
 *        "200":
 *          description: Success
 *          schema:
 *            properties:
 *              user_index:
 *                type: integer
 *              id:
 *                type: string
 *              password:
 *                type: string
 *        "400":
 *          description: 비밀번호가 맞지 않거나, 사용자가 존재하지 않음
 *        "401":
 *          description: 그 외 에러
 */
router.post('/login', async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const body = req.body;
    try {
      let sql = `select ui.user_index, ui.id, ui.password, ui.name, uj.name as jobName, up.name as positionName, ui.entryDate from USER_INFO ui 
      inner join USER_JOB uj on uj.id = ui.job 
      inner join USER_POSITION up on up.id = ui.position
      where ui.id = "${body['id']}" and ui.password = "${body["password"]}"`; // 
      if (serverConfig.SQL_DEBUG) console.log(sql);
      let result = await connection.query(sql);
      if (serverConfig.RESULT_DEBUG) console.log(result[0]);
      if (result[0].length == 1) {
        res.status(200).send(result[0]);
      } else {
        res.status(401).send();
      }
    } catch (err) {
      if (serverConfig.ERROR_DEBUG) console.log(err);
      res.status(400).send();
    }
    await connection.release();
  } catch (err) {
    if (serverConfig.ERROR_DEBUG) console.log(err);
    res.status(400).send();
  }
});

/**
 * @swagger
 * paths:
 *  /api/Authenticate/register:
 *    post:
 *      summary: "회원가입"
 *      description: ""
 *      consumes:
 *        - application/x-www-form-urlencoded
 *      parameters: [
 *        {
 *          "in": "formData",
 *          "name": "id",
 *          "type": "string",
 *          "description": "유저 아이디",
 *          "required": true,
 *        },
 *        {
 *          "in": "formData",
 *          "name": "password",
 *          "type": "string",
 *          "description": "유저 패스워드(SHA-512 Encrypted)",
 *          "required": true,
 *        },
 *        {
 *          "in": "formData",
 *          "name": "name",
 *          "type": "string",
 *          "description": "유저 이름",
 *          "required": true,
 *        },
 *        {
 *          "in": "formData",
 *          "name": "phoneNumber",
 *          "type": "string",
 *          "description": "유저 생일",
 *          "required": true,
 *        },
 *        {
 *          "in": "formData",
 *          "name": "gender",
 *          "type": "tinyint",
 *          "description": "유저 성별(0=남자 / 1=여자)",
 *          "required": true,
 *        },
 *        {
 *          "in": "formData",
 *          "name": "email",
 *          "type": "string",
 *          "description": "유저 메일 주소",
 *          "required": true,
 *        },
 *        {
 *          "in": "formData",
 *          "name": "grade",
 *          "type": "integer",
 *          "description": "유저 등급(권한)",
 *          "required": true,
 *        },
 *        {
 *          "in": "formData",
 *          "name": "loginFrom",
 *          "type": "integer",
 *          "description": "로그인 수단(Default, Kakao, etc..)",
 *          "required": true
 *        }
 *      ]
 *      tags: [Authenticate]
 *      responses:
 *        "200":
 *          description: Success
 *          schema:
 *            properties:
 *              user_index:
 *                type: integer
 *              id:
 *                type: string
 *              password:
 *        "400":
 *          description: 비밀번호가 맞지 않거나, 사용자가 존재하지 않음
 *        "401":
 *          description: 그 외 에러
 */
router.post('/register', async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const body = req.body;
    try {
      let sql = `insert into USER_INFO(id, password, name , phoneNumber, birthday, gender, email, grade, loginFrom) values \
      ('${body['id']}','${body['password']}','${body['name']}','${body['phoneNumber']}' \
      ,${body['birthday']},${body['gender']},'${body['email']}',${body['grade']},${body['loginFrom']})`;
      if (serverConfig.SQL_DEBUG) console.log(sql);
      let result = await connection.query(sql);
      if (serverConfig.RESULT_DEBUG) console.log(sql);
      res.status(201).send('Success');
    } catch (err) {
      if (serverConfig.ERROR_DEBUG) console.log(err);
      res.status(401).send('');
    }
    await connection.release();
  } catch (err) {
    if (serverConfig.ERROR_DEBUG) console.log(err);
    res.status(400).send('');
  }
});

router.put('/updateUser', async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const body = req.body;
    try {
      let sql = `update USER_INFO set Something 
      where user_index = ${body['user_index']}`;
      if (serverConfig.SQL_DEBUG) console.log(sql);
      const result = await connection.query(sql);
      if (serverConfig.RESULT_DEBUG) console.log(result[0]);
      res.status(200).send();
    } catch (err) {
      if (serverConfig.ERROR_DEBUG) console.log(err);
      res.status(400).send();
    }
    await connection.release();
  } catch (err) {
    if (serverConfig.ERROR_DEBUG) console.log(err);
    res.status(400).send();
  }
});

router.delete('/deleteUser/:user_index', async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    try {
      let sql = `delete from USER_INFO where user_index = ${req.params.user_index}`;
      if (serverConfig.SQL_DEBUG) console.log(sql);
      const result = await connection.query(sql);
      if (serverConfig.RESULT_DEBUG) console.log(result[0]);
      res.status(200).send();
    } catch (err) {
      if (serverConfig.ERROR_DEBUG) console.log(err);
      res.status(400).send();
    }
    await connection.release();
  } catch (err) {
    if (serverConfig.ERROR_DEBUG) console.log(err);
    res.status(400).send();
  }
});

/**
 * @swagger
 * paths:
 *  /api/Authenticate/getUserInfo?id={id}:
 *    post:
 *      summary: "유저 정보 조회"
 *      description: ""
 *      parameters:
 *        - in: query
 *          name: id
 *          type: string
 *          required: true
 *          description: 유저 아이디
 *          schema:
 *            type: string
 *      tags: [Authenticate]
 *      responses:
 *        "200":
 *          description: Success
 */
router.post('/getUserInfo', async (req, res, next) => {
  let pool = getRDBPool();
  try {
    const connection = await pool.getConnection(async (conn) => conn);
    const body = req.body;
    try {
      await connection.beginTransaction();
      let sql = `select ui.*, ug.gradeName, lm.loginMethod, g.genderName, di.name as doctorName, dp.name as doctorPosition, hi.name as hospitalName, 
			c.name as characteristic,
			(select cf.field_name from USER_CURIOUS uc 
			inner join CURIOUS_FIELD cf on cf.field_id = uc.curious_index 
			where uc.user_index  = ui.user_index limit 1) as userCurious 
			from USER_INFO ui 
			inner join USER_GRADE ug on ug.gradeCode = ui.grade 
			inner join LOGIN_METHOD lm on lm.loginCode = ui.loginFrom 
			inner join GENDER g on g.genderCode = ui.gender 
			inner join CHARACTERISTIC c on c.id = ui.characteristic 
			left join DOCTOR_INFO di on di.id = ui.mainDoctor 
			left join DOCTOR_POSITION dp on dp.id = di.id 
			left join HOSPITAL_INFO hi on hi.id = di.hospital_id  
			where ui.id = '${body['userID']}'`;
      if (DEBUG) console.log(sql);
      let result = await connection.query(sql);
      pool.end();
      res.status(200).send(result[0]);
    } catch (err) {
      console.log(err);
      res.status(500).send('fail');
    }
  } catch (err) {
    console.log(err);
    res.status(500).send('fail');
  }
});

router.post('/verifyUser', async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const body = req.body;
    try {
      const sql = `select user_index from USER_INFO where id = '${body['id']}' and password = '${body['password']}'`;
      if (serverConfig.SQL_DEBUG) console.log(sql);
      const result = await connection.query(sql);
      if (serverConfig.RESULT_DEBUG) console.log(result[0]);
      if (result[0].length != 0) {
        res.status(200).send();
      } else {
        res.status(401).send();
      }
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
    await connection.release();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

router.put('/updateUserInfo', async (req, res, next) => {
  try {
    const connection = await pool.getConnection();
    const body = req.body;
    try {
      const sql = `update USER_INFO set email='${body['email']}', password='${
        body['password']
      }', phoneNumber='${body['phoneNumber']}', 
       address='${body['address']}' where user_index = ${
        body[['user_index']]
      };`;
      if (serverConfig.SQL_DEBUG) console.log(sql);
      const result = await connection.query(sql);
      if (serverConfig.RESULT_DEBUG) console.log(result[0]);
      res.status(200).send();
    } catch (err) {
      console.log(err);
      res.status(500).send();
    }
    await connection.release();
  } catch (err) {
    console.log(err);
    res.status(500).send();
  }
});

module.exports = router;
