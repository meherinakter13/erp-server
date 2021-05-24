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
// get user/buyer--------------------------

app.get('/buyers', (req, res) => {

  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT * from users where department = "Buyer"`, (err, rows) => {
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
// delete sample----------------
app.delete('/deleteBuyer/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('DELETE from users WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`buyer with the id ${[req.params.id]} has been removed`)
      }
      else {
        console.log(err)
      }
    })
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
// -----------------------------sample upload--------------------------------------
app.post('/upload', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
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
        res.send(`sample with the name has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// get all sample -----------------------------------------------
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
// delete sample----------------
app.delete('/deleteSample/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('DELETE from samples WHERE id = ?', [req.params.id], (err, rows) => {
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
// update sample-----------------

// -----------------------------------------------orders-------------------------------------------------
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
// get single order
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
// add order status------------------------------ (marchandiser)---------------------------------
app.post('/addStatus/:id', (req, res) => {
  const orderId = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
  //   const {
  //     confirm
  //  }=req.body
    
    connection.query('INSERT INTO orderstatus SET ?',{
      order_id: orderId,
      status: "confirm"

    }
      , (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`product with the name has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
app.get('/status/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from orderstatus',[req.params.id], (err, rows) => {
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
// ---------------------------------get all final product result---------------------------------------
app.get('/get_all_orders', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT *
    FROM orders
    INNER JOIN orderstatus
    ON orders.id = orderstatus.order_id
    ;`, (err, rows) => {
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
// delete single supplier-----------------------------------------------
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
// ---------------------------------------------final sample------------------------------------------------
// add final sample image and measurement-------------------(sample)----------------------------------------
app.post('/addFSampleImg/:id', (req, res) => {
  const sampleId = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const {
      img_url, 
      measurement }=req.body
    
    connection.query('INSERT INTO finalsample SET ?', {
      s_id: sampleId,
      image:img_url,
      measurement:measurement
   
    }, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`sample with the name has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// delete image and measurement
app.delete('/deleteImg/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('DELETE from finalsample WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`sample with the id ${[req.params.id]} has been removed`)
      }
      else {
        console.log(err)
      }
    })
  })
})
// get all sample image -----------------------------------------------
app.get('/fSample', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from finalsample', (err, rows) => {
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
// add sample time and cost --------------------------------(IE)---------------------------------
app.post('/addFSampleTime', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    // const {
    //   timing,
    //   costing }=req.body
      
    connection.query('INSERT INTO ie SET ?', req.body, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`sample with the name has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// get timing and costing----------------
app.get('/timeCost', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from ie', (err, rows) => {
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
// delete timing and costing
app.delete('/deleteTimeCost/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('DELETE from ie WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`sample with the id ${[req.params.id]} has been removed`)
      }
      else {
        console.log(err)
      }
    })
  })
})
// add sample qunatity of fabric------------------------------ (cad)---------------------------------
app.post('/addFSampleqnty', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    // const {qnty_fabric,
    // sample_id,
    // production_id}=req.body
    
    connection.query('INSERT INTO cad SET ?',req.body, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`sample with the name has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// get quantity of fabric----------------
app.get('/qntyFab', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from cad', (err, rows) => {
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
// deletequantity of fabric
app.delete('/deleteQntyFab/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('DELETE from cad WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`sample with the id ${[req.params.id]} has been removed`)
      }
      else {
        console.log(err)
      }
    })
  })
})
// ---------------------------------get all final sample result---------------------------------------
app.get('/get_all_smaples/:id', (req, res) => {
  const id=req.params.id
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT *
    FROM finalsample
    INNER JOIN ie
    ON finalsample.id = ie.smaple_id
    INNER JOIN cad
    ON finalsample.id = cad.sample_id
    where finalsample.s_id=?

    ;`,id, (err, rows) => {
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
// ---------------------------------------------final product------------------------------------------------
// add final sample image and measurement-------------------(production)----------------------------------------
app.post('/addFProImg/:id', (req, res) => {
  const productId = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const {
      img_url, 
      productname,
      measurement,
      quantity,
      color }=req.body
    
    connection.query('INSERT INTO finalproduction SET ?', {
      p_id: productId,
      image:img_url,
      productname:productname,
      quantity:quantity,
      color:color,
      measurement:measurement
    }, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`Product with the name has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// delete image and measurement
app.delete('/deleteProImg/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('DELETE from finalproduction WHERE id = ?', [req.params.id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`Product with the id ${[req.params.id]} has been removed`)
      }
      else {
        console.log(err)
      }
    })
  })
})
// get all product image -----------------------------------------------
app.get('/fProduct', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from finalproduction', (err, rows) => {
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
// add Product time and cost --------------------------------(IE)---------------------------------
app.post('/addFProTime', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    // const {
    //   timing,
    //   costing }=req.body
      
    connection.query('INSERT INTO ie SET ?', req.body, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`sample with the name has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// add product qunatity of fabric------------------------------ (cad)---------------------------------
app.post('/addFProQnty', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    // const {qnty_fabric,
    // sample_id,
    // production_id}=req.body
    
    connection.query('INSERT INTO cad SET ?',req.body, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`product with the name has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// ---------------------------------get all final product result---------------------------------------
app.get('/get_all_products/:id', (req, res) => {
  const id = req.params.id;
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT *
    FROM finalproduction
    INNER JOIN ie
    ON finalproduction.id = ie.production_id
    INNER JOIN cad
    ON finalproduction.id = cad.production_id
    where finalproduction.p_id = ?
    ;`,id, (err, rows) => {
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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`listening the port :${port}`)
})