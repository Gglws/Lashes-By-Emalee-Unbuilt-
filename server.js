import express, { application, request } from "express";
import dotenv from "dotenv";

dotenv.config();

import pg from "pg";

const app = express();
const PORT = process.env.PORT;

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,

  ...(process.env.NODE_ENV === "production"
    ? {
        ssl: {
          rejectUnauthorized: false,
        },
      }
    : {}),
});

app.use(express.static("dist"));

app.use(express.json());

//creates new customer
app.post("/api/lash", (req, res) => {
  const newCustomer = req.body;

  pool
    .query(
      `SELECT * FROM customers  WHERE (first_name = $1 AND last_name = $2);`,
      [newCustomer.first_name, newCustomer.last_name]
    )
    .then((result) => {
      if (result.rows.length !== 0) {
        res.status(400).send();
      } else {
        var sql =
          "INSERT INTO customers (first_name, last_name, phone_number, eye_shape, lash_type, tweezers, brand) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

        pool
          .query(sql, [
            newCustomer.first_name,
            newCustomer.last_name,
            newCustomer.phone_number,
            newCustomer.eye_shape,
            newCustomer.lash_type,
            newCustomer.tweezers,
            newCustomer.brand,
          ])
          .then((result) => {
            res.status(201).send();
          });
      }
    });
});

//creates new appoinment
app.post("/api/app", (req, res) => {
  const newApp = req.body;
  let name = newApp.name
  let splitName = name.split(/\b\s+/);
  let first_name = splitName[0];
  let last_name = splitName[1];


  pool
    .query(
      `SELECT customer_id FROM customers  WHERE (first_name = $1 AND last_name = $2);`,
      [first_name, last_name]
    )
    .then((result) => {
      
      if (result.rows.length === 0) {
        res.status(404).send();
      } else {
        let customer_id = result.rows[0].customer_id;
        
        var sql =
          "INSERT INTO appointments (date, lash_style, length, thickness, curl, glue, primer, bonder, cleanser, customer_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";

        pool
          .query(sql, [
            newApp.date,
            newApp.lash_style,
            newApp.length,
            newApp.thickness,
            newApp.curl,
            newApp.glue,
            newApp.primer,
            newApp.bonder,
            newApp.cleanser,
            customer_id
          ])
          .then((result) => {
            res.status(201).send();
          });
     }
    });
});

//gets customer by name
app.get("/api/lash/:name", (req, res) => {
  const nameId = req.params.name.toLowerCase();
  var sql = "SELECT * FROM customers WHERE first_name LIKE $1;";

  let firstName = "";
  let lastName = "";

  if (nameId.includes(" ")) {
    let nameSplit = nameId.split(/\b\s+/);

    firstName = nameSplit[0];
    lastName = nameSplit[1];

    sql =
      "SELECT * FROM customers WHERE (first_name LIKE $1 AND last_name LIKE $2);";

    pool.query(sql, [`${firstName}%`, `${lastName}%`]).then((result) => {
      if (result.rows.length === 0) {
        res.status(404);
        res.send('Not found')
      } else {
        res.status(200);
        res.send(result.rows)
      }
    });
  } else {
    pool.query(sql, [`${nameId}%`]).then((result) => {
      if (result.rows.length === 0) {
        res.status(404);
        res.send('Not found')
      } else {
        res.status(200);
        res.send(result.rows)
      }
    });
  }
});

//gets all customers
app.get("/api/lash/", (req, res) => {
  var sql = `SELECT * FROM customers;`;

  pool.query(sql).then((result) => {
    if (result.rows.length === 0) {
      res.status(404);
        res.send('Not found')
    } else {
      res.status(200);
      res.send(result.rows)
    }
  });
});


//get appointments by date
app.get("/api/app/:date", async (req, res) => {

  const dateId = req.params.date;

  var sql = "SELECT * FROM appointments INNER JOIN customers on appointments.customer_id = customers.customer_id WHERE date = $1;";

  pool.query(sql, [dateId]).then((result) => {

    if (result.rows.length === 0) {
          res.status(404);
            res.send('Not found')
        } else {
          res.status(200);
          res.send(result.rows)
        }
      
  })

  

  //NOT DELETING BECAUSE THIS TOOK FOREVER :( 

  // let result1 = await appInfo(dateId); // wait until the promise resolves (*) 
  // let listOfId = [];

  // for(let i = 0; i < result1.length; i++) {
  //   listOfId.push(result1[i].customer_id);
  // }

  // const preparedToQuery = JSON.stringify(listOfId)
  // .replace('[', '{')
  // .replace(']', '}');

  // let result2 = await customerInfo(preparedToQuery); // wait until the promise resolves
 

  // for(let i =0; i < result1.length; i++){
  //   for(let j = 0; j < result2.length; j++){
  //     if(result1[i].customer_id === result2[j].customer_id){
  //       result1[i].first_name = result2[j].first_name;
  //       result1[i].last_name = result2[j].last_name;
  //     }
  //   }
    
   
  // }

  
  // if (result1.length === 0) {
  //   res.status(404);
  //     res.send('Not found')
  // } else {
  //   res.status(200);
  //   res.send(result1)
  // }


});

