const express = require('express')
const mysql = require('mysql')
const Define = require('./Define')
const cors = require('cors')
const fileUpload = require('express-fileupload');
const app = express()

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())
app.use(fileUpload());
const port = process.env.PORT || 5000

const pool = mysql.createPool({
  connectionLimit: 15,
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'erp-management'
})
// img upload
app.post('/upload', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)

    // const image = req.files.file;
    // const measurement = req.body.measurement;
    // const fabric = req.body.fabric;
    // console.log(file, measurement, fabric);

    const {
      measurement,
      fabric,
      img_url  }=req.body
    
   

    connection.query('INSERT INTO samples SET ?', {
      image:img_url,
      fabric:fabric,
      measurement:measurement
    }, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`user with the name has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// get all order -----------------------------------------------
app.get('/sample', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from samples', (err, rows) => {
      connection.release()
      if (!err) {
        res.send(rows)
      }
      else {
        console.log(err)
      }
    })
  })
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

// ----------------orders----------------------
// add all order----------------------------------------
app.post('/addOrder', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const orderRecord = req.body
    connection.query('INSERT INTO orders SET ?', orderRecord, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`user with the name ${[orderRecord.productName]} has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// get all order -----------------------------------------------
app.get('/order', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from orders', (err, rows) => {
      connection.release()
      if (!err) {
        res.send(rows)
      }
      else {
        console.log(err)
      }
    })
  })
})
// get single user
app.get('/order/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)

    connection.query('SELECT * from orders WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(rows)
      }
      else {
        console.log(err)
      }
    })
  })
})

// Update single order -----------------------------------------
app.put('/updateOrder', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const { id, orderDate, deliveryDate, measurement, color, quantity, totalAmount, productName } = req.body;
    connection.query('UPDATE orders SET orderDate = ?, deliveryDate= ?, measurement = ?, color = ?, quantity = ?, totalAmount = ?, productName = ? WHERE id = ?', [id, orderDate, deliveryDate, measurement, color, quantity, totalAmount, productName], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`order with the name ${productName} has been updated`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// delete single order-----------------------------------------------
app.delete('/deleteOrder/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('DELETE from orders WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`order with the id ${[req.params.id]} has been removed`)
      }
      else {
        console.log(err)
      }
    })
  })
})
//                                ----------------suppliers----------------------
// add all supplier----------------------------------------
app.post('/addSupplier', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const supplierRecord = req.body
    connection.query('INSERT INTO suppliers SET ?', supplierRecord, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`supplier with the name ${[supplierRecord.name]} has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// get all supplier -----------------------------------------------
app.get('/supplier', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from suppliers', (err, rows) => {
      connection.release()
      if (!err) {
        res.send(rows)
      }
      else {
        console.log(err)
      }
    })
  })
})
// get single supplier
app.get('/supplier/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from suppliers WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(rows)
      }
      else {
        console.log(err)
      }
    })
  })
})
// Update single supplier -----------------------------------------
app.put('/updateSupplier', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const { id, companyName, name, email, materialName, quantity, totalAmount, orderDate, deliveryDate } = req.body;
    connection.query('UPDATE suppliers SET  companyName = ?, name = ?, email = ?, materialName = ?, quantity = ?, totalAmount = ?, orderDate = ?, deliveryDate= ? WHERE id = ?', [id, companyName, name, email, materialName, quantity, totalAmount, orderDate, deliveryDate ], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`supplier with the name ${productName} has been updated`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// delete single order-----------------------------------------------
app.delete('/deleteSupplier/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('DELETE from suppliers WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`supplier with the id ${[req.params.id]} has been removed`)
      }
      else {
        console.log(err)
      }
    })
  })
})




app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`listening the port :${port}`)
})