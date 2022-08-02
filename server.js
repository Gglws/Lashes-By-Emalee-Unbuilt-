import express, { application } from "express";
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

app.post("/api/lash", (req, res) => {
  const newCustomer = req.body;

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
      res.set("Content-Type", "application/json");
      res.send(result.rows[0]);
    });
});

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
      res.type("application/json");
      res.send(result.rows);
    });
  } else {
    pool.query(sql, [`${nameId}%`]).then((result) => {
      res.type("application/json");
      res.send(result.rows);
    });
  }
});

app.get("/api/lash/", (req, res) => {
  var sql = `SELECT * FROM customers;`;

  pool.query(sql).then((result) => {
    res.type("application/json");
    res.send(result.rows);
  });
});

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
        res.sendStatus(404);
      } else {
        res.send(result.rows[0]);
      }
    });
});

app.use((err, req, res, next) => {
  res.sendStatus(500);
});

app.listen(PORT, () => {
  console.log("listening on port " + PORT);
});
