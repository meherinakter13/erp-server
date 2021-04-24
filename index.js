const express = require('express')
const mysql = require('mysql')
const Define = require('./Define')
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
const port = process.env.PORT || 5000

const pool = mysql.createPool({
  connectionLimit: 15,
  host: 'localhost',
  user: 'root',
  password: '17203028',
  database: 'erp-management'
})


// signup/create
app.post('/addUser', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)

    const userRecord = req.body

    connection.query('INSERT INTO users SET ?', userRecord, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`user with the name ${[userRecord.name]} has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})


//login( email,password,department)
app.post('/login', (req, res) => {
  const { email, password, department } = req.body
  const sql = `select * from users where email=? and password = ? and department = ?`
  pool.query(sql, [email, password, department], (err, results) => {
    if (err) {
      res.send({ error: true, msg: 'user login failed' })
    } else {
      if (results[0]) {
        res.send({ error: false, msg: 'user login success', data: results[0] })
      } else {
        res.send({ error: true, msg: 'user login failed' })
      }
    }
  })
})


// // get all user ()
// app.get('/user', (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) throw err
//     console.log(`connected as id ${connection.threadId}`)

//     connection.query('SELECT * from users', (err, rows) => {
//       connection.release()
//       if (!err) {
//         res.send(rows)
//       }
//       else {
//         console.log(err)
//       }
//     })
//   })
// })

// // get single user
// app.get('/user/:id', (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) throw err
//     console.log(`connected as id ${connection.threadId}`)

//     connection.query('SELECT * from users WHERE id = ?', [req.params.id], (err, rows) => {
//       connection.release()
//       if (!err) {
//         res.send(rows)
//       }
//       else {
//         console.log(err)
//       }
//     })
//   })
// })

// // Update single user
// app.put('/updateUser', (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) throw err
//     console.log(`connected as id ${connection.threadId}`)

//     const { id, name, email, password, designation, department } = req.body;
//     connection.query('UPDATE users SET name = ?, email= ?, password = ?, designation = ?, department = ? WHERE id = ?', [id, name, email, password, designation, department], (err, rows) => {
//       connection.release()
//       if (!err) {
//         res.send(`user with the name ${name} has been updated`)
//       }
//       else {
//         console.log(err)
//       }
//     })
//     console.log(req.body);
//   })
// })



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`listening the port :${port}`)
})