//gets all appointments
app.get("/api/app/", (req, res) => {

  var sql = 'SELECT * FROM appointments INNER JOIN customers on appointments.customer_id = customers.customer_id;';

  pool.query(sql).then((result) => {

    if (result.rows.length === 0) {
          res.status(404);
            res.send('Not found')
        } else {
          res.status(200);
          res.send(result.rows)
        }
      
  })

});


//gets appointment based on customer
app.get("/api/sp/:id", (req, res) => {

  const customerId = req.params.id;

  var sql = "SELECT * FROM appointments INNER JOIN customers on appointments.customer_id = customers.customer_id WHERE appointments.customer_id = $1;";
 
  pool.query(sql, [customerId]).then((result) => {

    if (result.rows.length === 0) {
          res.status(404);
            res.send('Not found')
        } else {
          res.status(200);
          res.send(result.rows)
        }
      
  })
})

//NOT DELETING BECAUSE MY PRIDE IS HURT 

  // let appInfo = async (dateId) =>{
  //   var  sql =  "SELECT * FROM appointments WHERE date = $1;";

  //   let results = await new Promise((resolve,reject) =>

  //   pool.query(sql, [dateId]).then((result) => {
  //     resolve(result.rows);
  //   })
  //   )
  //   return results;
  // }

  // let customerInfo = async (preparedToQuery) => {

  //   var sql = "SELECT customer_id, first_name, last_name FROM customers WHERE customer_id = ANY($1);";

  //   let results = await new Promise((resolve, reject) => 
    
  //   pool.query(sql, [preparedToQuery]).then((result) => {

  //     resolve(result.rows);

  //   })

  //   )

  //   return results;
  // }

//Delete request for specific customer
app.delete("/api/lash", (req, res, next) => {
  const customerID = req.body;

  var sql = "DELETE FROM customers WHERE customer_id = $1 RETURNING *;";

  pool.query(sql, [customerID.id]).then((data) => {
    if (data.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});

//Delete request for specific appointment
app.delete("/api/app", (req, res, next) => {
  const appID = req.body;

  var sql = "DELETE FROM appointments WHERE appointment_id = $1 RETURNING *;";

  pool.query(sql, [appID.id]).then((data) => {
    if (data.rows.length === 0) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  });
});


//update request for customer
app.patch("/api/lash/:id", (req, res, next) => {
  const customerId = Number(req.params.id);

  const {
    first_name,
    last_name,
    phone_number,
    eye_shape,
    lash_type,
    tweezers,
    brand,
  } = req.body;

  pool
    .query(
      `
        UPDATE customers
        SET first_name = COALESCE($1, first_name),
            last_name = COALESCE($2, last_name),
            phone_number = COALESCE($3, phone_number),
            eye_shape = COALESCE($4, eye_shape),
            lash_type = COALESCE($5, lash_type),
            tweezers = COALESCE($6, tweezers),
            brand = COALESCE($7, brand)
        WHERE customer_id = $8
        RETURNING *;
        `,
      [
        first_name,
        last_name,
        phone_number,
        eye_shape,
        lash_type,
        tweezers,
        brand,
        customerId,
      ]
    )
    .then((result) => {
      if (result.rows.length === 0) {
        res.sendStatus(400);
      } else {
        res.sendStatus(200);
      }
    });
});

//update request for appointment
app.patch("/api/app/:id", (req, res, next) => {
  const appId = Number(req.params.id);
  
  const newApp = req.body;
  let name = newApp.name
  let splitName = name.split(/\b\s+/);
  let first_name = splitName[0];
  let last_name = splitName[1];


  pool
    .query(
      `SELECT customer_id FROM customers  WHERE (first_name = $1 AND last_name = $2);`,
      [first_name, last_name]
    )
    .then((result) => {
      
      if (result.rows.length === 0) {
        res.status(404).send();
      } else {
        let customer_id = result.rows[0].customer_id;
        
        var sql =
          `UPDATE appointments 
            SET date = COALESCE($1, date),
                lash_style = COALESCE($2, lash_style),
                length = COALESCE($3, length),
                thickness = COALESCE($4, thickness),
                curl = COALESCE($5, curl),
                glue = COALESCE($6, glue),
                primer = COALESCE($7, primer),
                bonder = COALESCE($8, bonder),
                cleanser = COALESCE($9, cleanser),
                customer_id = COALESCE($10, customer_id)
                WHERE appointment_id = $11 RETURNING*;`;
          
        pool
          .query(sql, [
            newApp.date,
            newApp.lash_style,
            newApp.length,
            newApp.thickness,
            newApp.curl,
            newApp.glue,
            newApp.primer,
            newApp.bonder,
            newApp.cleanser,
            customer_id,
            appId,
          ])
          .then((result) => {
            res.status(200).send();
          });
     }
    });
     
  
});




app.use((err, req, res, next) => {
  res.sendStatus(500);
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
