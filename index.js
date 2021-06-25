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
// get all user -----------------------------------------------
app.get('/users', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from users', (err, rows) => {
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
// get single buyer
app.get('/buyer/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)

    connection.query('SELECT * from users WHERE id = ?', [req.params.id], (err, rows) => {
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
// update buyer-----------------
app.put('/updatebuyer/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const id =req.params.id;
    const {name,designation,department,email,password}  = req.body;
    console.log("new",department,id);

    connection.query('UPDATE users SET name = ?, designation = ?, department = ?, email = ?, password = ? WHERE id = ?', [name,designation,department,email,password, id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`Buyer with the name ${id} has been updated`)
      }
      else {
        console.log(err)
      }
    })
    // console.log(req.body);
  })
})
// delete buyer----------------
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

// -----------------------------sample upload--------------------------------------
app.post('/upload', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const {
      measurement,
      fabric,
      img_url,
      email  }=req.body
    
    connection.query('INSERT INTO samples SET ?', {
      image:img_url,
      fabric:fabric,
      measurement:measurement,
      email:email
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
// buyer get sample
app.get('/samples', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from samples WHERE email = ?', [req.query.email], (err, rows) => {
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
// get single sample
app.get('/sample/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)

    connection.query('SELECT * from samples WHERE id = ?', [req.params.id], (err, rows) => {
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
// update Feedback-----------------
app.put('/updatefeedback/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const id =req.params.id;
    const {feedback}  = req.body;
    console.log("new",feedback,id);

    connection.query('UPDATE samples SET feedback = ? WHERE id = ?', [feedback, id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`Samples with the name ${id} has been updated`)
      }
      else {
        console.log(err)
      }
    })
    // console.log(req.body);
  })
})
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
// buyer get order
app.get('/orders', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from orders WHERE email = ?', [req.query.email], (err, rows) => {
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
// add payment info----------
app.post('/addPayment/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const paymentRecord = req.body
    connection.query('INSERT INTO payment SET ?', paymentRecord, (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`user with the name ${[paymentRecord.id]} has been added`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// marchandiser get order payment status
app.get('/orderStatusBuy', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT * from orders WHERE status = "Confirmed" and email = ?`, [req.query.email] , (err, rows) => {
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
// update order status------------------------------ (marchandiser)---------------------------------

app.put('/updateStatus/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const { id, status } = req.body;
    connection.query('UPDATE orders SET  status = ? WHERE id = ?', [status, id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`supplier with the name ${id} has been updated`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// paid-------------
app.put('/updatePayment/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const { id, payment_status } = req.body;
    connection.query('UPDATE orders SET  payment_status = ? WHERE id = ?', [payment_status, id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`supplier with the name ${id} has been updated`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// marchandiser get order payment status
// app.get('/orderStatusPay', (req, res) => {
//   pool.getConnection((err, connection) => {
//     if (err) throw err
//     console.log(`connected as id ${connection.threadId}`)
//     connection.query(`SELECT * from orders WHERE status = "Confirmed" and payment_status = "Recieved" `, (err, rows) => {
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
app.get('/get_all_Payment', (req, res) => {
  // const id=req.params.id
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT *
    FROM orders
    INNER JOIN payment
    ON orders.id = payment.order_id
   where status = "Confirmed" and payment_status = "Recieved"

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
// get only confirmed order 
app.get('/ordersStatus', (req, res) => {

  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT * from orders where status = "Confirmed"`, (err, rows) => {
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
app.put('/updateSupplier/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const id = req.params.id;
    const {companyName, name, email, materialName, quantity, totalAmount, orderDate, deliveryDate } = req.body;
    console.log("new",companyName,id);
    
    connection.query('UPDATE suppliers SET companyName = ?, name = ?, email = ?, materialName = ?, quantity = ?, totalAmount = ?, orderDate = ?, deliveryDate= ? WHERE id = ?', [companyName, name, email, materialName, quantity, totalAmount, orderDate, deliveryDate, id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`supplier with the name ${materialName} has been updated`)
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
      measurement,
      feedbackk }=req.body;
    
    connection.query('INSERT INTO finalsample SET ?', {
      s_id: sampleId,
      image:img_url,
      measurement:measurement,
      feedbackk:feedbackk
   
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
// update Final sample image 
app.put('/updateFSampleImg/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const id = req.params.id;
    const {image, measurement} = req.body;
    connection.query('UPDATE finalsample SET  image= ?, measurement= ? WHERE id = ?', [image, measurement, id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`Sample with the name ${id} has been updated`)
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
// get all sample image -----------------------------------------------
app.get('/fSamples/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from finalsample WHERE id = ?', [req.params.id], (err, rows) => {
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
app.get('/timeCost/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from ie WHERE id = ?',[req.params.id], (err, rows) => {
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
// Update single sample time-----------------------------------------
app.put('/updateSaTime/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const id = req.params.id;
   const {
      timing,
      costing }=req.body;
    console.log("new",timing,id);
  
    connection.query('UPDATE ie SET timing = ?,costing=?  WHERE id = ?', [timing,costing, id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`supplier with the name ${timing} has been updated`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
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
// get quantity of fabric----------------
app.get('/qntyFab/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from cad WHERE id = ?',[req.params.id], (err, rows) => {
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
// Update single sample qnty-----------------------------------------
app.put('/updateSaQnty/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const id = req.params.id;
     const {qnty_fabric
   }=req.body
    console.log("new",qnty_fabric,id);
    
    connection.query('UPDATE cad SET qnty_fabric = ? WHERE id = ?', [qnty_fabric, id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`supplier with the name ${qnty_fabric} has been updated`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
  })
})
// ---------------------------------get all final sample result---------------------------------------
//fjfjfj/check-img/ie/29
//fjdkfjd/check-img/cad/29
app.get('/check-imgie/:id',(req,res)=>{
  const id=req.params.id
  // const table=req.params.table
  pool.query(`SELECT * FROM ie WHERE smaple_id=${id}`,(err,results)=>{
    if(err){
      res.send("some error"+err.message)
    }else{
      if(results.length>0){
        res.send({added:true})
      }else{
        res.send({added:false})
      }
    }
  })
})
//fjdkfjd/check-img/cad/29
app.get('/check-imgcad/:id',(req,res)=>{
  const id=req.params.id
  // const table=req.params.table
  pool.query(`SELECT * FROM cad WHERE sample_id=${id}`,(err,results)=>{
    if(err){
      res.send("some error"+err.message)
    }else{
      if(results.length>0){
        res.send({added:true})
      }else{
        res.send({added:false})
      }
    }
  })
})



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

app.get('/get_all_smaple_img', (req, res) => {
  // const id=req.params.id
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT finalsample.id,finalsample.s_id,finalsample.image,finalsample.measurement
    FROM finalsample
    INNER JOIN ie
    ON finalsample.id = ie.smaple_id
    INNER JOIN cad
    ON finalsample.id = cad.sample_id
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

//only for timecost
app.get('/get_all_smaple_tc', (req, res) => {
  // const id=req.params.id
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT ie.id,ie.timing,ie.costing
    FROM finalsample
    INNER JOIN ie
    ON finalsample.id = ie.smaple_id
    INNER JOIN cad
    ON finalsample.id = cad.sample_id
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

//only for cad
app.get('/get_all_smaple', (req, res) => {
  // const id=req.params.id
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT *
    FROM finalsample
    INNER JOIN ie
    ON finalsample.id = ie.smaple_id
    INNER JOIN cad
    ON finalsample.id = cad.sample_id
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
// get single product image -----------------------------------------------
app.get('/fProducts/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query('SELECT * from finalproduction WHERE id = ?', [req.params.id],(err, rows) => {
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
// update Final product image 
app.put('/updateFProductImg/:id', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    const id = req.params.id;
    const {image, measurement, color, quantity,productname} = req.body;
    connection.query('UPDATE finalproduction SET  image= ?, measurement= ?, color=?, quantity=?, productname=? WHERE id = ?', [image, measurement,color, quantity, productname, id], (err, rows) => {
      connection.release()
      if (!err) {
        res.send(`Sample with the name ${id} has been updated`)
      }
      else {
        console.log(err)
      }
    })
    console.log(req.body);
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

//fjfjfj/check-img/ie/29
//fjdkfjd/check-img/cad/29
app.get('/check-img/:table/:id',(req,res)=>{
  const id=req.params.id
  const table=req.params.table
  pool.query(`SELECT * FROM ${table} WHERE production_id=${id}`,(err,results)=>{
    if(err){
      res.send("some error"+err.message)
    }else{
      if(results.length>0){
        res.send({added:true})
      }else{
        res.send({added:false})
      }
    }
  })
})

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
app.get('/get_all_product', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT *
    FROM finalproduction
    INNER JOIN ie
    ON finalproduction.id = ie.production_id
    INNER JOIN cad
    ON finalproduction.id = cad.production_id
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

app.get('/get_all_product_img', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT finalproduction.id,finalproduction.p_id,finalproduction.image,finalproduction.measurement,finalproduction.color,finalproduction.quantity,finalproduction.productname
    FROM finalproduction
    INNER JOIN ie
    ON finalproduction.id = ie.production_id
    INNER JOIN cad
    ON finalproduction.id = cad.production_id
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


app.get('/get_all_product_tc', (req, res) => {
  pool.getConnection((err, connection) => {
    if (err) throw err
    console.log(`connected as id ${connection.threadId}`)
    connection.query(`SELECT ie.id,ie.timing,ie.costing
    FROM finalproduction
    INNER JOIN ie
    ON finalproduction.id = ie.production_id
    INNER JOIN cad
    ON finalproduction.id = cad.production_id
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

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`listening the port :${port}`)
})